from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register("files", views.FilesViewSet, basename="files")

urlpatterns = [
    path("tasks/", views.TaskListCreate.as_view(), name="task-list"),
    path("tasks/delete/<int:pk>/", views.TaskDelete.as_view(), name="task-delete"),
    path("submissions/", views.SubmissionListCreate.as_view(), name="submission-list"),
    path(
        "submissions/delete/<int:pk>/",
        views.SubmissionDelete.as_view(),
        name="submission-delete",
    ),
    path(
        "graded-submissions/",
        views.GradedSubmissionListCreate.as_view(),
        name="graded-submission-list",
    ),
    path(
        "graded-submissions/delete/<int:pk>/",
        views.GradedSubmissionDelete.as_view(),
        name="graded-submission-delete",
    ),
    path("download/<int:pk>/", views.FileDownloadView.as_view(), name="file-download"),
    path("", include(router.urls)),
]
