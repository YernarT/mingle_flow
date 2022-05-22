from django.conf.urls import url
from task.views import TaskAPI, TaskResultAPI, TaskReportAPI


urlpatterns = [
    url(r'^task/$', TaskAPI.as_view()),
    url(r'^task/submission/$', TaskResultAPI.as_view()),
    url(r'^task/report/$', TaskReportAPI.as_view()),
]

app_name = 'task'
