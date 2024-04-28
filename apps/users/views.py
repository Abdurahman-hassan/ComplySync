from django.contrib.auth import get_user_model
from django.db import transaction
from djoser import signals
from djoser.conf import settings as djoser_settings
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import BulkUserCreateSerializer
from .tasks import send_activation_email

User = get_user_model()


# In your API view where users are created
class BulkUserCreateAPIView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = BulkUserCreateSerializer(data=request.data)
        if serializer.is_valid():
            email_list = serializer.validated_data['emails']
            users_created = []
            for email in email_list:
                with transaction.atomic():
                    user, created = User.objects.get_or_create(email=email)
                    if created:
                        user.set_unusable_password()
                        user.is_active = False  # Make sure to adjust based on your logic
                        user.save()
                        if djoser_settings.SEND_ACTIVATION_EMAIL:
                            domain = request.get_host()
                            protocol = 'https' if request.is_secure() else 'http'
                            send_activation_email.delay(user.id, domain, protocol)
                            signals.user_registered.send(sender=self.__class__, user=user, request=request)
                    users_created.append(user.email)
            return Response({
                "message": "Users created successfully",
                "users": users_created
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
