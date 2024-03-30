
from rest_framework import routers
from django.conf import settings

from project.views import ProjectViewSet, ContributorViewSet

if settings.DEBUG:
    router = routers.DefaultRouter()
else:
    router = routers.SimpleRouter()

router.register(r'project', ProjectViewSet)
router.register(r'contributor', ContributorViewSet)

urlpatterns = router.urls

app_name = 'project'
