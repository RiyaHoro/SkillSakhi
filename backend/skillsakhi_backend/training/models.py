from django.db import models
from users.models import Skill

class TrainingResource(models.Model):

    skill = models.ForeignKey(Skill, on_delete=models.CASCADE)

    course_name = models.CharField(max_length=200)
    provider = models.CharField(max_length=200)

    link = models.URLField()

    difficulty = models.CharField(
        max_length=50,
        choices=[
            ("Beginner", "Beginner"),
            ("Intermediate", "Intermediate"),
            ("Advanced", "Advanced")
        ],
        default="Beginner"
    )

    def __str__(self):
        return f"{self.skill.name} - {self.course_name}"