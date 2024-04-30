from django.contrib.auth.models import Group
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver


class GroupMetadata(models.Model):
    group = models.OneToOneField(Group, on_delete=models.CASCADE, related_name='metadata')
    created_on = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Metadata for {self.group.name}"


@receiver(post_save, sender=Group)
def ensure_group_metadata_exists(sender, instance, **kwargs):
    GroupMetadata.objects.get_or_create(group=instance)
