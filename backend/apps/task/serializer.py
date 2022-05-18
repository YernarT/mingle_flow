from django.core.handlers.wsgi import WSGIRequest
from utils.data import serialized_data


def task_serializer(request: WSGIRequest, task_model):
    return serialized_data(request, task_model, {'is_multiple': False})


def task_list_serializer(request: WSGIRequest, task_model_list):
    return serialized_data(request, task_model_list)


def task_result_serializer(request: WSGIRequest, task_result_model):
    return serialized_data(request, task_result_model, {'is_multiple': False, 'hypermedia_fields': ['file']})


def task_result_list_serializer(request: WSGIRequest, task_result_model_list):
    return serialized_data(request, task_result_model_list, {'hypermedia_fields': ['file']})
