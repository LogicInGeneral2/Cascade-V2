from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import CustomUser, Classes


class DetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [
            "id",
            "status",
            "username",
            "email",
            "password",
            "first_name",
            "last_name",
            "avatar",
        ]
        extra_kwargs = {"password": {"read_only": True}}


class ClassesSerializer(serializers.ModelSerializer):
    teacher = DetailsSerializer()
    students = DetailsSerializer(many=True)
    student_count = serializers.SerializerMethodField()

    class Meta:
        model = Classes
        fields = [
            "id",
            "subject",
            "avatar",
            "code",
            "start_date",
            "teacher",
            "students",
            "student_count",
        ]

    def get_student_count(self, obj):
        return obj.students.count()
