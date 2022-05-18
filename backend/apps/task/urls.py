from django.conf.urls import url
from task.views import TaskAPI


urlpatterns = [
    url(r'^task/$', TaskAPI.as_view()),

    #     url(r'^user/notification/$', NotificationView.as_view()),
    #     url(r'^user/notification/(?P<id>\d+)/$', NotificationSingleView.as_view()),
]

app_name = 'task'
