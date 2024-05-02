from rest_framework import permissions

from apps.groups.models import GroupMetadata
from apps.policies.models import Policy, Language


class IsAdminOrRestrictedOwnData(permissions.BasePermission):
    """
    Custom permission to allow admins full access and restrict authenticated users to view only their own data.
    """

    def has_permission(self, request, view):
        # Only allow authenticated users
        if not request.user.is_authenticated:
            return False

        # Admin users have full permissions
        if request.user.is_staff:
            return True

        # For safe methods, limit to specific object access checks (below)
        if request.method in permissions.SAFE_METHODS:
            return True

        # Non-admin users do not have create, update, or delete permissions
        return False

