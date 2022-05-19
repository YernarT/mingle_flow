from django.http import JsonResponse

from task.models import Task, TaskResult
from task.serializer import task_serializer, task_list_serializer, task_result_serializer, task_result_list_serializer
from team.models import Team

from utils.request_middleware import API_View
from utils.error import UnauthorizedError


class TaskAPI(API_View):
    model_cls = Task
    query_set = Task.objects.all()

    def get(self, request):

        _, tasks_model = self.get_base_query_set(
            request, task_list_serializer)

        params = self.get_params(request)['params']
        team_id = params.get('team_id')

        if team_id:
            tasks_model = tasks_model.filter(team=Team.objects.get(id=team_id))

        tasks_model = task_list_serializer(request, tasks_model)

        return JsonResponse({'tasks': tasks_model}, status=200)

    def post(self, request):

        try:
            user = self.get_user(request)
        except (UnauthorizedError) as e:
            return JsonResponse(**e.response_context)

        from datetime import datetime
        data = self.get_data(request)
        data['start_time'] = datetime.strptime(
            data['start_time'], '%Y-%m-%d %H:%M:%S')
        data['end_time'] = datetime.strptime(
            data['end_time'], '%Y-%m-%d %H:%M:%S')
        data['creator'] = user['model']
        data['team'] = Team.objects.get(id=data['team'])

        model_obj = self.model_cls.objects.create(**data)

        return JsonResponse({'task': task_serializer(request, model_obj), 'message': 'Сәтті жарияланды'}, status=201)


class TaskResultAPI(API_View):
    model_cls = TaskResult
    query_set = TaskResult.objects.all()

    def get(self, request):
        _, task_results_model = self.get_base_query_set(
            request, task_result_list_serializer)

        params = self.get_params(request)['params']
        task_id = params.get('task_id')

        if task_id:
            task_results_model = task_results_model.filter(
                task=Task.objects.get(id=task_id))

        task_results = task_result_list_serializer(
            request, task_results_model)

        return JsonResponse({'submissions': task_results}, status=200)

    def post(self, request):

        try:
            user = self.get_user(request)['model']
        except (UnauthorizedError) as e:
            return JsonResponse(**e.response_context)

        file = request.FILES.get('file')
        task_id = request.POST.get('task_id')
        task = Task.objects.get(id=task_id)

        if not file:
            return JsonResponse({
                'message': 'Файлді жүктеу керек'
            }, status=400)

        self.model_cls.objects.create(
            task=task, file=file, submitter=user, submitted=True, finished=False)

        return JsonResponse({}, status=201)
