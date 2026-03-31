from django.urls import path
from .views import create_profile
from .views import signup

urlpatterns = [
    path('create-profile/', create_profile),
    path("signup/", signup),
]