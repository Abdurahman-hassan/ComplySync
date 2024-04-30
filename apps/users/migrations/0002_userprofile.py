# Generated by Django 5.0.4 on 2024-04-30 03:51

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('groups', '0001_initial'),
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='UserProfile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('job_title', models.CharField(blank=True, max_length=255)),
                ('joined_on', models.DateTimeField(auto_now_add=True)),
                ('last_active', models.DateTimeField(auto_now=True)),
                ('groups', models.ManyToManyField(blank=True, related_name='members', to='groups.group')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='profile', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
