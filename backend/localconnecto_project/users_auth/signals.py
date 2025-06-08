from django.dispatch import receiver
from django.db.models.signals import post_save
from django.contrib.auth import get_user_model 
from .tasks import send_welcome_message
from .models import UserProfile

User = get_user_model()


@receiver(post_save, sender= User)
def user_creation_mail(sender, instance, created, **kwargs):
    if created:
        send_welcome_message.delay(instance.email)


@receiver(post_save, sender = User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user = instance)       
