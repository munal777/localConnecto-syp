from rest_framework import serializers
from .models import ItemCategory, Items, ItemImage
from users_auth.models import UserProfile
from django.contrib.auth import get_user_model
from django.db import transaction
import os
from cloudinary.uploader import upload, destroy

User = get_user_model()

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['id', 'image', 'bio', 'location', 'phone_number', 'created_at']
        read_only_fields = ['id', 'created_at']
    


class UserSerializer(serializers.ModelSerializer):
    profile = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'profile']
        read_only_fields = ['id']

    def get_profile(self, user):
        try:
            # Access through the reverse relationship
            user_profile = UserProfile.objects.get(user=user)
            return ProfileSerializer(user_profile).data
        except UserProfile.DoesNotExist:
            return None
    

class ItemImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemImage
        fields = ['id', 'image', 'order', 'image_public_id']
        read_only_fields = ['id', 'image_public_id']


class ItemCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemCategory
        fields = ['id', 'name']
        read_only_fields = ['id']

class ItemSerializers(serializers.ModelSerializer):
    images = ItemImageSerializer(many=True, required=False, read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    user = UserSerializer(read_only=True)
    category_name = serializers.CharField(source= 'category.name', read_only=True)
    category = serializers.PrimaryKeyRelatedField(queryset=ItemCategory.objects.all())
    posted_date = serializers.DateTimeField(read_only=True, format='%d %b %Y')
    uploaded_images = serializers.ListField(
        child= serializers.ImageField(max_length=None, use_url=True),
        write_only=True,
        required=False
    )
    
    class Meta:
        model = Items
        fields = [
            'id', 'first_name', 'last_name', 'user', 'category_name', 'title', 'description', 'category',
            'posted_date', 'listing_type', 'price', 'location', 'status', 'images', 'uploaded_images', 'condition'
        ]

        read_only_fields = ['id', 'first_name', 'last_name', 'posted_date']

    
    def validate_uploaded_images(self, upload_images):
            
        valid_extensions = ['.jpg', '.jpeg', '.png', '.gif']

        

        if upload_images and len(upload_images) > 3:
            raise serializers.ValidationError("Maximum 3 images allowed.")
        
        for img in upload_images:
            if img.size > 2 * 1024 * 1024:
                raise serializers.ValidationError(f"Image {img.name} size cannot exceed 2MB")

            ext = os.path.splitext(img.name)[1].lower()
            if ext not in valid_extensions:
                raise serializers.ValidationError(
                    f"File {img.name} has an invalid extension. Only JPG, JPEG, PNG, and GIF are allowed."
                )

        return upload_images


    def validate(self, validate_data):

        price = validate_data.get('price')
        listing_type = validate_data.get('listing_type')

        if listing_type == 'buy' and (price is None or price <= 0):
            raise serializers.ValidationError({"price: Price must me included or list it as free."})
        
        if listing_type == 'free' and price is not None:
            validate_data['price'] = None
        
        return validate_data

    @transaction.atomic
    def create(self, validated_data):
        uploaded_images = validated_data.pop('uploaded_images', [])

        if not uploaded_images:
            raise serializers.ValidationError({"uploaded_images": "At least one image is required."})

        item = Items.objects.create(**validated_data)

        for i, image_data in enumerate(uploaded_images):
            item_image = ItemImage(
                item= item,
                order= 1
            )

            item_image.image = image_data
            item_image.save()

            if hasattr(item_image.image, 'public_id'):
                item_image.image_public_id = item_image.image.public_id
                item_image.save()
        
        return item
    
    @transaction.atomic
    def update(self, instance, validated_data):
        uploaded_images = validated_data.pop('uploaded_images', None)

        # Update item fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        

        if uploaded_images is not None:
            if not uploaded_images:
                raise serializers.ValidationError({"uploaded_images": "At least one image is required."})

            # Delete existing images
            for image in instance.images.all():
                if image.image_public_id:
                    destroy(image.image_public_id)

            instance.images.all().delete()
            
            # Add new images
            for i, image_data in enumerate(uploaded_images):
                item_image = ItemImage(
                    item=instance,
                    order=i
                )
                
                # Save to get the folder path correctly calculated
                item_image.image = image_data
                item_image.save()

                if hasattr(item_image.image, 'public_id'):
                    item_image.image_public_id = item_image.image.public_id
                    item_image.save()
                
        
        return instance