from django.db import models
from users.models import Skill


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