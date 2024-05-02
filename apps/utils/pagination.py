from rest_framework.pagination import LimitOffsetPagination


class SmallResultsSetPagination(LimitOffsetPagination):
    max_limit = 10
    default_limit = 2
