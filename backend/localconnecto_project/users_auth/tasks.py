from celery import shared_task
from .utils import welcome_mail, send_otp_to_email


@shared_task
def send_welcome_message(user_email):
    welcome_mail(user_email)

@shared_task
def send_otp(user_email, otp_code):
    send_otp_to_email(user_email, otp_code)