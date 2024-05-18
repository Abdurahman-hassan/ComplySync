from celery import shared_task
from django.core.mail import EmailMessage
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.contrib.auth import get_user_model
from config.settings.base import SITE_NAME

User = get_user_model()


@shared_task
def send_resource_assignment_emails(campaign_id):
    from .models import Campaign
    campaign = Campaign.objects.get(id=campaign_id)
    # we use distinct() to avoid sending the same email to the same user multiple times
    users = User.objects.filter(groups__metadata__in=campaign.target_groups.all()).distinct()

    subject = "Campaign Resources Update"
    from_email = 'info@greencoder.io'
    site_name = SITE_NAME

    for user in users:
        context = {'campaign_name': campaign.name, 'site_name': site_name}
        html_content = render_to_string('email/campaign_start.html', context)
        text_content = strip_tags(html_content)  # Fallback for email clients that do not support HTML

        email = EmailMessage(
            subject,
            html_content,
            from_email,
            to=[user.email]
        )
        email.content_subtype = "html"
        email.send()
