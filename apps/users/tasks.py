# from django.contrib.auth import get_user_model
# from celery import shared_task
# from django.core.mail import EmailMessage
# from django.template.loader import render_to_string
# from djoser.conf import settings as djoser_settings
# from djoser.utils import encode_uid
# from django.contrib.auth.tokens import default_token_generator
#
# @shared_task
# def send_activation_email(user_id, domain, protocol):
#     User = get_user_model()
#     user = User.objects.get(pk=user_id)
#     uid = encode_uid(user.pk)
#     token = default_token_generator.make_token(user)
#
#     context = {
#         'user': user,
#         'uid': uid,
#         'token': token,
#         'protocol': protocol,
#         'domain': domain,
#         'site_name': 'ComplySync',
#         'url': f"{domain}{djoser_settings.ACTIVATION_URL.format(uid=uid, token=token)}"
#     }
#
#     full_url = f"http://{context['url']}" if not context['url'].startswith('http') else context['url']
#     context['activation_link'] = full_url
#
#     # Render email text
#     subject = "Activate Your Account"
#     body = render_to_string('email/activation.html', context)
#
#     # Send email
#     email = EmailMessage(
#         subject, body, to=[user.email], from_email='info@greencoder.com'
#     )
#     email.content_subtype = 'html'  # Make the email body HTML
#     email.send()
#
# # Make sure to update how you call the task in your view:
# # send_activation_email.delay(user.id, request.get_host(), 'https' if request.is_secure() else 'http')


from django.contrib.auth import get_user_model
from celery import shared_task
from django.core.mail import EmailMessage
from django.template.loader import render_to_string
from djoser.conf import settings as djoser_settings
from djoser.utils import encode_uid
from django.contrib.auth.tokens import default_token_generator

@shared_task
def send_activation_email(user_id, domain, protocol):
    User = get_user_model()
    user = User.objects.get(pk=user_id)
    uid = encode_uid(user.pk)
    token = default_token_generator.make_token(user)

    # Ensure the URL is built correctly
    activation_url = djoser_settings.ACTIVATION_URL.format(uid=uid, token=token)
    if not activation_url.startswith('/'):
        activation_url = '/' + activation_url  # Ensure it starts with a forward slash

    # Combine protocol, domain and URL path correctly
    full_url = f"{protocol}://{domain}{activation_url}"

    context = {
        'user': user,
        'uid': uid,
        'token': token,
        'protocol': protocol,
        'domain': domain,
        'site_name': 'ComplySync',
        'activation_link': full_url
    }

    # Render email text
    subject = "Activate Your Account"
    body = render_to_string('email/activation.html', context)

    # Send email
    email = EmailMessage(
        subject, body, to=[user.email], from_email='info@greencoder.io'
    )
    email.content_subtype = 'html'  # Make the email body HTML
    email.send()

# Update how you call the task in your view to ensure protocol and domain are passed correctly:
# send_activation_email.delay(user.id, request.get_host(), 'https' if request.is_secure() else 'http')
