from django.urls import path
from .views import create_profile, get_profile,update_profile,update_skills
from .views import signup

urlpatterns = [
    path('create-profile/', create_profile),
    path("signup/", signup),
    path("profile/",get_profile),
    path("update-profile/", update_profile),
    path("update-skills/", update_skills),
]