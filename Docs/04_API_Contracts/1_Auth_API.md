
# API Contracts: Авторизація (Auth)

**Статус:** Draft

---
**Базовий URL:** `/api/auth/`
**Тип авторизації:** JWT (JSON Web Tokens)

## 1. Реєстрація (Register)
**Endpoint:** `POST /register/`
**Опис:** Створення нового акаунту користувача.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "secure_password123",
  "password_confirm": "secure_password123",
  "role": "patient" // варіанти: "patient", "doctor"
}
````

**Response: 201 Created**

```JSON
{
  "message": "Акаунт успішно створено.",
  "user_id": 1024
}
```

**Response: 400 Bad Request**

```JSON
{
  "error": "Користувач з таким email вже існує.",
  "code": "email_taken"
}
```

---
## 2. Вхід (Login)

**Endpoint:** `POST /login/` 
**Опис:** Перевірка облікових даних та отримання пари токенів (Access + Refresh).

**Request Body:**
```JSON
{
  "email": "user@example.com",
  "password": "secure_password123"
}
```

**Response: 200 OK**
```JSON
{
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI...", // Живе 15-30 хвилин
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI...", // Живе 7-30 днів
  "user": {
    "id": 1024,
    "email": "user@example.com",
    "role": "patient"
  }
}
```

**Response: 401 Unauthorized**
```JSON
{
  "error": "Невірна електронна пошта або пароль.",
  "code": "invalid_credentials"
}
```

---
## 3. Оновлення токена (Refresh)

**Endpoint:** `POST /refresh/` **Опис:** Отримання нового Access-токена, коли старий протермінувався (щоб не викидати користувача з акаунту).

**Request Body:**
```JSON
{
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI..."
}
```

**Response: 200 OK**
```JSON
{
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI..." 
}
```

---
## 4. Вихід (Logout)

**Endpoint:** `POST /logout/` **Опис:** Анулювання Refresh-токена на сервері (додавання в чорний список). Access-токен клієнт (React) просто видаляє зі своєї локальної пам'яті.

**Headers:** `Authorization: Bearer <access_token>`

**Request Body:**
```JSON
{
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI..."
}
```

**Response: 205 Reset Content**
```JSON
{
  "message": "Успішний вихід із системи."
}
```
---
