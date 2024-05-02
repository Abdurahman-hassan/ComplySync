# Generated by Django 5.0.4 on 2024-04-30 04:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
        ('users', '0002_userprofile'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userprofile',
            name='groups',
            field=models.ManyToManyField(blank=True, related_name='members', to='auth.group'),
        ),
    ]