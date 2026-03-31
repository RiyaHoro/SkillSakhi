import csv
import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "skillsakhi_backend.settings")
django.setup()

from users.models import Skill
from recommendation.models import Career, CareerSkill

dataset_path = "../dataset/career_skills.csv"

with open(dataset_path, newline='', encoding="utf-8") as csvfile:
    reader = csv.DictReader(csvfile)

    for row in reader:
        career_name = row["career"]
        skill_name = row["skill"]

        career, _ = Career.objects.get_or_create(
            title=career_name,
            defaults={
                "domain": "Technology",
                "min_education": "Graduate",
                "avg_salary": 50000,
                "work_type": "remote"
            }
        )

        skill, _ = Skill.objects.get_or_create(name=skill_name)

        CareerSkill.objects.get_or_create(career=career, skill=skill)

print("Dataset imported successfully.")