from django.contrib import admin
from .models import ItemCategory, ItemImage, Items


admin.site.register(ItemCategory)
admin.site.register(ItemImage)
admin.site.register(Items)