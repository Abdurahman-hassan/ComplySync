from django.core.wsgi import get_wsgi_application
import os

env = os.getenv('DJANGO_ENV', 'development')  # Default to 'development' if not set
if env == 'production':
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.production")
else:
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.development")

application = get_wsgi_application()
