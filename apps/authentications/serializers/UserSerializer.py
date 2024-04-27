from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()


class EmailDetails(serializers.Serializer):
    email = serializers.EmailField(required=False, read_only=True)
    verified = serializers.BooleanField(required=False, read_only=True)


class UserSerializer(serializers.ModelSerializer):
    email_details = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "name",
            "email",
            "email_details",
            "avatar",
            "is_superuser",
            "date_joined",
            "last_login",
        ]

    def get_email_details(self, obj):
        # Here, only the email is returned as there's no verification status to include
        details = {
            "email": obj.email
        }
        return details


class UserSerializerPublic(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    avatar = serializers.ImageField()


class UserSerializerPrivate(UserSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "name", "email", "avatar"]


class UserStatusAuth(serializers.Serializer):
    status = serializers.BooleanField(required=False, read_only=True)
