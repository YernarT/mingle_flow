from django.core.handlers.wsgi import WSGIRequest
from utils.data import serialized_data
from user.serializer import user_serializer


def task_serializer(request: WSGIRequest, task_model):
    serialized_task = serialized_data(
        request, task_model, {'is_multiple': False})

    serialized_task['project'] = serialized_data(
        request, task_model.project, {'is_multiple': False})
    serialized_task['creator'] = user_serializer(request, task_model.creator)
    serialized_task['responsibles'] = []

    for cmd in dir(task_model):
        print(cmd)

    for task_principal_model in task_model.taskprincipal_set.all():
        # 本质上是 serialized user list
        serialized_task_principal = user_serializer(request, task_principal_model.user)
        serialized_task['responsibles'].append(serialized_task_principal)

    return serialized_task


def task_list_serializer(request: WSGIRequest, task_model_list):
    return [task_serializer(request, task_model) for task_model in task_model_list]

def task_result_serializer(request: WSGIRequest, task_result_model):
    return serialized_data(request, task_result_model, {'is_multiple': False, 'hypermedia_fields': ['file']})


def task_result_list_serializer(request: WSGIRequest, task_result_model_list):
    return serialized_data(request, task_result_model_list, {'hypermedia_fields': ['file']})
