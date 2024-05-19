from celery import Celery

# from celery.schedules import crontab
from django.conf import settings
import os

env = os.getenv('DJANGO_ENV', 'development')  # Default to 'development' if not set
if env == 'production':
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.production")
else:
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.development")

app = Celery("app_config")
app.conf.update(**settings.CELERY_CONFIG)
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks(lambda: settings.INSTALLED_APPS)

# app.conf.beat_schedule = {}
