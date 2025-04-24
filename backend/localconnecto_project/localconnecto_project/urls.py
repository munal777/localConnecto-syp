from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from users_auth.views import google_login_callback, validate_google_token, UserDataView, UserProfileViewSet
from dj_rest_auth.registration.views import RegisterView
from dj_rest_auth.views import LoginView
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'profiles', UserProfileViewSet, basename='profiles')



urlpatterns = [
    path('admin/', admin.site.urls),
    # path('auth/', include('dj_rest_auth.urls')),
    path('auth/registration/', RegisterView.as_view(), name="user_registration"),
    path('auth/login/', LoginView.as_view(), name='user_login'),
    path('auth/users/', UserDataView.as_view(), name='user_data'),
    path('auth/', include(router.urls)),
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('accounts/', include('allauth.urls')),
    path('callback/', google_login_callback, name='callback'),
    path('auth/google/validate_token/', validate_google_token, name='validate_token'),

    path('', include('items.urls'))
    # path('auth/social/', include('allauth.socialaccount.urls')),  # Social account URLs
    # path('auth/google/', include('allauth.socialaccount.providers.google.urls')), 
]
