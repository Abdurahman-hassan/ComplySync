from typing import ClassVar

from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _

from .managers import UserManager
from apps.groups.models import Group


class User(AbstractUser):
    first_name = None  # type: ignore[assignment]
    last_name = None  # type: ignore[assignment]
    username = None  # type: ignore[assignment]
    # Firstname and lastname do not cover name patterns around the globe
    name = models.CharField(_("Name of User"), null=True, blank=False, max_length=255)
    email = models.EmailField(_("email address"), null=True, blank=False, unique=True)
    avatar = models.ImageField(default="avatar.svg", upload_to="avatar/")
    job_title = models.CharField(max_length=255, blank=True)
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects: ClassVar[UserManager] = UserManager()


