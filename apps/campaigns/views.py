from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.utils.helper_functions import handle_resource_assignment
from .models import Campaign
from .serializers import CampaignSerializer
from ..permissions import IsAdminOrRestrictedOwnData


class CampaignViewSet(viewsets.ModelViewSet):
    queryset = Campaign.objects.all()
    serializer_class = CampaignSerializer
    permission_classes = [IsAdminOrRestrictedOwnData]
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']

    def get_queryset(self):
        if self.request.user.is_superuser:
            return Campaign.objects.all()
        # Only campaigns related to user's groups are returned
        return Campaign.objects.filter(target_groups__group__user=self.request.user)

    @action(detail=True, methods=['post'], url_path='assign-resources')
    def assign_resources(self, request, pk=None):
        campaign = self.get_object()
        response = handle_resource_assignment(request, campaign)
        return response
