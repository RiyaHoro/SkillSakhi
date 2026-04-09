from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import UserProfile, Skill

from .serializers import UserProfileSerializer

from .models import UserProfile


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


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_profile(request):

    try:
        profile = UserProfile.objects.get(user=request.user)
    except UserProfile.DoesNotExist:
        return Response({"error": "Profile not found"}, status=404)

    skills = profile.skills.values_list("name", flat=True)

    return Response({
        "name": profile.name,
        "education": profile.education,
        "skills": list(skills)
    })
@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_profile(request):

    user = request.user
    profile = UserProfile.objects.get(user=user)

    profile.name = request.data.get("name", profile.name)
    profile.education = request.data.get("education", profile.education)
    profile.location = request.data.get("location", profile.location)

    profile.save()

    return Response({"message": "Profile updated"})
@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_skills(request):

    user = request.user

    try:
        profile = UserProfile.objects.get(user=user)
    except UserProfile.DoesNotExist:
        return Response({"error": "Profile not found"}, status=404)

    skills = request.data.get("skills", [])

    if not isinstance(skills, list):
        return Response({"error": "Skills must be a list"}, status=400)

    profile.skills.clear()

    for skill_name in skills:
        skill_name = skill_name.strip().lower()

        if skill_name == "":
            continue

        skill, _ = Skill.objects.get_or_create(name=skill_name)
        profile.skills.add(skill)

    return Response({"message": "Skills updated successfully"})