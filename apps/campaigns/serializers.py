from rest_framework import serializers

from apps.groups.serializers import GroupSerializer
from apps.policies.serializers import PolicySerializer
from .models import Campaign


class CampaignSerializer(serializers.ModelSerializer):
    policies = PolicySerializer(many=True, read_only=True)
    target_groups = GroupSerializer(many=True, read_only=True)
    completed_users_groups = GroupSerializer(many=True, read_only=True)

    class Meta:
        model = Campaign
        fields = ['id', 'name', 'start_date', 'end_date', 'policies', 'target_groups', 'completed_users_groups']
