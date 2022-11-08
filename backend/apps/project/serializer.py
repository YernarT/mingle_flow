from django.core.handlers.wsgi import WSGIRequest
from utils.data import serialized_data


def project_serializer(request: WSGIRequest, project_model):
    return serialized_data(request, project_model, {'is_multiple': False})


def project_list_serializer(request: WSGIRequest, project_model_list):
    return serialized_data(request, project_model_list)


def contributor_serializer(request: WSGIRequest, contributor_model):
    return serialized_data(request, contributor_model, {'is_multiple': False})


def contributor_list_serializer(request: WSGIRequest, contributor_model_list):
    return serialized_data(request, contributor_model_list)
