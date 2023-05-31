import os
from django.shortcuts import render
from django.conf import settings
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
import yaml

from .models import Tag, TagPath
from .utils import add_tagtree, gen_tagtree, add_one_tag, add_tag_str


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
def tag_add(request):
    name = request.data.get("name")
    description = request.data.get("description")
    father = request.data.get("father", None)
    (message, code) = add_one_tag(name, description, father)
    if code == 0 or code == 2:
        return Response("Success.", status=status.HTTP_201_CREATED)
    elif code == 2:
        return Response("Existed.", status=status.HTTP_201_CREATED)
    else:
        return Response(
            "Father incorrect.", status=status.HTTP_400_BAD_REQUEST
        )


@api_view(["POST"])
def tag_str_add(request):
    tag_str = request.data.get("tagstr")
    add_tag_str(tag_str)
    return Response("Success.", status=status.HTTP_201_CREATED)
