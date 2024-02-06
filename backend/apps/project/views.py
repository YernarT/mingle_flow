# from django.http import JsonResponse

# from project.models import Project, Contributor
# from user.models import User
# from user.serializer import user_serializer

# from utils.request_middleware import API_View
# from utils.data import serialized_data
# from utils.error import UnauthorizedError


# class ProjectAPI(API_View):
#     model_cls = Project

#     def get(self, request):

#         serialized_projects, projects_model = self.get_base_query_set(
#             request, serialized_data)

#         for idx, project in enumerate(projects_model):
#             contributors_model = project.contributor_set.all()
#             contributors = [user_serializer(request, contributor.user)
#                             for contributor in contributors_model]

#             serialized_projects[idx]['contributors'] = contributors

#         return JsonResponse({'projects': serialized_projects}, status=200)

#     def post(self, request):

#         try:
#             user = self.get_user(request)
#         except (UnauthorizedError) as e:
#             return JsonResponse(**e.response_context)

#         data = self.get_data(request)
#         data['creator'] = user['model']

#         model_obj = self.model_cls.objects.create(**data)
#         project = serialized_data(request, model_obj, {'is_multiple': False})

#         contributor_model = Contributor.objects.create(
#             project=model_obj, user=user['model'])
#         contributor = serialized_data(
#             request, contributor_model, {'is_multiple': False})

#         project['contributors'] = [contributor]

#         return JsonResponse({'project': project, 'message': 'Сәтті құрылды'}, status=201)


# class ContributorAPI(API_View):
#     model_cls = Contributor

#     def get(self, request):

#         _, contributors_model = self.get_base_query_set(
#             request, serialized_data)

#         params = self.get_params(request)['params']
#         project_id = params.get('project_id')

#         if project_id:
#             contributors_model = contributors_model.filter(
#                 project=Project.objects.get(id=project_id))
#         else:
#             contributors_model = []

#         contributors = []
#         for contributor_model in contributors_model:
#             contributor = serialized_data(request, contributor_model, {'is_multiple': False})
#             contributor['user'] = user_serializer(request, contributor_model.user)
#             contributors.append(contributor)

#         return JsonResponse({'contributors': contributors}, status=200)

#     def post(self, request):

#         try:
#             _ = self.get_user(request)
#         except (UnauthorizedError) as e:
#             return JsonResponse(**e.response_context)

#         data: dict = self.get_data(request)
#         project_id: int = data['project_id']
#         contributors: list[int] = data['contributors']

#         project = Project.objects.get(id=project_id)
#         project_contributors = []

#         for contributor in contributors:
#             user_model = User.objects.get(id=contributor)
#             contributor_model = self.model_cls.objects.create(
#                 project=project,
#                 user=user_model
#             )
#             contributor = serialized_data(request, contributor_model, {'is_multiple': False})
#             contributor['user'] = user_serializer(request, user_model)
#             project_contributors.append(contributor)

#         return JsonResponse({'contributors': project_contributors}, status=200)
