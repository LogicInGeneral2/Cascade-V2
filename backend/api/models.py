from django.db import models

# from django.contrib.auth.models import User
from django.contrib.auth import get_user_model

from users.models import Classes, CustomUser

User = get_user_model()


class SubTask(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    file_upload = models.FileField(upload_to="subtask_files/", null=True, blank=True)
    file_name = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "SubTask"
        verbose_name_plural = "SubTasks"


class Task(models.Model):
    task_id = models.AutoField(primary_key=True)
    class_id = models.ForeignKey(
        Classes, on_delete=models.CASCADE, related_name="tasks"
    )
    name = models.CharField(max_length=255)
    avatar = models.CharField(max_length=255, blank=True, null=True)
    description = models.CharField(max_length=255)
    created_date = models.DateField(auto_now_add=True)
    start_date = models.DateField()
    due_date = models.DateField()
    subtasks = models.ManyToManyField(SubTask, related_name="tasks", blank=True)
    file_upload = models.FileField(upload_to="tasks/", null=True, blank=True)
    file_name = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Task"
        verbose_name_plural = "Tasks"


class submission(models.Model):
    student = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    task_id = models.ForeignKey(Task, on_delete=models.CASCADE)
    submission_date = models.DateField(auto_now_add=True)
    file_upload = models.FileField(upload_to="submissions/", null=True, blank=True)
    file_name = models.CharField(max_length=255, blank=True, null=True)
    answer = models.CharField(max_length=1000, blank=True, null=True)

    def __str__(self):
        return f"Submission-{self.pk}"


class graded_submission(models.Model):
    student = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    submission_name = models.CharField(max_length=255)
    submission_start_date = models.DateField()
    submission_due_date = models.DateField()
    submission_date = models.DateField()
    task_id = models.CharField(max_length=255)
    graded_date = models.DateField(auto_now_add=True)
    remarks = models.CharField(max_length=255)
    ratings = models.IntegerField()

    def __str__(self):
        return f"GradedSubmission-{self.pk}"

    class Meta:
        verbose_name = "Graded Submission"
        verbose_name_plural = "Graded Submissions"
