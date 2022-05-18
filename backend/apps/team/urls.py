from django.conf.urls import url
from team.views import TeamAPI, TeamMemberAPI


urlpatterns = [
    url(r'^team/$', TeamAPI.as_view()),
    url(r'^team_member/$', TeamMemberAPI.as_view()),

    #     url(r'^user/notification/$', NotificationView.as_view()),
    #     url(r'^user/notification/(?P<id>\d+)/$', NotificationSingleView.as_view()),
]

app_name = 'team'
