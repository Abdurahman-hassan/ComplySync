from config.settings.base import env, INSTALLED_APPS, BASE_DIR
import os

INSTALLED_APPS += ["collectfast", "storages"]

TYPE_STORAGE = env("TYPE_STORAGE", default="local")
STATICFILES_LOCATION = 'static'

if TYPE_STORAGE == "s3":
    # AWS S3 credentials and bucket settings
    AWS_STORAGE_BUCKET_NAME = env("AWS_STORAGE_BUCKET_NAME")
    AWS_ACCESS_KEY_ID = env("AWS_ACCESS_KEY_ID")
    AWS_SECRET_ACCESS_KEY = env("AWS_SECRET_ACCESS_KEY")
    AWS_S3_REGION_NAME = env("AWS_S3_REGION_NAME", default=None)
    AWS_S3_SIGNATURE_VERSION = "s3v4"

    # AWS S3 custom domain
    AWS_S3_CUSTOM_DOMAIN = env("AWS_S3_CUSTOM_DOMAIN", default=f"{AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com")

    # URL settings
    MEDIA_URL = f"https://{AWS_S3_CUSTOM_DOMAIN}/media/"
    STATIC_URL = f"https://{AWS_S3_CUSTOM_DOMAIN}/static/"

    # Static and media storage settings
    STATICFILES_STORAGE = "storages.backends.s3boto3.S3Boto3Storage"
    DEFAULT_FILE_STORAGE = "storages.backends.s3boto3.S3Boto3Storage"

    # AWS settings for object storage
    AWS_DEFAULT_ACL = "private"
    STATICFILES_AWS_DEFAULT_ACL = "public-read"
    FILE_OVERWRITE = False
    AWS_S3_FILE_OVERWRITE = False
    AWS_QUERYSTRING_AUTH = False
    _AWS_EXPIRY = 60 * 60 * 24 * 7  # 1 week in seconds

    # Additional settings for controlling caching and object parameters
    AWS_S3_OBJECT_PARAMETERS = {
        "CacheControl": f"max-age={_AWS_EXPIRY}, s-maxage={_AWS_EXPIRY}, must-revalidate",
    }

    # Maximum memory size for a single object
    AWS_S3_MAX_MEMORY_SIZE = env.int("AWS_S3_MAX_MEMORY_SIZE", default=100_000_000)  # 100MB

    # Collectfast settings for faster static files management with Django and S3
    COLLECTFAST_STRATEGY = "collectfast.strategies.boto3.Boto3Strategy"

elif TYPE_STORAGE == "gcp":
    GS_BUCKET_NAME = env("GCP_STORAGE_BUCKET_NAME")
    MEDIA_URL = f"https://storage.googleapis.com/{GS_BUCKET_NAME}/media/"
    STATIC_URL = f"https://storage.googleapis.com/{GS_BUCKET_NAME}/static/"
    COLLECTFAST_STRATEGY = "collectfast.strategies.gcloud.GoogleCloudStrategy"

    STATICFILES_STORAGE = "storages.backends.gcloud.GoogleCloudStorage"
    DEFAULT_FILE_STORAGE = "storages.backends.gcloud.GoogleCloudStorage"
    GS_DEFAULT_ACL = "publicRead"

elif TYPE_STORAGE == "local":
    MEDIA_URL = "/media/"
    STATIC_URL = "/static/"
    STATIC_ROOT = os.path.join(BASE_DIR, "static")
    MEDIA_ROOT = BASE_DIR / "static/media"
    COLLECTFAST_STRATEGY = "collectfast.strategies.filesystem.FileSystemStrategy"
    STATICFILES_STORAGE = 'django.contrib.staticfiles.storage.StaticFilesStorage'
    DEFAULT_FILE_STORAGE = 'django.core.files.storage.FileSystemStorage'

else:
    raise ValueError("Invalid storage type specified: Please check the TYPE_STORAGE value in your .env file.")
