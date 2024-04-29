from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet


from task.models import Task, TaskAttachement, TaskComment, TaskStatuses
from task.serializer import TaskSerializer, TaskAttachementSerializer, TaskCommentSerializer
from user.models import User
from project.models import Project

from utils.authentication import LoginRequiredAuthentication
from utils.custom_exception import CustomException


class TaskViewSet(ModelViewSet):
    """
    任务 API 类
    """
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    authentication_classes = [LoginRequiredAuthentication]

    def get_queryset(self):
        if self.action == 'list':
            project_id = self.request.query_params.get('project')
            if project_id is None:
                raise CustomException(message='Project id is required')

            try:
                project = Project.objects.get(id=project_id)
            except Project.DoesNotExist:
                raise CustomException(message='Given project is not exist', status_code=401)

            return project.tasks

        return super().get_queryset()

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        task_list = response.data

        grouped_list = {
            'backlog': [],
            'analyze': [],
            'develop': [],
            'test': [],
            'finish': []
        }

        for task in task_list:
            if task['status'] == TaskStatuses.BACKLOG:
                grouped_list['backlog'].append(task)
            elif task['status'] == TaskStatuses.ANALYZE:
                grouped_list['analyze'].append(task)
            elif task['status'] == TaskStatuses.DEVELOP:
                grouped_list['develop'].append(task)
            elif task['status'] == TaskStatuses.TEST:
                grouped_list['test'].append(task)
            elif task['status'] == TaskStatuses.FINISH:
                grouped_list['finish'].append(task)

        response.data = grouped_list
        return response


class TaskAttachementViewSet(ModelViewSet):
    """
    任务附件 API 类
    """
    queryset = TaskAttachement.objects.all()
    serializer_class = TaskAttachementSerializer
    authentication_classes = [LoginRequiredAuthentication]


class TaskCommentViewSet(ModelViewSet):
    """
    任务评论 API 类
    """
    serializer_class = TaskCommentSerializer
    queryset = TaskComment.objects.all()
    authentication_classes = [LoginRequiredAuthentication]
