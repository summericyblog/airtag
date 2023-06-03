from django.urls import path
from . import views

urlpatterns = [
    path(
        "read-config",
        views.read_config,
        name="tagpath-read-config",
    ),
    path(
        "write-config",
        views.write_config,
        name="tagpath-write-config",
    ),
    path("tag-clear", views.tag_clear, name="tagpath-tag-clear"),
    path("tag-add", views.tag_add, name="tagpath-tag-add"),
    path("tag-str-add", views.tag_str_add, name="tagpath-tag-str-add"),
    path(
        "tag-descendants",
        views.tag_descendants,
        name="tagpath-tag-descendants",
    ),
    path("tag-children", views.tag_children, name="tagpath-tag-children"),
    path("tag-merge", views.tag_merge, name="tagpath-tag-merge"),
]
