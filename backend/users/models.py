from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings
import random
import string

class User(AbstractUser):
    ROLE_CHOICES = (
        ('patient', 'Пацієнт'),
        ('doctor', 'Лікар/Спеціаліст'),
    )
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    
    # Зв'язок для пацієнтів: хто їхній лікар. 
    doctor = models.ForeignKey(
        'self', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='patients'
    )

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'role']

    def __str__(self):
        return f"{self.email} ({self.role})"
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}".strip() or self.email
    
class Profile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='profile'
    )
    name = models.CharField(max_length=100, blank=True)
    last_name = models.CharField(max_length=100, blank=True)
    birthday = models.DateField(null=True, blank=True)
    user_photo = models.URLField(blank=True)
    phone_number = models.CharField(max_length=20, blank=True)
    # Поле doctor звідси видалено, щоб усунути помилку E304/E305

def generate_invite_code():
    chars = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    return f"KROK-{chars}"

class DoctorInvite(models.Model):
    doctor = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='invites'
    )
    code = models.CharField(max_length=12, default=generate_invite_code, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.doctor.email} - {self.code}"