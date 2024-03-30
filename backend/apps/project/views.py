from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from rest_framework.response import Response


from project.models import Project, Contributor
from user.models import User
from project.serializer import ProjectSerializer, ContributorSerializer

from utils.authentication import LoginRequiredAuthentication


class ProjectViewSet(ModelViewSet):
    """
    项目 API 类
    """
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    authentication_classes = [LoginRequiredAuthentication]


class ContributorViewSet(ModelViewSet):
    """
    成员 API 类
    """
    queryset = Contributor.objects.all()
    serializer_class = ContributorSerializer
    authentication_classes = [LoginRequiredAuthentication]
