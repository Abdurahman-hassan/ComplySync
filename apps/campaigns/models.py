# campaigns/models.py
from django.contrib.auth.models import Group
from django.db import models

from apps.policies.models import Policy


class Campaign(models.Model):
    name = models.CharField(max_length=255)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    policies = models.ManyToManyField(Policy, related_name='campaigns')
    target_groups = models.ManyToManyField(Group, related_name='targeted_campaigns')
    completed_users_groups = models.ManyToManyField(Group, related_name='completion_groups', blank=True)

    def __str__(self):
        return self.name
