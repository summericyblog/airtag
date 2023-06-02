import os
from django.shortcuts import render
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
import yaml

from .models import Tag, TagPath
from .utils import (
    add_tagtree,
    gen_tagtree,
    add_one_tag,
    add_tag_str,
    get_descendants,
    get_children,
    merge_tags,
)


@api_view(["GET"])
def write_config(request):
    target = os.path.join(settings.PROJECT_DIR, "tagtree.yaml")
    tagdict = gen_tagtree()
    tagtree = yaml.dump(tagdict, allow_unicode=True)
    print(tagdict)
    with open(target, "w", encoding="utf-8") as f:
        f.write(tagtree)
    response = Response("Success.", status=status.HTTP_200_OK)
    return response


@api_view(["GET"])
def read_config(request):
    target = os.path.join(settings.PROJECT_DIR, "tagtree.yaml")
    with open(target, "r", encoding="utf-8") as f:
        tagtree = yaml.load(f, Loader=yaml.SafeLoader)
    add_tagtree(tagtree)
    response = Response("Success.", status=status.HTTP_200_OK)
    return response


@api_view(["GET"])
def tag_clear(request):
    TagPath.objects.all().delete()
    Tag.objects.all().delete()
    response = Response("Success.", status=status.HTTP_200_OK)
    return response


@api_view(["POST"])
def tag_add(request):
    name = request.data.get("name")
    description = request.data.get("description", None)
    father = request.data.get("father", None)
    (message, code) = add_one_tag(name, description, father)
    if code == 0:
        return Response("Success.", status=status.HTTP_201_CREATED)
    elif code == 1:
        return Response("Existed.", status=status.HTTP_201_CREATED)


@api_view(["POST"])
def tag_str_add(request):
    tag_str = request.data.get("tagstr")
    add_tag_str(tag_str)
    return Response("Success.", status=status.HTTP_201_CREATED)


@api_view(["POST"])
def tag_descendants(request):
    tag = Tag.objects.get(id=request.data.get("tag"))
    ancestors = get_descendants(tag)
    return Response(ancestors, status=status.HTTP_200_OK)


@api_view(["POST"])
def tag_children(request):
    tag = request.data.get("tag", None)
    if tag is not None:
        tag = Tag.objects.get(id=tag["pk"])
    else:
        tag = None
    children = get_children(tag)
    return Response(children, status=status.HTTP_200_OK)


@api_view(["POST"])
def tag_merge(request):
    tags = request.data.get("tags", [])
    new_t = request.data.get("new_t")
    ret = merge_tags(tags, new_t)
    return Response(ret, status=status.HTTP_200_OK)
