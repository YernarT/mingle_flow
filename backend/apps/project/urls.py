from django.conf.urls import url
from project.views import ProjectAPI, ContributorAPI


urlpatterns = [
    url(r'^project/$', ProjectAPI.as_view()),
    url(r'^contributor/$', ContributorAPI.as_view()),

    #     url(r'^user/notification/$', NotificationView.as_view()),
    #     url(r'^user/notification/(?P<id>\d+)/$', NotificationSingleView.as_view()),
]

app_name = 'project'
