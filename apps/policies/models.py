"""Policy models module."""
import uuid

from django.db import models

STATUS_CHOICES = [('draft', 'Draft'), ('published', 'Published')]
LANGUAGE_CHOICES = [('en', 'English'),
                    ('es', 'Spanish'),
                    ('fr', 'French'),
                    ('de', 'German'),
                    ('it', 'Italian'),
                    ('pt', 'Portuguese'),
                    ('ru', 'Russian'),
                    ('zh', 'Chinese'),
                    ('ja', 'Japanese'),
                    ('ko', 'Korean'),
                    ('ar', 'Arabic'),
                    ('hi', 'Hindi'),
                    ('bn', 'Bengali'),
                    ('pa', 'Punjabi'),
                    ('te', 'Telugu'),
                    ('mr', 'Marathi'),
                    ('ta', 'Tamil'),
                    ('ur', 'Urdu'),
                    ('gu', 'Gujarati'),
                    ('kn', 'Kannada'),
                    ('or', 'Odia'),
                    ('ml', 'Malayalam'),
                    ('my', 'Burmese'),
                    ('th', 'Thai'),
                    ('vi', 'Vietnamese'),
                    ('id', 'Indonesian'),
                    ('tl', 'Filipino'),
                    ('ms', 'Malay'),
                    ('sw', 'Swahili'),
                    ('am', 'Amharic'),
                    ('yo', 'Yoruba'),
                    ('ha', 'Hausa'),
                    ('zu', 'Zulu'),
                    ('xh', 'Xhosa'),
                    ('st', 'Sesotho'),
                    ('sn', 'Shona'),
                    ('so', 'Somali'),
                    ('sw', 'Swahili'),
                    ('mg', 'Malagasy'),
                    ('km', 'Khmer'),
                    ('lo', 'Lao'),
                    ('ne', 'Nepali'),
                    ('si', 'Sinhala'),
                    ('my', 'Burmese'),
                    ('ka', 'Georgian'), ]

HELP_TEXT = "Minimum time required to read the policy in minutes"
UPLOAD_TO = 'policy_documents/'


def upload_to_language_document(instance, filename):
    ext = filename.split('.')[-1]  # Extract extension of the file
    # Create filename with UUID and preserve the file extension
    return f"{UPLOAD_TO}{uuid.uuid4()}.{ext}"


class Policy(models.Model):
    base_title = models.CharField(max_length=255)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='draft')
    min_read_time = models.PositiveIntegerField(help_text="Minimum time required to read the policy in minutes.")
    allow_download = models.BooleanField(default=False)
    description = models.TextField()

    def __str__(self):
        return self.base_title

    class Meta:
        ordering = ['-id']


class Language(models.Model):
    policy = models.ForeignKey(Policy, related_name='languages', on_delete=models.CASCADE)
    language = models.CharField(max_length=2, choices=LANGUAGE_CHOICES)
    localized_title = models.CharField(max_length=255)
    document_file = models.FileField(upload_to=upload_to_language_document)
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.localized_title} ({self.get_language_display()})"

    class Meta:
        ordering = ['-id']