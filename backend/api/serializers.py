# from django.contrib.auth.models import User
from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import SubTask, Task, submission, graded_submission

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class SubTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubTask
        fields = "__all__"


class TaskSerializer(serializers.ModelSerializer):
    subtasks = SubTaskSerializer(many=True, read_only=True)

    class Meta:
        model = Task
        fields = [
            "class_id",
            "task_id",
            "name",
            "avatar",
            "description",
            "created_date",
            "start_date",
            "due_date",
            "subtasks",
            "file_upload",
        ]

    def create(self, validated_data):
        subtasks_data = validated_data.pop("subtasks", [])
        task = Task.objects.create(**validated_data)
        task.subtasks.set(subtasks_data)
        return task


class SubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = submission
        fields = [
            "id",
            "student",
            "task_id",
            "submission_date",
            "file_upload",
            "file_name",
            "answer",
        ]
        extra_kwargs = {"file_upload": {"required": False}}


class GradedSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = graded_submission
        fields = [
            "id",
            "student",
            "submission_name",
            "submission_start_date",
            "submission_due_date",
            "submission_date",
            "graded_date",
            "remarks",
            "ratings",
            "task_id",
        ]
