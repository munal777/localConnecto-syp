from django.db import models
from django.contrib.auth.models import AbstractUser
from .manager import CustomUserManager
from cloudinary.models import CloudinaryField

class CustomUser(AbstractUser):
    username = None
    first_name = models.CharField(max_length=25)
    last_name = models.CharField(max_length=25)
    email = models.EmailField(unique=True)
    
    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.first_name + " " + self.last_name


class UserProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete= models.CASCADE)
    image = CloudinaryField('image', folder = lambda instance: f'accounts/{instance.user.id}/profile_images' , blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    location = models.CharField(max_length=50, blank=True, null= True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    image_public_id = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.first_name}'s Profile"


