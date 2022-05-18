from django.http import JsonResponse

from team.models import Team, TeamMember
from team.serializer import team_serializer, team_list_serializer, team_member_serializer, team_member_list_serializer
from user.models import User
from user.serializer import user_serializer

from utils.request_middleware import API_View
from utils.error import UnauthorizedError


class TeamAPI(API_View):
    model_cls = Team
    query_set = Team.objects.all()

    def get(self, request):

        serialized_teams, teams_model = self.get_base_query_set(
            request, team_list_serializer)

        for idx, team in enumerate(teams_model):
            members_model = team.teammember_set.all()
            members = [user_serializer(request, member_model.member)
                       for member_model in members_model]

            serialized_teams[idx]['members'] = members

        return JsonResponse({'teams': serialized_teams}, status=200)

    def post(self, request):

        try:
            user = self.get_user(request)
        except (UnauthorizedError) as e:
            return JsonResponse(**e.response_context)

        data = self.get_data(request)
        data['creator'] = user['model']

        model_obj = self.model_cls.objects.create(**data)
        team = team_serializer(request, model_obj)

        member_model = TeamMember.objects.create(
            team=model_obj, member=user['model'])
        member = team_member_serializer(request, member_model)

        team['members'] = [member]

        return JsonResponse({'team': team, 'message': 'Сәтті құрылды'}, status=201)


class TeamMemberAPI(API_View):
    model_cls = TeamMember
    query_set = TeamMember.objects.all()

    def get(self, request):

        _, members_model = self.get_base_query_set(
            request, team_member_list_serializer)

        params = self.get_params(request)['params']
        team_id = params.get('team_id')

        if team_id:
            members_model = members_model.filter(team=Team.objects.get(id=team_id))
        else:
            members_model = []

        members = [user_serializer(request, member_model.member)
                       for member_model in members_model]

        return JsonResponse({'members': members}, status=200)

    def post(self, request):

        pass
