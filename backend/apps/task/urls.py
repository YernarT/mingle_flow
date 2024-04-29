
from rest_framework import routers
from django.conf import settings

from task.views import TaskViewSet, TaskAttachementViewSet, TaskCommentViewSet

if settings.DEBUG:
    router = routers.DefaultRouter()
else:
    router = routers.SimpleRouter()

router.register(r'task', TaskViewSet)
router.register(r'task-attachement', TaskAttachementViewSet)
router.register(r'task-comment', TaskCommentViewSet)

urlpatterns = router.urls

app_name = 'task'
