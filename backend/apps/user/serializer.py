from django.core.handlers.wsgi import WSGIRequest
from utils.data import serialized_data


def user_serializer(request: WSGIRequest, user_model):
    return serialized_data(request, user_model, {'is_multiple': False, 'exclude_fields': ['password'], 'hypermedia_fields': ['avatar']})


def user_list_serializer(request: WSGIRequest, user_model_list):
    return serialized_data(request, user_model_list, {'exclude_fields': ['password'], 'hypermedia_fields': ['avatar']})
