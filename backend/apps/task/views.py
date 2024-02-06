# from django.http import JsonResponse

# from task.models import Task, TaskPrincipal, SubmittedResult
# from task.serializer import task_serializer, task_list_serializer, task_result_serializer, task_result_list_serializer
# from project.models import Project, Contributor
# from user.models import User
# from user.serializer import user_serializer

# from utils.request_middleware import API_View
# from utils.data import serialized_data
# from utils.error import UnauthorizedError


# class TaskAPI(API_View):
#     model_cls = Task

#     def get(self, request):

#         _, task_model_list = self.get_base_query_set(
#             request, task_list_serializer)

#         params = self.get_params(request)['params']
#         project_id = params.get('project_id')

#         if project_id:
#             task_model_list = task_model_list.filter(
#                 project=Project.objects.get(id=project_id))

#         serialized_task_list = task_list_serializer(request, task_model_list)

#         return JsonResponse({'tasks': serialized_task_list}, status=200)

#     def post(self, request):

#         try:
#             user = self.get_user(request)
#         except (UnauthorizedError) as e:
#             return JsonResponse(**e.response_context)

#         from datetime import datetime
#         data = self.get_data(request)
#         task_model_data = {
#             'name': data['name'],
#             'description': data['description'],
#             'start_time': datetime.strptime(data['start_time'], '%Y-%m-%d %H:%M:%S'),
#             'end_time': datetime.strptime(data['end_time'], '%Y-%m-%d %H:%M:%S'),
#             'creator': user['model'],
#             'funds': data['funds'],
#             'project': Project.objects.get(id=data['project'])
#         }
#         responsibles: list[int] = data['responsibles']

#         model_obj = self.model_cls.objects.create(**task_model_data)

#         serialized_task = serialized_data(
#             request, model_obj, {'is_multiple': False})

#         serialized_task['project'] = serialized_data(
#             request, model_obj.project, {'is_multiple': False})
#         serialized_task['creator'] = user_serializer(
#             request, model_obj.creator)
#         serialized_task['responsibles'] = []

#         for task_principal in responsibles:
#             task_principal_model = TaskPrincipal.objects.create(
#                 task=model_obj,
#                 user=User.objects.get(id=task_principal)
#             )

#             # 本质上是 serialized user list
#             serialized_task_principal = {
#                 'user': user_serializer(request, task_principal_model.user)
#             }
#             serialized_task['responsibles'].append(serialized_task_principal)

#         return JsonResponse({'task': serialized_task, 'message': 'Сәтті жарияланды'}, status=201)


# class TaskResultAPI(API_View):
#     # model_cls = TaskResult
#     # query_set = TaskResult.objects.all()

#     def get(self, request):
#         _, task_results_model = self.get_base_query_set(
#             request, task_result_list_serializer)

#         params = self.get_params(request)['params']
#         task_id = params.get('task_id')

#         # if task_id:
#         # task_results_model = task_results_model.filter(
#         # task=Task.objects.get(id=task_id))

#         task_results = []
#         for task_result_model in task_results_model:
#             task_result = task_result_serializer(request, task_result_model)
#             task_result['submitter'] = user_serializer(
#                 request, task_result_model.submitter)
#             task_results.append(task_result)

#         return JsonResponse({'submissions': task_results}, status=200)

#     def post(self, request):

#         try:
#             user = self.get_user(request)['model']
#         except (UnauthorizedError) as e:
#             return JsonResponse(**e.response_context)

#         file = request.FILES.get('file')
#         task_id = request.POST.get('task_id')
#         # task = Task.objects.get(id=task_id)

#         if not file:
#             return JsonResponse({
#                 'message': 'Файлді жүктеу керек'
#             }, status=400)

#         # self.model_cls.objects.create(
#             # task=task, file=file, submitter=user, submitted=True, finished=False)

#         return JsonResponse({}, status=201)

#     def put(self, request):

#         try:
#             _ = self.get_user(request)['model']
#         except (UnauthorizedError) as e:
#             return JsonResponse(**e.response_context)

#         data = self.get_data(request)
#         submission_id = data['submission_id']

#         task_result_model = self.model_cls.objects.get(id=submission_id)
#         task_result_model.finished = True
#         task_result_model.save()

#         task_result = task_result_serializer(request, task_result_model)
#         task_result['submitter'] = user_serializer(
#             request, task_result_model.submitter)

#         return JsonResponse({'submission': task_result}, status=200)


# class TaskReportAPI(API_View):
#     # model_cls = Task
#     # query_set = Task.objects.all()

#     def get(self, request):

#         tasks_model = self.query_set.order_by('start_time')
#         tasks = task_list_serializer(request, tasks_model)

#         for idx, task_model in enumerate(tasks_model):
#             task_results_model = task_model.taskresult_set.all()
#             tasks[idx]['results'] = task_result_list_serializer(
#                 request, task_results_model)

#         return JsonResponse({'tasks': tasks}, status=200)
