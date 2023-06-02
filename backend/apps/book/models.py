from django.db import models

from apps.tag.models import Tag

GENDER_CHOICES = (
    ("M", "Male"),
    ("F", "Female"),
    ("O", "Others"),
)


class Author(models.Model):
    name = models.CharField(max_length=40)
    name_full = models.CharField(max_length=100, blank=True)
    name_cn = models.CharField(max_length=40, blank=True)
    nation = models.CharField(max_length=40, null=True, blank=True)
    gender = models.CharField(
        max_length=1, choices=GENDER_CHOICES, null=True, blank=True
    )
    born = models.IntegerField(null=True, blank=True)
    url = models.URLField(unique=True)
    completed = models.BooleanField(default=False)


class Book(models.Model):
    name = models.CharField(max_length=100)
    name_cn = models.CharField(max_length=100, blank=True)
    authors = models.ManyToManyField(to=Author, related_name="books")
    tags = models.ManyToManyField(to=Tag, related_name="books")
    url = models.URLField(unique=True)
    rating = models.IntegerField(null=True, blank=True)
    publisher = models.CharField(max_length=200, null=True, blank=True)
    publication_date = models.DateField(null=True, blank=True)
    summary = models.TextField(null=True, blank=True)
    isbn = models.CharField(max_length=20, null=True, blank=True)
    pages = models.PositiveIntegerField(null=True, blank=True)
    language = models.CharField(max_length=50, null=True, blank=True)
    cover_image = models.CharField(max_length=200, null=True, blank=True)
    path = models.CharField(max_length=200, null=True, blank=True)
    series = models.CharField(max_length=100, null=True, blank=True)
    series_number = models.IntegerField(null=True, blank=True)
    completed = models.BooleanField(default=False)
