from django.core.exceptions import ValidationError
from rest_framework import status
from rest_framework.response import Response

from apps.groups.models import GroupMetadata
from apps.policies.models import Policy

ErrorMessages = {
    "MISSING_REQUIRED_FIELD": 'Please provide {field}_ids. If you intend to remove all items, send an empty list.',
    'NOT_FOUND': 'One or more items in {field} could not be found.'
}


def validate_and_get_items(item_ids, model, field):
    """Validate and fetch items from the database."""
    if not item_ids:
        raise ValidationError(ErrorMessages['MISSING_REQUIRED_FIELD'].format(field=field))

    items = model.objects.filter(id__in=item_ids)
    if len(items) != len(item_ids):
        raise ValidationError(ErrorMessages['NOT_FOUND'].format(field=field))
    return items


def handle_resource_assignment(request, campaign):
    errors = {}
    resource_fields = {
        'policies': Policy,
        'target_groups': GroupMetadata,
        'completed_users_groups': GroupMetadata
    }

    for field_name, model in resource_fields.items():
        item_ids = request.data.get(f'{field_name}_ids')
        try:
            items = validate_and_get_items(item_ids, model, field_name)
            getattr(campaign, field_name).set(items)
        except ValidationError as e:
            errors[field_name] = str(e)

    if errors:
        return Response({'errors': errors}, status=status.HTTP_400_BAD_REQUEST)
    return Response({'status': 'Resources assigned successfully'}, status=status.HTTP_200_OK)
