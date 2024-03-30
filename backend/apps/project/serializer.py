from rest_framework import serializers
from project.models import Project, Contributor, ProjectStatuses

from utils.custom_exception import CustomException


class ProjectSerializer(serializers.ModelField):
    pass


class ContributorSerializer(serializers.ModelField):
    pass
