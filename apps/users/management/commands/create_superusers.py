from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()


class Command(BaseCommand):
    help = 'Creates a superuser from command line arguments'

    def add_arguments(self, parser):
        parser.add_argument('email', type=str, help='Superuser email')
        parser.add_argument('password', type=str, help='Superuser password')

    def handle(self, *args, **options):
        email = options['email']
        password = options['password']

        if not User.objects.filter(email=email).exists():
            User.objects.create_superuser(email=email, password=password)
            self.stdout.write(self.style.SUCCESS(f'Successfully created superuser: {email}'))
        else:
            self.stdout.write(self.style.WARNING(f'Superuser {email} already exists.'))
