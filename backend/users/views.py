from rest_framework import status, views, permissions
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model

from .serializers import RegisterSerializer, CustomTokenObtainPairSerializer, ProfileSerializer
from .models import DoctorInvite, Profile

User = get_user_model()

class RegisterView(views.APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                "message": "Акаунт успішно створено.",
                "user_id": user.id
            }, status=status.HTTP_201_CREATED)
            
        if 'email' in serializer.errors:
            return Response({
                "error": "Користувач з таким email вже існує.",
                "code": "email_taken"
            }, status=status.HTTP_400_BAD_REQUEST)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class LogoutView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            if not refresh_token:
                return Response({"error": "Відсутній refresh токен"}, status=status.HTTP_400_BAD_REQUEST)
                
            token = RefreshToken(refresh_token)
            token.blacklist()
            
            return Response({"message": "Успішний вихід із системи."}, status=status.HTTP_205_RESET_CONTENT)
        except Exception:
            return Response({"error": "Недійсний токен"}, status=status.HTTP_400_BAD_REQUEST)


class ProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, user_id=None):
        target_id = user_id or request.query_params.get('user_id')

        if target_id:
            profile = get_object_or_404(Profile, user_id=target_id)
        else:
            profile, _ = Profile.objects.get_or_create(user=request.user)
            
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)

    def post(self, request, user_id=None):
        profile, _ = Profile.objects.get_or_create(user=request.user)
        
        serializer = ProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class DoctorInviteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.role != 'doctor':
            return Response({"error": "Тільки лікар може створювати коди"}, status=status.HTTP_403_FORBIDDEN)
        
        invite, _ = DoctorInvite.objects.get_or_create(doctor=request.user, is_active=True)
        return Response({"code": invite.code})

class PatientConnectView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        if request.user.role != 'patient':
            return Response({"error": "Ви не пацієнт"}, status=status.HTTP_403_FORBIDDEN)
            
        code = request.data.get('code')
        try:
            invite = DoctorInvite.objects.get(code=code, is_active=True)
            
            # Оновлюємо поле doctor у САМОГО ЮЗЕРА, а не в профілі
            user = request.user
            user.doctor = invite.doctor
            user.save()
            
            return Response({"message": "Успішно підключено до лікаря!"})
        except DoctorInvite.DoesNotExist:
            return Response({"error": "Невірний або неактивний код"}, status=status.HTTP_400_BAD_REQUEST)
        


















        