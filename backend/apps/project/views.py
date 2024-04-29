from rest_framework.viewsets import ModelViewSet

from project.models import Project, Contributor
from project.serializer import ProjectSerializer, ContributorSerializer

from utils.authentication import LoginRequiredAuthentication


class ProjectViewSet(ModelViewSet):
    """
    项目 API 类
    """
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    authentication_classes = [LoginRequiredAuthentication]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({'request': self.request})

        return context


class ContributorViewSet(ModelViewSet):
    """
    成员 API 类
    """
    queryset = Contributor.objects.all()
    serializer_class = ContributorSerializer
    authentication_classes = [LoginRequiredAuthentication]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({'request': self.request})

        return context
