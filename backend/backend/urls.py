from django.contrib import admin
from django.conf.urls import url, include
from django.views.static import serve

from backend import settings

urlpatterns = [
    url('^admin/', admin.site.urls),

    url('^api/', include('user.urls')),
    url('^api/', include('team.urls')),
    url('^api/', include('task.urls')),

    url(r'^media/(?P<path>.*)$', serve,
        {"document_root": settings.MEDIA_ROOT}),
]
