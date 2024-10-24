from django.contrib import admin
from .models import Task, SubTask, submission, graded_submission
# Register your models here.

# admin.site.register(Task)
# admin.site.register(SubTask)
# admin.site.register(submission)
# admin.site.register(graded_submission)

class tryGit(admin.hi):
    text = "Hello Jal" # for demonstration only

class SubTaskInline(admin.TabularInline):
    model = Task.subtasks.through
    extra = 1


class TaskAdmin(admin.ModelAdmin):
    list_display = (
        "task_id",
        "name",
        "class_id",
        "description",
        "created_date",
        "start_date",
        "due_date",
    )
    list_filter = ("created_date", "start_date", "due_date", "class_id")
    search_fields = ("name", "description")
    inlines = [SubTaskInline]

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        queryset = queryset.prefetch_related("subtasks")
        return queryset


admin.site.register(Task, TaskAdmin)


class SubTaskAdmin(admin.ModelAdmin):
    list_display = ("title", "description", "file_name")
    search_fields = ("title", "description")


admin.site.register(SubTask, SubTaskAdmin)


class SubmissionInline(admin.TabularInline):
    model = submission
    extra = 1


class SubmissionAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "student",
        "task_id",
        "submission_date",
        "answer",
    )
    list_filter = ("submission_date", "task_id", "student")
    search_fields = ("file_name", "answer", "student__username", "task_id__name")


admin.site.register(submission, SubmissionAdmin)


class GradedSubmissionAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "student",
        "submission_name",
        "task_id",
        "submission_start_date",
        "submission_due_date",
        "submission_date",
        "graded_date",
        "remarks",
        "ratings",
    )
    list_filter = ("graded_date", "submission_date", "task_id")
    search_fields = (
        "submission_name",
        "remarks",
        "student__username",
        "task_id",
    )


admin.site.register(graded_submission, GradedSubmissionAdmin)
