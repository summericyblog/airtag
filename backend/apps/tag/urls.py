from django.urls import path
from . import views

urlpatterns = [
    path(
        "read-config",
        views.tag_read_config,
        name="apipath-read-config",
    ),
    path(
        "write-config",
        views.tag_write_config,
        name="apipath-write-config",
    ),
]
