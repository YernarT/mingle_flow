from django.core.handlers.wsgi import WSGIRequest
from utils.data import serialized_data


def team_serializer(request: WSGIRequest, team_model):
    return serialized_data(request, team_model, {'is_multiple': False})


def team_list_serializer(request: WSGIRequest, team_model_list):
    return serialized_data(request, team_model_list)


def team_member_serializer(request: WSGIRequest, team_member_model):
    return serialized_data(request, team_member_model, {'is_multiple': False})


def team_member_list_serializer(request: WSGIRequest, team_member_model_list):
    return serialized_data(request, team_member_model_list)
