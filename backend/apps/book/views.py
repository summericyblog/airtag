from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import ParseError
from .models import Author, Book
from .serializers import AuthorSerializer, BookSerializer
from apps.tag.utils import get_descendants


class AuthorViewSet(viewsets.ModelViewSet):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer

    def get_object(self):
        queryset = self.get_queryset()
        obj = get_object_or_404(queryset, url=self.kwargs["pk"])
        return obj


class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer

    def get_object(self):
        queryset = self.get_queryset()
        obj = get_object_or_404(queryset, url=self.kwargs["pk"])
        return obj

    @action(detail=False, methods=["post"])
    def filter_by_tags(self, request):
        tags = request.data.get("tags", None)
        if tags is None:
            books = Book.objects.all()
            serializer = self.get_serializer(books, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        tag_pks_list = []
        for t in tags:
            descendants = get_descendants(t)
            descendant_pks = [a["pk"] for a in descendants]
            descendant_pks.append(t)
            tag_pks_list.append(descendant_pks)
        q_objects = Q()

        for tag_pks in tag_pks_list:
            inner_q = Q()
            for tag_pk in tag_pks:
                inner_q |= Q(tags__pk=tag_pk)
            q_objects &= inner_q

        books = Book.objects.filter(q_objects)
        serializer = self.get_serializer(books, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
