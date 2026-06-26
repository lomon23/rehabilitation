from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = (
        ('patient', 'Patient'),
        ('doctor', 'Doctor'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='patient')
    
    # Замінюємо username на email для логіну
    email = models.EmailField(unique=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username'] # username залишаємо для сумісності з адмінкою, але логін по email

    def __str__(self):
        return self.email