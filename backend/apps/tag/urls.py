from django.urls import path
from . import views

urlpatterns = [
    path(
        "read-config",
        views.tag_read_config,
        name="tagpath-read-config",
    ),
    path(
        "write-config",
        views.tag_write_config,
        name="tagpath-write-config",
    ),
    path("clear", views.tag_clear, name="tagpath-clear"),
]
