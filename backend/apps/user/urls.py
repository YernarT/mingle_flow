from django.urls import path
from rest_framework import routers
from django.conf import settings

from user.views import UserViewSet, LoginAPIView, RegisterAPIView

if settings.DEBUG:
    router = routers.DefaultRouter()
else:
    router = routers.SimpleRouter()

router.register(r'user', UserViewSet)

urlpatterns = router.urls

urlpatterns += [
    # 登录接口
    path('auth/login/', LoginAPIView.as_view()),
    # 注册接口
    path('auth/register/', RegisterAPIView.as_view()),
]

app_name = 'user'
