from django.shortcuts import render

# Create your views here.
from rest_framework import status, views
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterSerializer, CustomTokenObtainPairSerializer
from rest_framework.views import APIView
from .models import Profile
from .serializers import ProfileSerializer
# 1. Реєстрація (Register)
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
            
        # Обробка помилки, якщо email вже зайнятий
        if 'email' in serializer.errors:
            return Response({
                "error": "Користувач з таким email вже існує.",
                "code": "email_taken"
            }, status=status.HTTP_400_BAD_REQUEST)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# 2. Вхід (Login)
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

# 4. Вихід (Logout)
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
        except Exception as e:
            return Response({"error": "Недійсний токен"}, status=status.HTTP_400_BAD_REQUEST)


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    # GET: отримати дані
    def get(self, request):
        profile, created = Profile.objects.get_or_create(user=request.user)
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)

    # POST/PUT: оновити дані
    def post(self, request):
        profile, created = Profile.objects.get_or_create(user=request.user)
        serializer = ProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)