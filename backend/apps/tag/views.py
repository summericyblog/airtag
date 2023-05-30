import os
from django.shortcuts import render
from django.conf import settings
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
import yaml

from .utils import add_tagtree, gen_tagtree


@api_view(["GET"])
def tag_write_config(request):
    target = os.path.join(settings.PROJECT_DIR, "tagtree.yaml")
    tagdict = gen_tagtree()
    tagtree = yaml.dump(tagdict)
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
