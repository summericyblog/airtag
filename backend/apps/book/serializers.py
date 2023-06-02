import uuid
from django.utils.text import slugify
from rest_framework import serializers
from .models import Author, Book
from apps.tag.models import Tag
from apps.tag.utils import add_tag_str


class AuthorSerializer(serializers.ModelSerializer):
    books = serializers.SerializerMethodField()
    url = serializers.ReadOnlyField()

    class Meta:
        model = Author
        fields = [
            "name",
            "name_full",
            "name_cn",
            "nation",
            "gender",
            "born",
            "books",
            "url",
        ]

    def gen_url(self, name):
        url = slugify(name)
        while Author.objects.filter(url=url).exists():
            url = slugify(name + "-" + str(uuid.uuid4())[:8])
        return url

    def get_books(self, instance):
        return list(instance.books.values("name", "url"))

    def create(self, validated_data):
        name = validated_data.get("name")
        validated_data["url"] = self.gen_url(name)
        return super().create(validated_data)


class BookSerializer(serializers.ModelSerializer):
    tags = serializers.CharField(required=False)
    authors = serializers.CharField(required=False)
    url = serializers.ReadOnlyField()

    class Meta:
        model = Book
        fields = [
            "name",
            "name_cn",
            "url",
            "rating",
            "publisher",
            "publication_date",
            "summary",
            "isbn",
            "pages",
            "language",
            "cover_image",
            "path",
            "series",
            "series_number",
            "authors",
            "tags",
        ]

    def gen_url(self, name):
        url = slugify(name)
        while Author.objects.filter(url=url).exists():
            url = slugify(name + "-" + str(uuid.uuid4())[:8])
        return url

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation["tags"] = list(instance.tags.values("name", "id"))
        representation["authors"] = list(
            instance.authors.values("name", "url")
        )
        return representation

    def create(self, validated_data):
        authors_list = validated_data.pop("authors").split(";")
        tags_list = validated_data.pop("tags").split(";")
        authors = []
        for author_name in authors_list:
            if not Author.objects.filter(name=author_name).exists():
                author_data = {"name": author_name}  # 构造作者数据
                author_serializer = AuthorSerializer(data=author_data)
                author_serializer.is_valid(raise_exception=True)
                author = author_serializer.create(
                    author_serializer.validated_data
                )
            else:
                author = Author.objects.get(name=author_name)
            authors.append(author)
        validated_data["authors"] = authors
        tags = []
        for tag_name in tags_list:
            add_tag_str(tag_name)
            tag = Tag.objects.get(name=tag_name.split("/")[-1])
            tags.append(tag)
        validated_data["authors"] = authors
        validated_data["tags"] = tags
        name = validated_data.get("name")
        validated_data["url"] = self.gen_url(name)
        instance = super().create(validated_data)
        return instance
