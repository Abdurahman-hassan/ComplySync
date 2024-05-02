from django.contrib.auth.models import Group
from rest_framework import serializers

from .models import GroupMetadata


class GroupSerializer(serializers.ModelSerializer):
    group_name = serializers.CharField(source='group.name', allow_blank=False, max_length=150)

    class Meta:
        model = GroupMetadata
        fields = ('id', 'created_on', 'group_name')
        read_only_fields = ('id', 'created_on')

    def create(self, validated_data):
        group_name = validated_data.pop('group')['name']
        group, created = Group.objects.get_or_create(name=group_name)
        group_metadata, _ = GroupMetadata.objects.get_or_create(group=group)
        return group_metadata

    def update(self, instance, validated_data):
        group_name = validated_data.pop('group')['name']
        instance.group.name = group_name
        instance.group.save()
        return instance
