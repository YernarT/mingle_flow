from django.conf.urls import url
from user.views import LoginAPI, RegisterAPI, UserAPI, UserAvatarAPI


urlpatterns = [
    url(r'^user/login/$', LoginAPI.as_view()),
    url(r'^user/register/$', RegisterAPI.as_view()),

    url(r'^user/$', UserAPI.as_view()),
    url(r'^user/upload_avatar/$', UserAvatarAPI.as_view()),
]

app_name = 'user'
