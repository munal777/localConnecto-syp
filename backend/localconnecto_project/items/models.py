from django.db import models
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model
from cloudinary.models import CloudinaryField

User = get_user_model()

class ItemCategory(models.Model):
    name = models.CharField(max_length=55, unique= True)

    class Meta:
        verbose_name_plural = "Item Categories"

    def __str__(self):
        return self.name


class Items(models.Model):
    LISTING_TYPE_CHOCIES = [
        ('sell', 'Sell'),
        ('free', 'Free'),
    ]

    user = models.ForeignKey(User, on_delete= models.CASCADE, related_name='items')
    category = models.ForeignKey(ItemCategory, on_delete= models.CASCADE, related_name='items')
    title = models.CharField(max_length=55)
    description = models.TextField(blank=True, null=True)
    posted_date = models.DateTimeField(auto_now_add=True)
    listing_type = models.CharField(max_length=5, choices=LISTING_TYPE_CHOCIES, default='sell')
    price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    location = models.CharField(max_length=50)
    condition = models.CharField(max_length=50, blank=True, null=True)
    status = models.CharField(max_length=10, choices=[('available', 'Available'), ('booked', 'Booked')], default='available')

    class Meta:
        ordering = ['-posted_date']  # Newest items first by default
        indexes = [
            models.Index(fields=['title']),  # Faster title searches
            models.Index(fields=['listing_type', 'category']),  # Optimize category+type filters
            models.Index(fields=['location'])
        ]

    def clean(self):
        if self.listing_type == 'buy' and (self.price is None or self.price <= 0):
            raise ValidationError({'price': "Price must be provided and greater than zero for 'buy' listings."})
        if self.listing_type == 'free' and self.price is not None:
            raise ValidationError({'price': "Price must be empty for 'free' listings."})
    
    def save(self, *args, **kwargs):
        self.full_clean()  # Validate before saving
        super().save(*args, **kwargs)

    def __str__(self):
        return f'{self.title} - {self.user.first_name} {self.user.last_name}'
    



class ItemImage(models.Model):
    item = models.ForeignKey(Items, on_delete=models.CASCADE, related_name='images')
    image = CloudinaryField('image', folder = lambda instance: f'accounts/{instance.item.user.id}/item_images')
    image_public_id = models.CharField(max_length=255, blank=True, null=True)
    order = models.PositiveSmallIntegerField(default=0)
    
    class Meta:
        ordering = ['order']

    
    def __str__(self):
        return f"Image for {self.item.title} - {self.order}"