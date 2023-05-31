import os
from django.shortcuts import render
from django.conf import settings
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
import yaml

from .models import Tag, TagPath
from .utils import add_tagtree, gen_tagtree


@api_view(["GET"])
def tag_write_config(request):
    target = os.path.join(settings.PROJECT_DIR, "tagtree.yaml")
    tagdict = gen_tagtree()
    tagtree = yaml.dump(tagdict)
    print(tagdict)
    with open(target, "w") as f:
        f.write(tagtree)
    response = Response("Success.", status=status.HTTP_200_OK)
    return response


@api_view(["GET"])
def tag_read_config(request):
    target = os.path.join(settings.PROJECT_DIR, "tagtree.yaml")
    with open(target, "r") as f:
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
def get_or_add_tag(request):
    name = request.data.get('name')
    description = request.data.get('description')
    father = request.data.get('father', None)
    tag = Tag.objects.filter(name=name)
    if tag.exists():
        if father == None:
            return (tag, "Existed.")
        father_tag = TagPath.objects.get(descendant=tag, pathlength=1)
        if father == father_tag.name:
            return (tag, "Existed.")
    else:
        