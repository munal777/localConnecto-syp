from rest_framework import serializers
from django.contrib.auth import get_user_model
from dj_rest_auth.registration.serializers import RegisterSerializer
from .models import UserProfile
from cloudinary.uploader import upload, destroy
import os

User = get_user_model()

class UserCreationSerializer(RegisterSerializer):
    username = None
    password1 = None
    password2 = None

    password = serializers.CharField(write_only=True)
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)

    def validate(self, validate_data):
        first_name = validate_data['first_name']
        last_name = validate_data['last_name']
        email = validate_data['email']
        password = validate_data['password']

        if not first_name.isalpha() or not last_name.isalpha():
            raise serializers.ValidationError("Name must contain alphabets only.")

        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError("A user with this email already exists.")

        return validate_data
    
    def get_cleaned_data(self):
        return {
            'first_name': self.validated_data.get('first_name', ''),
            'last_name': self.validated_data.get('last_name', ''),
            'email': self.validated_data.get('email', ''),
            'password': self.validated_data.get('password', ''),
        }
    
    def save(self, request):
        clean_data = self.get_cleaned_data()
        
        user = super().save(request)
        user.set_password(clean_data.get('password'))
        user.save()
        return user

    
class UserDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email']


class UserProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email', read_only=True)
    first_name = serializers.CharField(source='user.first_name', required=False)
    last_name = serializers.CharField(source='user.last_name', required=False)
    created_at = serializers.DateTimeField(read_only=True, format='%d %b %Y')

    class Meta:
        model = UserProfile
        fields = [
            'id',
            'email',
            'first_name',
            'last_name',
            'image',
            'bio',
            'location',
            'phone_number',
            'created_at',
        ]
        read_only_fields = ['id', 'email', 'created_at']
    

    def validate_image(self, value):
        if value:
            if value.size > 2 * 1024 * 1024:  # 2MB in bytes
                raise serializers.ValidationError("Image size cannot exceed 2MB")
            
            ext = os.path.splitext(value.name)[1].lower()
            valid_extensions = ['.jpg', '.jpeg', '.png', '.gif']
            if ext not in valid_extensions:
                raise serializers.ValidationError("Only JPG, JPEG, PNG, and GIF file formats are allowed")
                
        return value    

    
    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})

        # Update user model fields
        user = instance.user
        user.first_name = user_data.get('first_name', user.first_name)
        user.last_name = user_data.get('last_name', user.last_name)
        user.save()

        # Update profile fields
        instance.bio = validated_data.get('bio', instance.bio)
        instance.location = validated_data.get('location', instance.location)
        instance.phone_number = validated_data.get('phone_number', instance.phone_number)

        image = self.context['request'].FILES.get('image')
        if image:

            if instance.image_public_id:
                try:
                    destroy(instance.image_public_id)
                except Exception as e:
                    print(f"Error deleting old image: {e}")

            upload_result = upload(
                image,
                folder = f'accounts/{instance.user.id}/profile_images'
            )
            instance.image = upload_result['secure_url']
            instance.image_public_id = upload_result['public_id']
        
        instance.save()

        return instance