from django.contrib.auth import get_user_model
from djoser.serializers import UserSerializer
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.permissions import IsAdminOrRestrictedOwnData
from .models import GroupMetadata
from .serializers import GroupSerializer

User = get_user_model()


class GroupViewSet(viewsets.ModelViewSet):
    queryset = GroupMetadata.objects.select_related('group').all()
    serializer_class = GroupSerializer
    permission_classes = [IsAdminOrRestrictedOwnData]

    def get_queryset(self):
        if self.request.user.is_staff:
            return GroupMetadata.objects.all()
        else:
            return GroupMetadata.objects.filter(group__in=self.request.user.groups.all())

    def destroy(self, request, *args, **kwargs):
        group_metadata = self.get_object()
        group_metadata.group.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=['post', 'put', 'delete'], url_path='assign_users_to_group')
    def assign_users_to_group(self, request, pk=None):
        group_metadata = self.get_object()
        user_ids = request.data.get('user_ids')

        if not user_ids:
            return Response({"detail": "user_ids are required."}, status=status.HTTP_400_BAD_REQUEST)

        if not isinstance(user_ids, list):
            return Response({"detail": "user_ids must be provided in a list."}, status=status.HTTP_400_BAD_REQUEST)

        users = User.objects.filter(pk__in=user_ids)
        found_ids = set(users.values_list('pk', flat=True))
        not_found_ids = set(user_ids) - found_ids

        if not_found_ids:
            return Response({"detail": f"Users not found: {list(not_found_ids)}"}, status=status.HTTP_404_NOT_FOUND)

        if request.method == 'POST':
            for user in users:
                user.groups.add(group_metadata.group)
            action_detail = "added to"
        elif request.method == 'DELETE':
            for user in users:
                user.groups.remove(group_metadata.group)
            action_detail = "removed from"
        elif request.method == 'PUT':
            group_metadata.group.user_set.set(users)
            action_detail = "assigned to"

        serialized_users = UserSerializer(users, many=True)
        return Response({
            "message": f"Users successfully {action_detail} the {group_metadata.group.name} group.",
            "users": serialized_users.data
        }, status=status.HTTP_200_OK)
