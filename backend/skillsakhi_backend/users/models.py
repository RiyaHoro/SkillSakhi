from django.db import models
from django.contrib.auth.models import User

class Skill(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Interest(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    EDUCATION_CHOICES = [
        ("10th", "10th"),
        ("12th", "12th"),
        ("Diploma", "Diploma"),
        ("Graduate", "Graduate"),
        ("Postgraduate", "Postgraduate"),
    ]

    WORK_TYPE = [
        ("remote", "Remote"),
        ("home", "Home Based"),
        ("office", "Office"),
    ]

    name = models.CharField(max_length=150)
    age = models.IntegerField()
    education = models.CharField(max_length=50, choices=EDUCATION_CHOICES)
    location = models.CharField(max_length=150)

    work_preference = models.CharField(max_length=50, choices=WORK_TYPE)

    skills = models.ManyToManyField(Skill, blank=True)
    interests = models.ManyToManyField(Interest, blank=True)

    career_gap_years = models.IntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name