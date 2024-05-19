from .base import *  # noqa: F403
from .base import INSTALLED_APPS, MIDDLEWARE
from config.utils.storages import *  # noqa: F403

ADMIN_URL = "admin"
# === DEBUG Tools ================================================
DEBUG = True
INTERNAL_IPS = [
    "127.0.0.1",
    "0.0.0.0",
    # "172.14.3.2",
]
INSTALLED_APPS += [
    "debug_toolbar",
    "django_extensions",

]
MIDDLEWARE += [
    "debug_toolbar.middleware.DebugToolbarMiddleware",
]
# EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'

CORS_ALLOWED_ORIGINS = [
    'http://api.greencoder.tech',
    'https://api.greencoder.tech',
    'http://complysync.greencoder.tech:3000'
    'https://complysync.greencoder.tech',
    'https://www.greencoder.tech',
    'https://greencoder.tech',
]

CORS_ORIGIN_ALLOW_ALL = False

CORS_ORIGIN_WHITELIST = [
    'http://api.greencoder.tech',
    'https://api.greencoder.tech',
    'http://complysync.greencoder.tech:3000'
    'https://complysync.greencoder.tech',
    'https://www.greencoder.tech',
    'https://greencoder.tech'
]