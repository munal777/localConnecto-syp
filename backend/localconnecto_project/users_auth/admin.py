from django.contrib import admin
from .models import CustomUser, UserProfile

class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'email', 'is_staff', 'date_joined') 

admin.site.register(CustomUser, CustomUserAdmin)

admin.site.register(UserProfile)
