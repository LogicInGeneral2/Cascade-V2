from django.urls import path
from . import views

urlpatterns = [
    path("details/", views.userDetails.as_view(), name="user-details"),
    path("classes/", views.classesList.as_view(), name="classes-list"),
]
