from rest_framework import generics
from .serializers import DetailsSerializer, ClassesSerializer
from rest_framework.permissions import IsAuthenticated
from .models import Classes


# Create your views here.
class userDetails(generics.RetrieveUpdateAPIView):
    serializer_class = DetailsSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class classesList(generics.ListAPIView):
    serializer_class = ClassesSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.status == "Student":
            return Classes.objects.filter(students=user)
        if user.status == "Teacher":
            return Classes.objects.filter(teacher=user)
