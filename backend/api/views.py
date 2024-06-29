# from django.contrib.auth.models import User
from django.contrib.auth import get_user_model
from rest_framework import generics
from .serializers import (
    GradedSubmissionSerializer,
    SubmissionSerializer,
    UserSerializer,
    TaskSerializer,
    SubTaskSerializer,
)
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import SubTask, Task, graded_submission, submission
from django.http import HttpResponse, Http404
from django.shortcuts import get_object_or_404
from django.views import View
import os
from django.db.models import Q
from rest_framework import viewsets


User = get_user_model()


class TaskListCreate(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.status == "Student":
            return Task.objects.filter(class_id__students=user)
        elif user.status == "Teacher":
            return Task.objects.filter(class_id__teacher=user)
        else:
            return Task.objects.all()

    def perform_create(self, serializer):
        subtasks_ids = self.request.data.getlist("subtasks")
        serializer.save(
            subtasks=subtasks_ids, file_upload=self.request.FILES.get("file_upload")
        )


class SubTaskListCreate(generics.ListCreateAPIView):
    serializer_class = SubTaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return SubTask.objects.all()


class TaskDelete(generics.DestroyAPIView):
    queryset = Task.objects.all()
    permission_classes = [IsAuthenticated]

    def perform_destroy(self, instance):
        instance.delete()


class CreateUserView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class FileDownloadView(View):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        task = Task.objects.get(pk=pk)
        if task.file_upload:
            file_path = task.file_upload.path
            file_name = os.path.basename(file_path)
            with open(file_path, "rb") as file:
                response = HttpResponse(
                    file.read(), content_type="application/octet-stream"
                )
                response["Content-Disposition"] = "attachment; filename=" + file_name
                return response
        else:
            raise Http404("File does not exist")


class SubmissionDownloadView(View):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        task = submission.objects.get(pk=pk)
        if task.file_upload:
            file_path = task.file_upload.path
            file_name = os.path.basename(file_path)
            with open(file_path, "rb") as file:
                response = HttpResponse(
                    file.read(), content_type="application/octet-stream"
                )
                response["Content-Disposition"] = "attachment; filename=" + file_name
                return response
        else:
            raise Http404("File does not exist")


class FilesViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer


class SubmissionListCreate(generics.ListCreateAPIView):
    serializer_class = SubmissionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        task_id = self.request.query_params.get("task_id")
        user = self.request.user
        if task_id:
            return submission.objects.filter(task_id=task_id)
        if user.status == "Teacher":
            return submission.objects.all()
        return submission.objects.filter(
            Q(task_id=task_id) | (Q(student=self.request.user))
        )

    def perform_create(self, serializer):
        if serializer.is_valid():
            user = self.request.user
            serializer.save(
                student=user, file_upload=self.request.FILES.get("file_upload")
            )
        else:
            print(serializer.errors)


class GradedSubmissionListCreate(generics.ListCreateAPIView):
    queryset = graded_submission.objects.all()
    serializer_class = GradedSubmissionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.status == "Student":
            return graded_submission.objects.filter(student=user)
        else:
            return graded_submission.objects.all()

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save()
        else:
            print(serializer.errors)


class SubmissionDelete(generics.DestroyAPIView):
    queryset = submission.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = SubmissionSerializer


class GradedSubmissionDelete(generics.DestroyAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        queryset = self.get_queryset()
        obj = get_object_or_404(queryset, pk=self.kwargs.get("pk"))
        self.check_object_permissions(self.request, obj)
        return obj
