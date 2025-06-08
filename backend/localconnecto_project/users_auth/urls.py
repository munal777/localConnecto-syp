from django.urls import path
from .views import SendOTPView, ValidateOTPView, ChangePasswordAPIView

urlpatterns = [
    path('send-otp/', SendOTPView.as_view(), name='send_otp'),
    path('verify-otp/', ValidateOTPView.as_view(), name="verify_otp"),
    path('reset-password/', ChangePasswordAPIView.as_view(), name="reset_password")
]