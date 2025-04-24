from django.urls import path, include
from rest_framework import routers
from .views import CategoryViewSet, ItemsViewSet


router = routers.DefaultRouter()

router.register(r'categories', CategoryViewSet, basename='categories')
router.register(r'items', ItemsViewSet, basename='items')



urlpatterns = [
    path('', include(router.urls))
]