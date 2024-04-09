from rest_framework import serializers

from user.serializer import UserSerializer
from project.models import Project, Contributor, ProjectStatuses
from task.models import Task


class ProjectSerializer(serializers.ModelSerializer):

    class Meta:
        model = Project
        fields = '__all__'

    def to_representation(self, instance):
        data = super().to_representation(instance)

        contributor_list = Contributor.objects.filter(project=instance)
        contributor_count = contributor_list.count()
        data['contributor_count'] = contributor_count
        data['contributor_list'] = ContributorSerializer(
            instance=contributor_list[:7], many=True).data
        data['task_count'] = Task.objects.filter(project=instance).count()
        data['progress'] = instance.get_progress()

        return data


class ContributorSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Contributor
        fields = '__all__'
