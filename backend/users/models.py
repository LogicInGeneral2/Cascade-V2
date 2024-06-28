from django.contrib.auth.models import AbstractUser
from django.db import models


# Create your models here.
class CustomUser(AbstractUser):
    STATUS = (
        ("Student", "Student"),
        ("Teacher", "Teacher"),
        ("Admin", "Admin"),
    )

    email = models.EmailField(unique=True)
    status = models.CharField(max_length=10, choices=STATUS, default="Student")
    avatar = models.CharField(max_length=255)

    def __str__(self):
        return self.username


class Classes(models.Model):
    subject = models.CharField(max_length=255)
    avatar = models.CharField(max_length=255)
    code = models.CharField(max_length=255)
    start_date = models.DateField(auto_now_add=True)
    teacher = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name="classes"
    )
    students = models.ManyToManyField(
        CustomUser, related_name="enrolled_classes", blank=True
    )

    def __str__(self):
        return self.subject
