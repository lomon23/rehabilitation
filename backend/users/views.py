from rest_framework import status, views, permissions
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
import random
from .serializers import RegisterSerializer, CustomTokenObtainPairSerializer, ProfileSerializer
from .models import DoctorInvite, Profile


from .models import AssignedExercise, Exercise
from .serializers import AssignedExerciseSerializer

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
    

# 1. Генерація нової кімнати (POST замість GET)
class DoctorInviteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        if request.user.role != 'doctor':
            return Response({"error": "Тільки лікар може створювати коди"}, status=status.HTTP_403_FORBIDDEN)
        
        # Створюємо завжди новий унікальний код
        invite = DoctorInvite.objects.create(doctor=request.user)
        return Response({"code": invite.code}, status=status.HTTP_201_CREATED)

# 2. Підключення пацієнта (Тут гасимо код)
class PatientConnectView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        if request.user.role != 'patient':
            return Response({"error": "Ви не пацієнт"}, status=status.HTTP_403_FORBIDDEN)
            
        code = request.data.get('code')
        try:
            # Шукаємо тільки АКТИВНІ коди
            invite = DoctorInvite.objects.get(code=code, is_active=True)
            
            # Прив'язуємо лікаря до пацієнта
            user = request.user
            user.doctor = invite.doctor
            user.save()
            
            # ГАСИМО КІМНАТУ, щоб ніхто інший не зайшов
            invite.is_active = False
            invite.save()
            
            return Response({"message": "Успішно підключено до лікаря!"})
        except DoctorInvite.DoesNotExist:
            return Response({"error": "Невірний або вже використаний код"}, status=status.HTTP_400_BAD_REQUEST)

# 3. Дані для дашборда лікаря
class DoctorDashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.role != 'doctor':
            return Response({"error": "Доступ заборонено"}, status=status.HTTP_403_FORBIDDEN)

        active_invites = DoctorInvite.objects.filter(doctor=request.user, is_active=True).values('code')
        
        # Додаємо select_related, щоб підтягнути профілі одним запитом
        patients_qs = User.objects.filter(doctor=request.user).select_related('profile')
        
        patients_data = []
        for p in patients_qs:
            # Дістаємо ім'я з Профілю (якщо він є), інакше беремо з базового юзера
            first_n = p.profile.name if hasattr(p, 'profile') else p.first_name
            last_n = p.profile.last_name if hasattr(p, 'profile') else p.last_name
            
            full_name = f"{first_n} {last_n}".strip()
            
            patients_data.append({
                "id": p.id,
                "name": full_name if full_name else "Анонімний Пацієнт", # Якщо і в профілі пусто
                "diagnosis": "Діагноз не встановлено",
                "day": "1/30",
                "progress": 0
            })

        return Response({
            "invites": list(active_invites),
            "patients": patients_data
        })
class PatientStatusView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.role != 'patient':
            return Response({"error": "Доступ заборонено"}, status=status.HTTP_403_FORBIDDEN)

        # Перевіряємо, чи є у пацієнта прив'язаний лікар (тобто чи він у "кімнаті")
        if request.user.doctor:
            doctor = request.user.doctor
            doctor_name = f"{doctor.first_name} {doctor.last_name}".strip() if doctor.first_name else "Твій Лікар"
            
            return Response({
                "is_connected": True,
                "doctor_name": doctor_name
            })
            
        return Response({
            "is_connected": False
        })


class PatientExerciseListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, patient_id):
        # 1. Приводимо до int та шукаємо об'єкт пацієнта
        p_id = int(patient_id)
        patient = get_object_or_404(User, id=p_id)
        
        # 2. Перевірка доступу
        if request.user.role == 'doctor' and patient.doctor != request.user:
            return Response({"error": "Це не ваш пацієнт"}, status=status.HTTP_403_FORBIDDEN)
            
        elif request.user.role == 'patient' and request.user.id != p_id:
            # DEBUG: print(f"DEBUG: UserID={request.user.id}, RequestedID={p_id}")
            return Response({"error": "Доступ заборонено"}, status=status.HTTP_403_FORBIDDEN)
            
        # 3. Витягуємо вправи конкретного пацієнта
        assigned = AssignedExercise.objects.filter(patient=patient).order_by('assigned_at')
        serializer = AssignedExerciseSerializer(assigned, many=True)
        
        # 4. Витягуємо ім'я безпечно
        full_name = "Анонімний Пацієнт"
        # Перевірка через hasattr(patient, 'profile') працює, якщо Profile має related_name='profile'
        if hasattr(patient, 'profile'):
            first_n = patient.profile.name
            last_n = patient.profile.last_name
            full_name = f"{first_n} {last_n}".strip() or patient.email

        return Response({
            "patient_name": full_name,
            "program_name": "Програма тренувань",
            "exercises": serializer.data
        }, status=status.HTTP_200_OK)
    def post(self, request, patient_id):
        # Додавати вправи може ТІЛЬКИ лікар
        if request.user.role != 'doctor':
            return Response({"error": "Тільки лікар може призначати вправи"}, status=status.HTTP_403_FORBIDDEN)

        patient = get_object_or_404(User, id=patient_id)
        
        if patient.doctor != request.user:
            return Response({"error": "Це не ваш пацієнт"}, status=status.HTTP_403_FORBIDDEN)

        exercise_name = request.data.get('name')
        if not exercise_name:
            return Response({"error": "Вкажіть назву вправи"}, status=status.HTTP_400_BAD_REQUEST)

        # Шукаємо або створюємо заглушку в каталозі
        base_exercise, created = Exercise.objects.get_or_create(
            name=exercise_name,
            defaults={'mediapipe_id': f'temp_{random.randint(1000,9999)}'}
        )

        # Призначаємо пацієнту
        assigned = AssignedExercise.objects.create(
            patient=patient,
            exercise=base_exercise,
            sets=3,
            reps=15
        )

        serializer = AssignedExerciseSerializer(assigned)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
        