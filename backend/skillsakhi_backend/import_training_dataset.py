import csv
import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "skillsakhi_backend.settings")
django.setup()

from users.models import Skill
from training.models import TrainingResource

dataset_path = "../dataset/training_resources.csv"

with open(dataset_path, newline='', encoding="utf-8") as csvfile:
    reader = csv.DictReader(csvfile)

    for row in reader:
        skill_name = row["skill"]

        skill, _ = Skill.objects.get_or_create(name=skill_name)

        TrainingResource.objects.get_or_create(
            skill=skill,
            course_name=row["course_name"],
            provider=row["provider"],
            link=row["link"],
            difficulty=row["difficulty"]
        )

print("Training dataset imported successfully.")