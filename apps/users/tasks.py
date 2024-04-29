from celery import shared_task
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import EmailMessage
from django.template.loader import render_to_string
from djoser.conf import settings as djoser_settings
from djoser.utils import encode_uid

from config.settings.base import SITE_NAME


@shared_task
def send_activation_email(user_id, domain, protocol):
    User = get_user_model()
    user = User.objects.get(pk=user_id)
    uid = encode_uid(user.pk)
    token = default_token_generator.make_token(user)
    site_name = SITE_NAME
    activation_url = djoser_settings.ACTIVATION_URL.format(uid=uid, token=token)
    full_url = f"{protocol}://{domain}/{activation_url}"
    context = {
        'user': user,
        'uid': uid,
        'token': token,
        'protocol': protocol,
        'domain': domain,
        'site_name': site_name,
        'activation_link': full_url
    }

    subject = "Activate Your Account"
    body = render_to_string('email/custom_activation_mail_template.html', context)
    email = EmailMessage(
        subject, body, to=[user.email], from_email='info@greencoder.io'
    )
    email.content_subtype = 'html'
    email.send()
