from django.db import models
from users.models import Skill
from django.contrib.auth.models import User

class Career(models.Model):

    title = models.CharField(max_length=100)
    domain = models.CharField(max_length=100)
    min_education = models.CharField(max_length=100)
    avg_salary = models.IntegerField()
    work_type = models.CharField(max_length=50)  # remote/home/office

    def __str__(self):
        return self.title


class CareerSkill(models.Model):

    career = models.ForeignKey(Career, on_delete=models.CASCADE)
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.career.title} - {self.skill.name}"
    


class RecommendationHistory(models.Model):

    user = models.ForeignKey(User, on_delete=models.CASCADE)

    career = models.CharField(max_length=200)

    matched_skills = models.JSONField()
    missing_skills = models.JSONField()

    match_percentage = models.IntegerField()

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.career}"