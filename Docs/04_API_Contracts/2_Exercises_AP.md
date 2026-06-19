
# API Contracts: Вправи та Телеметрія

**Статус:** Draft

---
**Базовий URL:** `/api/exercises/`
**Авторизація:** Обов'язкова (Bearer Token)

## 1. Отримання розкладу вправ (Get Schedule)
**Endpoint:** `GET /schedule/`
**Опис:** Отримання списку призначених вправ для пацієнта (режим Solo). 

**Response: 200 OK**
```json
{
  "patient_id": 1024,
  "pending_exercises": [
    {
      "assignment_id": 501,
      "exercise_type": "squat",
      "name": "Присідання базова стійка",
      "target_reps": 15,
      "due_date": "2026-06-25T23:59:59Z"
    },
    {
      "assignment_id": 502,
      "exercise_type": "arm_extension",
      "name": "Розгинання ліктьового суглоба",
      "target_reps": 20,
      "due_date": "2026-06-26T23:59:59Z"
    }
  ]
}
````

---
## 2. Звіт про виконання (Complete Exercise)

**Endpoint:** `POST /complete/` 
**Опис:** Відправка метаданих після успішного виконання вправи. Самі файли вже лежать на Google Drive пацієнта. Клієнт передає лише їхні ідентифікатори (File IDs) та базову статистику.

**Request Body:**


```JSON
{
  "assignment_id": 501,
  "status": "completed",
  "completion_stats": {
    "actual_reps": 15,
    "average_accuracy_score": 92.5,
    "duration_seconds": 120
  },
  "drive_artifacts": {
    "video_file_id": "1B2M2Y8AsgTpgAmY7PhCfgE1...",
    "telemetry_file_id": "1C5x8Y8AsgTpgAmY7PhCfgE2..."
  }
}
```

**Response: 201 Created**

```JSON
{
  "message": "Звіт успішно збережено та відправлено лікарю.",
  "report_id": 8842
}
```

## 3. Отримання звіту лікарем (Get Report)

**Endpoint:** `GET /reports/{report_id}/` 
**Опис:** Лікар отримує метадані для рендеру сторінки результатів. Фронтенд лікаря використає `drive_artifacts` для прямого завантаження `.webm` та `.json` з Google Drive.

**Response: 200 OK**

```JSON
{
  "report_id": 8842,
  "patient": {
    "id": 1024,
    "name": "Іван Іваненко"
  },
  "exercise_type": "squat",
  "completed_at": "2026-06-19T15:30:00Z",
  "completion_stats": {
    "actual_reps": 15,
    "average_accuracy_score": 92.5
  },
  "drive_artifacts": {
    "video_file_id": "1B2M2Y8AsgTpgAmY7PhCfgE1...",
    "telemetry_file_id": "1C5x8Y8AsgTpgAmY7PhCfgE2..."
  }
}
```