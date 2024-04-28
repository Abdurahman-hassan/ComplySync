from django.urls import path, include
from drf_spectacular.views import SpectacularRedocView, SpectacularSwaggerView
from drf_spectacular.views import SpectacularAPIView as SpectacularView
from drf_spectacular.utils import extend_schema
from rest_framework.authtoken.views import obtain_auth_token
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenBlacklistView

from apps.users.views import BulkUserCreateAPIView

# from apps.users.views import CustomUserViewSet
#
# router = DefaultRouter()
# router.register(r'users', CustomUserViewSet)


urlpatterns = [
    path('bulk-create/', BulkUserCreateAPIView.as_view(), name='bulk_create'),
    # path('', include(router.urls)),
    # path("", include("apps.authentications.urls")),
    path('auth/', include('djoser.urls')),
    # /token/login/,  /token/logout/
    path('auth/', include('djoser.urls.authtoken')),
    # path('api-token-auth', obtain_auth_token, name='api_token_auth'),

    # # """##################### rest_framework_simplejwt urls #####################"""
    # path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    # path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # path('api/token/blacklist/', TokenBlacklistView.as_view(), name='token_blacklist'),

    # path('auth/jwt/create/',CustomTokenObtainPairView.as_view(),name='custom_jwt_create'),
    # path('auth/', include('djoser.urls')),
    # path('auth/', include('djoser.urls.jwt')),

]


# include docs drf spectacular
class SpectacularAPIView(SpectacularView):
    @extend_schema(exclude=True)
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


urlpatterns += [
    path("schema/", SpectacularAPIView.as_view(), name="schema"),
    path(
        "docs/ui/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"
    ),
    path("docs/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"),
]
