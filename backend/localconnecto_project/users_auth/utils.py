from django.core.mail import send_mail
from django.conf import settings
import secrets

def welcome_mail(user_mail):
    subject = "Welcome to LocalConnecto"
    message = """
    Your account has been created successfully! 🎉

    Welcome to LocalConnecto, where you can explore, connect, and make the most of your local community.

    We’re excited to have you on board!

    Best,
    LocalConnecto Team
    """
    app_mail = settings.DEFAULT_FROM_EMAIL

    send_mail(subject, message, app_mail, [user_mail], fail_silently=True)


def generate_otp():
    otp = ''.join(str(secrets.randbelow(10)) for _ in range(6))

    return otp

def send_otp_to_email(user_mail, otp_code):
    subject = "OTP Code to Change Password"

    message = f"Use this code {otp_code} to change your password"

    app_mail = settings.DEFAULT_FROM_EMAIL

    send_mail(subject, message, app_mail, [user_mail], fail_silently=True)
