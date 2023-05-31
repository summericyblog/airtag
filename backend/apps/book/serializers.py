from rest_framework import serializers, viewsets
from .models import Author, Book
from apps.tag.models import Tag


class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = [
            "id",
            "name",
            "name_full",
            "name_cn",
            "nation",
            "gender",
            "born",
        ]

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation["books"] = list(instance.books.values("name", "id"))
        return representation


class BookSerializer(serializers.ModelSerializer):
    this_tags = serializers.CharField(required=False)
    this_authors = serializers.CharField(required=False)

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
        ]

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation["tags"] = list(instance.tags.values("name", "id"))
        representation["books"] = list(instance.books.values("name", "id"))
        return representation

    def create(self, validated_data):
        authors_list = validated_data.pop("this_authors").split(";")
        tags_list = validated_data.pop("this_tags").split(";")
        authors = []
        for author_name in authors_list:
            author, _ = Author.objects.get_or_create(name=author_name)
            authors.append(author)
        validated_data["authors"] = authors
        tags = []
        for tag_name in tags_list:
            tag_filter = Tag.objects.filter(name=tag_name)

            tags.append(tag)
        validated_data["authors"] = authors
        validated_data["tags"] = tags
        instance = super().create(validated_data)
        return instance
