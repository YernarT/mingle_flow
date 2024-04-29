from rest_framework import serializers

from user.serializer import UserSerializer
from project.serializer import ProjectSerializer
from task.models import Task, TaskAttachement, TaskComment


class TaskSerializer(serializers.ModelSerializer):

    class Meta:
        model = Task
        fields = '__all__'

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['creator'] = UserSerializer(instance=instance.creator, context=self.context).data
        data['project'] = ProjectSerializer(instance=instance.project, context=self.context).data
        data['tags'] = instance.tags.join(',')
        if instance.worker:
            data['worker'] = UserSerializer(instance=instance.worker, context=self.context).data
        attachement_list = TaskAttachement.objects.filter(task=instance)
        data['attachement_list'] = TaskAttachementSerializer(
            instance=attachement_list, many=True).data
        comment_list = TaskComment.objects.filter(task=instance)
        data['comment_list'] = TaskCommentSerializer(instance=comment_list, many=True).data

        return data


class TaskAttachementSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = TaskAttachement
        fields = '__all__'


class TaskCommentSerializer(serializers.ModelSerializer):

    class Meta:
        model = TaskComment
        fields = '__all__'
