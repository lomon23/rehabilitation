from django.db import models
from django.conf import settings

class Exercise(models.Model):
    title = models.CharField(max_length=255) # "Присідання базова стійка"
    type_code = models.CharField(max_length=50, unique=True) # "squat", "arm_extension"
    description = models.TextField(blank=True)
    
    def __str__(self):
        return self.title


class Assignment(models.Model):
    patient = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='assignments'
    )
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE)
    target_reps = models.IntegerField(default=15)
    due_date = models.DateTimeField()
    is_completed = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.patient.email} - {self.exercise.type_code} (ID: {self.id})"


class SessionResult(models.Model):
    # Зв'язуємо результат з конкретним призначенням
    assignment = models.OneToOneField(
        Assignment, 
        on_delete=models.CASCADE, 
        related_name='result'
    )
    completed_at = models.DateTimeField(auto_now_add=True)
    
    # completion_stats з твого API
    actual_reps = models.IntegerField()
    average_accuracy_score = models.FloatField()
    duration_seconds = models.IntegerField()
    
    # drive_artifacts з твого API
    video_file_id = models.CharField(max_length=255)
    telemetry_file_id = models.CharField(max_length=255)

    def __str__(self):
        return f"Report {self.id} for Assignment {self.assignment_id}"
    