from django.core.mail import send_mail
from django.conf import settings


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


