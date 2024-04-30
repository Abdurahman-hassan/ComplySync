from django.contrib import admin

from .models import Policy, Language


@admin.register(Policy)
class PolicyAdmin(admin.ModelAdmin):
    list_display = ('base_title', 'status', 'min_read_time', 'allow_download')
    list_filter = ('status', 'allow_download')


@admin.register(Language)
class LanguageAdmin(admin.ModelAdmin):
    list_display = ('policy', 'language', 'localized_title', 'last_updated')
    list_filter = ('language',)
