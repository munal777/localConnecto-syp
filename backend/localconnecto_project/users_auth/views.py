from django.shortcuts import redirect
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated, AllowAny
from allauth.socialaccount.models import SocialToken, SocialAccount
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from django.contrib.auth.decorators import login_required
from rest_framework import status
from rest_framework import generics
from .serializers import UserDataSerializer, UserProfileSerializer
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework import viewsets
from .models import UserProfile
from rest_framework.response import Response

User = get_user_model()

class UserDataView(generics.ListAPIView):
    serializer_class = UserDataSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return User.objects.filter(id=self.request.user.id)
    
class UserProfileViewSet(viewsets.ModelViewSet):
    serializer_class = UserProfileSerializer
    parser_classes = (MultiPartParser, FormParser, JSONParser)
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Ensure users can only access their own profile
        return UserProfile.objects.filter(user=self.request.user)

    def create(self, request):
        # Prevent manual profile creation
        return Response(
            {"detail": "Profile is automatically created with user registration"},
            status=status.HTTP_400_BAD_REQUEST
        )



@login_required
def google_login_callback(request):
    user = request.user

    print("Full request object:", vars(request))
    print("User authenticated:", user.is_authenticated)
    print("User:", user.username)
    print("Request GET parameters:", request.GET)

    code = request.GET.get('code')

    social_accounts = SocialAccount.objects.filter(user=user)
    print("social account for user:", social_accounts)

    social_account = social_accounts.first()

    if not social_account:
        print("No social account for user:", user)
        return redirect('http://localhost:5173/login/callback/?error=NoSocialAccount')
    
    # token = SocialToken.objects.filter(account=social_account, account__provider='google').first()

    # if token:
    #     print('Google token found:', token.token)
    #     refresh = RefreshToken.for_user(user)
    #     access_token = str(refresh.access_token)
    #     refresh_token = str(refresh)

    #     return redirect(f'http://localhost:5173/login/callback/?access_token={access_token}&refresh_token={refresh_token}')

    # else:
    #     print('No Google token found for user', user)
    #     return redirect(f'http://localhost:5173/login/callback/?error=NoGoogleToken')
    
     # Generate JWT tokens directly since we already authenticated the user
    refresh = RefreshToken.for_user(user)
    access_token = str(refresh.access_token)
    refresh_token = str(refresh)
    
    # Even if we don't have a SocialToken, we can still authorize the user 
    # since they've been authenticated by Django/allauth
    return redirect(f'http://localhost:5173/login/callback/?access_token={access_token}&refresh_token={refresh_token}')

@csrf_exempt
def validate_google_token(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            google_access_token = data.get('access_token')
            print(google_access_token)

            if not google_access_token:
                return JsonResponse({'details': 'Access Token is missing.'}, status=status.HTTP_400_BAD_REQUEST)
 
            try:
                # Find the token in your database
                social_token = SocialToken.objects.get(token=google_access_token)
                user = social_token.account.user
                
                # Generate JWT tokens for the user
                refresh = RefreshToken.for_user(user)
                access_token = str(refresh.access_token)
                refresh_token = str(refresh)
                
                return JsonResponse({
                    'valid': True,
                    'access': access_token,
                    'refresh': refresh_token
                })
            except SocialToken.DoesNotExist:
                return JsonResponse({'valid': False, 'detail': 'Invalid token.'}, status=status.HTTP_401_UNAUTHORIZED)
                
        except json.JSONDecodeError:
            return JsonResponse({'detail': 'Invalid JSON.'}, status=400)
    return JsonResponse({'detail': 'Method not allowed.'}, status=405)
