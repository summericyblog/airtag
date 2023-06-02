from django.db import models


class Tag(models.Model):
    name = models.CharField(max_length=40)
    description = models.TextField(null=True, blank=True)

    def __str__(self) -> str:
        return self.name


class TagPath(models.Model):
    ancestor = models.ForeignKey(
        Tag,
        null=True,
        blank=True,
        related_name="ancestors",
        on_delete=models.CASCADE,
    )
    descendant = models.ForeignKey(
        Tag,
        null=True,
        blank=True,
        related_name="descendants",
        on_delete=models.CASCADE,
    )
    pathlength = models.IntegerField(null=True, blank=True)
