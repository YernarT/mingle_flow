from django.contrib import admin
from task.models import Task, TaskResult

admin.site.register(Task)
admin.site.register(TaskResult)