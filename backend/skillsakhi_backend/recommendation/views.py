from rest_framework.decorators import api_view
from rest_framework.response import Response
from users.models import UserProfile
from .models import Career, CareerSkill
from users.models import UserProfile
from .models import Career, CareerSkill

@api_view(['GET'])
def recommend_career(request, user_id):

    user = UserProfile.objects.get(id=user_id)

    user_skills = set(s.lower().strip() for s in user.skills.values_list('name', flat=True))
    career_scores = []

    careers = Career.objects.all()

    for career in careers:

        required_skills = set(
            s.lower().strip() for s in CareerSkill.objects.filter(career=career)
            .values_list('skill__name', flat=True)
        )
        print("USER SKILLS:", user_skills)
        print("CAREER:", career.title)
        print("REQUIRED:", required_skills)
        print("MATCH:", user_skills.intersection(required_skills))

        match_score = len(user_skills.intersection(required_skills))

        career_scores.append({
            "career": career.title,
            "score": match_score,
            "required_skills": list(required_skills)
        })

    # sort by best match
    career_scores = sorted(career_scores, key=lambda x: x['score'], reverse=True)
    
    return Response(career_scores[:3])



@api_view(['GET'])
def skill_gap_analysis(request, user_id):

    user = UserProfile.objects.get(id=user_id)

    # normalize user skills
    user_skills = set(
        s.lower().strip() for s in user.skills.values_list('name', flat=True)
    )

    careers = Career.objects.all()

    results = []

    for career in careers:

        required_skills = set(
            s.lower().strip()
            for s in CareerSkill.objects.filter(career=career)
            .values_list('skill__name', flat=True)
        )

        matched = user_skills.intersection(required_skills)
        missing = required_skills - user_skills

        if len(required_skills) > 0:
            match_percentage = int((len(matched) / len(required_skills)) * 100)
        else:
            match_percentage = 0

        results.append({
            "career": career.title,
            "matched_skills": list(matched),
            "missing_skills": list(missing),
            "match_percentage": match_percentage
        })

    results = sorted(results, key=lambda x: x["match_percentage"], reverse=True)

    return Response(results)