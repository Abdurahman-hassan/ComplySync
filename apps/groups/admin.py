from django.contrib import admin
from django.contrib.auth.admin import GroupAdmin
from django.contrib.auth.models import Group

from .models import GroupMetadata


class GroupMetadataInline(admin.StackedInline):
    model = GroupMetadata
    can_delete = False
    verbose_name_plural = 'Metadata'
    extra = 0  # Prevents displaying extra empty forms


class CustomGroupAdmin(GroupAdmin):
    inlines = [GroupMetadataInline]
    list_display = ('name',
                    'get_creation_date',
                    'get_permission_count',
                    'get_member_count',)

    def get_creation_date(self, obj):
        # Fetch the creation date from GroupMetadata if exists
        metadata = GroupMetadata.objects.filter(group=obj).first()
        return metadata.created_on.strftime('%Y-%m-%d %H:%M:%S') if metadata else 'No date'

    get_creation_date.short_description = 'Created On'

    def get_permission_count(self, obj):
        return obj.permissions.count()

    get_permission_count.short_description = 'Permissions Count'

    def get_member_count(self, obj):
        return obj.user_set.count()

    get_member_count.short_description = 'Members Count'


# Re-register Group with the new admin interface
admin.site.unregister(Group)
admin.site.register(Group, CustomGroupAdmin)
