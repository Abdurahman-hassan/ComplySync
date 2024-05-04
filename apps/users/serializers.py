from djoser import serializers
from djoser.serializers import UserCreateSerializer as BaseUserCreateSerializer, UserSerializer as BaseUserSerializer
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from .models import User


class UserCreateSerializer(BaseUserCreateSerializer):
    class Meta(BaseUserCreateSerializer.Meta):
        model = User
        fields = ['id', 'email', 'name', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long.")
        return value


class UserSerializer(BaseUserSerializer):
    class Meta(BaseUserSerializer.Meta):
        model = User
        fields = ['id', 'email', 'name', 'groups']

    def validate(self, attrs):
        validated_attr = super().validate(attrs)
        email = validated_attr.get('email')
        user = User.objects.get(email=email)

        if not user.is_active:
            raise ValidationError(
                'Account not activated')

        return validated_attr


class BulkUserCreateSerializer(serializers.Serializer):
    emails = serializers.ListField(child=serializers.EmailField())

    def create(self, validated_data):
        user_list = []
        for email in validated_data['emails']:
            user, created = User.objects.get_or_create(email=email, defaults={"is_active": False})
            if created:
                user.set_unusable_password()
                user.save()
                user_list.append(user)
        return user_list
