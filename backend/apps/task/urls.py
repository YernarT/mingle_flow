from django.conf.urls import url
from task.views import TaskAPI, TaskResultAPI


urlpatterns = [
    url(r'^task/$', TaskAPI.as_view()),
    url(r'^task/submission/$', TaskResultAPI.as_view()),
]

app_name = 'task'
