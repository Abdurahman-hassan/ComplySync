import io

import pypdf
from django import forms
from django.core.exceptions import ValidationError

from .models import Language


class CustomFileField(forms.FileField):
    def __init__(self, *args, **kwargs):
        # Default max upload size is 2MB
        self.max_upload_size = kwargs.pop('max_upload_size', 2 * 1024 * 1024)
        super().__init__(*args, **kwargs)

    def clean(self, data, initial=None):
        file = super().clean(data, initial)
        if file and file.size > self.max_upload_size:
            raise ValidationError(
                f"Please keep filesize under {self.max_upload_size / 1024 / 1024:.2f} MB. Current filesize {file.size / 1024 / 1024:.2f} MB")

        if file and file.name.endswith('.pdf'):
            try:
                # Use BytesIO for in-memory file handling
                reader = pypdf.PdfReader(io.BytesIO(file.read()))
                page_count = len(reader.pages)
                file.seek(0)  # Reset file pointer to the start after reading
            except pypdf.errors.PdfReadError as e:
                raise ValidationError("Error reading PDF file. Please make sure the file is a valid PDF.")
            except Exception as e:
                # Handle other exceptions that could occur
                raise ValidationError(f"An unexpected error occurred while processing the PDF: {str(e)}")
        else:
            raise ValidationError("Unsupported file format. Please upload a PDF file.")

        return file


class LanguageForm(forms.ModelForm):
    document_file = CustomFileField(max_upload_size=2 * 1024 * 1024)

    class Meta:
        model = Language
        fields = ['language', 'localized_title', 'document_file', 'policy']

    def save(self, commit=True):
        instance = super().save(commit=False)
        # Save the number of pages to the instance if it's a PDF and was processed
        if hasattr(self.cleaned_data.get('document_file'), 'page_count'):
            instance.page_count = self.cleaned_data['document_file'].page_count
        if commit:
            instance.save()
            self.save_m2m()  # In case there are many-to-many fields on the form
        return instance
