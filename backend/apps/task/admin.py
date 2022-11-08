from django.contrib import admin
from task.models import Task, TaskPrincipal, SubmittedResult

admin.site.register(Task)
admin.site.register(TaskPrincipal)
admin.site.register(SubmittedResult)