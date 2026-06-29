from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('email', 'password', 'password_confirm', 'role')
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"code": "passwords_mismatch", "error": "Паролі не співпадають."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(
            username=validated_data['email'], # Використовуємо email як username для сумісності з Django
            email=validated_data['email'],
            password=validated_data['password'],
            role=validated_data['role']
        )
        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        # Отримуємо стандартні access та refresh токени
        data = super().validate(attrs)
        
        # Додаємо об'єкт user, як того вимагає твій контракт
        data['user'] = {
            'id': self.user.id,
            'email': self.user.email,
            'role': self.user.role
        }
        return data