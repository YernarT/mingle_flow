from rest_framework import serializers

from user.serializer import UserSerializer
from task.models import Task, TaskAttachement, TaskComment


class TaskSerializer(serializers.ModelSerializer):

    class Meta:
        model = Task
        fields = '__all__'


class TaskAttachementSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = TaskAttachement
        fields = '__all__'


class TaskCommentSerializer(serializers.ModelSerializer):

    class Meta:
        model = TaskComment
        fields = '__all__'
