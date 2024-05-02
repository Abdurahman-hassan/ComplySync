from io import BytesIO

import boto3
from django.http import JsonResponse
from django.shortcuts import render
from django.views import View
from pypdf import PdfReader, PdfWriter
from rest_framework import viewsets

from apps.permissions import IsAdminOrRestrictedOwnData
from .forms import LanguageForm
from .models import Policy, Language
from .serializers import PolicySerializer, LanguageSerializer


class PolicyViewSet(viewsets.ModelViewSet):
    queryset = Policy.objects.all()
    serializer_class = PolicySerializer
    permission_classes = [IsAdminOrRestrictedOwnData]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Policy.objects.all()
        else:
            # Get IDs of groups the user belongs to
            user_group_ids = self.request.user.groups.values_list('id', flat=True)
            # Filter policies that are linked through campaigns to any of the groups the user belongs to
            return Policy.objects.filter(campaigns__target_groups__group__id__in=user_group_ids)


class LanguageViewSet(viewsets.ModelViewSet):
    queryset = Language.objects.all()
    serializer_class = LanguageSerializer
    permission_classes = [IsAdminOrRestrictedOwnData]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Language.objects.all()
        return Language.objects.filter(policy__campaigns__target_groups__group__user=self.request.user)


