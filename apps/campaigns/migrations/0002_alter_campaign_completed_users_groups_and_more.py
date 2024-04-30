# Generated by Django 5.0.4 on 2024-04-30 04:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
        ('campaigns', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='campaign',
            name='completed_users_groups',
            field=models.ManyToManyField(blank=True, related_name='completion_groups', to='auth.group'),
        ),
        migrations.AlterField(
            model_name='campaign',
            name='target_groups',
            field=models.ManyToManyField(related_name='targeted_campaigns', to='auth.group'),
        ),
    ]
