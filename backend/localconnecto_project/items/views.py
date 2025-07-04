from rest_framework import viewsets, permissions, status
from .models import ItemCategory, Items, ItemImage
from .serializers import ItemCategorySerializer, ItemSerializers, ItemImageSerializer
from django.shortcuts import get_object_or_404
from rest_framework.decorators import action
from rest_framework.response import Response
from cloudinary import uploader
from .permissions import IsOwnerOrReadOnly
from .paginations import ItemPagination
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = ItemCategory.objects.all()
    serializer_class = ItemCategorySerializer
    def get_permissions(self):
        if self.action == 'list' or self.action == 'retrieve':
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]
        return [permission() for permission in permission_classes]  # create instances of each permission class


class ItemsViewSet(viewsets.ModelViewSet):
    serializer_class = ItemSerializers
    pagination_class = ItemPagination

    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['title', 'location']
    filterset_fields = {
        'price': ['exact', 'gte', 'lte'],
        'category': ['exact'],
        'listing_type': ['exact'],
    }

    def get_permissions(self):
        if self.action == 'list' or self.action == 'retrieve':
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        queryset = Items.objects.filter(status='available')
        return queryset
    
    def perform_create(self, serializer):
        serializer.save(user= self.request.user)
    
    @action(detail=False, methods=['get', 'put'], permission_classes=[permissions.IsAuthenticated, IsOwnerOrReadOnly])
    def users_items(self, request, pk=None):
        user_item = Items.objects.filter(user= request.user)
        serializer = self.get_serializer(user_item, many=True)

        return Response(serializer.data)
    

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated, IsOwnerOrReadOnly])
    def add_image(self, request, pk=None):
        item = self.get_object()

        images = request.FILES.getlist('images')

        if item.images.count() + len(images) > 3:
            return Response(
               {"detail": "Item already has the maximum of 3 images."},
                status=status.HTTP_400_BAD_REQUEST 
            )

        if not images:
            return Response(
                {"detail": "No image file provided."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        added_image = []
        for i, image_file in enumerate(images):
            item_images = ItemImage(
                item= item,
                order= item.images.count() + i
            )
            item_images.image = image_file
            item_images.save()

       
            if hasattr(item_images.image, 'public_id'):
                item_images.image_public_id = item_images.image.public_id
                item_images.save()
            
            added_image.append(item_images)
            
        serializer = ItemImageSerializer(added_image, many=True)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    

    @action(detail=True, methods=['delete'], url_path='remove-image/(?P<image_id>[^/.]+)',  permission_classes=[permissions.IsAuthenticated, IsOwnerOrReadOnly])
    def remove_image(self, request, pk=None, image_id=None):
        item = self.get_object()
        image = get_object_or_404(ItemImage, id=image_id, item=item)

        if item.images.count() <= 1:
            return Response(
                {"detail": "Item must have at least one image."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if image.image_public_id:
            uploader.destroy(image.image_public_id)
        
        image.delete()

        for i, img in enumerate(item.images.all().order_by('order')):
            img.order = i
            img.save()
        
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=True, methods=['put'], url_path='reorder-images', permission_classes=[permissions.IsAuthenticated, IsOwnerOrReadOnly])
    def reorder_images(self, request, pk=None):
        item = self.get_object()

        image_order = request.data.get('image_order', [])

        if not image_order or len(image_order) != item.images.count():
            return Response(
                {"detail": "Please provide the correct order for all images."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        for i, image_id in enumerate(image_order):
            image = get_object_or_404(ItemImage, id=image_id, item=item)
            image.order = i
            image.save()

        return Response(status=status.HTTP_200_OK)
    