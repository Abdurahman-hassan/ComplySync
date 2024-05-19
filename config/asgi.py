import os

from django.core.asgi import get_asgi_application

env = os.getenv('DJANGO_ENV', 'development')  # Default to 'development' if not set
if env == 'production':
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.production")
else:
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.development")
application = get_asgi_application()
