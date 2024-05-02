from .models import GroupMetadata
from rest_framework import viewsets

from apps.permissions import IsAdminOrRestrictedOwnData
from .serializers import GroupSerializer


class GroupViewSet(viewsets.ModelViewSet):
    queryset = GroupMetadata.objects.select_related('group').all()
    serializer_class = GroupSerializer
    permission_classes = [IsAdminOrRestrictedOwnData]

    def get_queryset(self):
        if self.request.user.is_staff:
            return GroupMetadata.objects.all()
        else:
            return GroupMetadata.objects.filter(group__in=self.request.user.groups.all())
