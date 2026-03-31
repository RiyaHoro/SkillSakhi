from django.contrib.auth.models import User
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes

from .models import UserProfile
from .serializers import UserProfileSerializer


@api_view(["POST"])
def signup(request):

    username = request.data["username"]
    password = request.data["password"]

    user = User.objects.create_user(
        username=username,
        password=password
    )

    return Response({"message": "User created"})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_profile(request):

    serializer = UserProfileSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data)

    return Response(serializer.errors)