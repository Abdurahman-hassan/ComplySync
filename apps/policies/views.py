import logging

import boto3
from django.conf import settings
from django.http import JsonResponse
from django.views.generic.edit import FormView
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.permissions import IsAdminOrRestrictedOwnData
from .forms import LanguageForm
from .models import Policy, Language
from .serializers import PolicySerializer, LanguageSerializer

logger = logging.getLogger(__name__)


class PolicyViewSet(viewsets.ModelViewSet):
    queryset = Policy.objects.all()
    serializer_class = PolicySerializer
    permission_classes = [IsAdminOrRestrictedOwnData]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['base_title', 'description', 'languages__localized_title']

    def get_queryset(self):
        if self.request.user.is_staff:
            return Policy.objects.all()
        else:
            # Get IDs of groups the user belongs to
            user_group_ids = self.request.user.groups.values_list('id', flat=True)
            # Filter policies that are linked through campaigns to any of the groups the user belongs to
            return Policy.objects.filter(campaigns__target_groups__group__id__in=user_group_ids)


class LanguageViewSet(viewsets.ModelViewSet):
    queryset = Language.objects.all().order_by('-id')
    serializer_class = LanguageSerializer
    permission_classes = [IsAdminOrRestrictedOwnData]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Language.objects.all()
        # Filter languages that are linked through policies to campaigns that target groups the user belongs to
        return Language.objects.filter(policy__campaigns__target_groups__group__user=self.request.user)

    @action(detail=False, methods=['get'], url_path='view-pdf')
    def view_pdf(self, request):
        # Get all languages that the user is authorized to view
        languages = self.get_queryset()
        presigned_urls = []
        for language in languages:
            if language.document_file:
                url = self.generate_presigned_url(self, language.document_file.name)
                presigned_urls.append({
                    'language_id': language.id,
                    'localized_title': language.localized_title,
                    'presigned_url': url
                })

        return Response(presigned_urls)

    @action(detail=True, methods=['get'], url_path='view-pdf')
    def view_pdf_by_id(self, request, pk):
        language = self.get_object()
        if language.document_file:
            url = self.generate_presigned_url(self, language.document_file.name)
            return Response({
                'language_id': language.id,
                'localized_title': language.localized_title,
                'presigned_url': url
            })
        return Response({
            'language_id': language.id,
            'localized_title': language.localized_title,
            'presigned_url': None
        })

    @staticmethod
    def generate_presigned_url(self, file_key):
        """Generate a presigned URL to share an S3 object."""
        s3_client = boto3.client(
            's3',
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_S3_REGION_NAME
        )
        try:
            response = s3_client.generate_presigned_url(
                'get_object',
                Params={
                    'Bucket': settings.AWS_STORAGE_BUCKET_NAME,
                    'Key': file_key
                },
                ExpiresIn=3600
            )
            return response
        except Exception as e:
            logger.error(f"Failed to generate presigned URL for {file_key}: {e}")
            return None


class UploadLanguageDocumentView(FormView):
    template_name = 'upload_language.html'
    form_class = LanguageForm

    # success_url = reverse_lazy('upload_pdf')

    def form_valid(self, form):
        # This method is called when valid form data has been POSTed.
        # It should return an HttpResponse.
        language_instance = form.save()
        return JsonResponse({'success': True, 'url': language_instance.document_file.url}, status=201)

    def form_invalid(self, form):
        # This method is called when form data isn’t valid.
        # It returns an HttpResponse with the form errors.
        return JsonResponse({'errors': form.errors}, status=400)
