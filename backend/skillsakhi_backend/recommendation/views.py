from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from users.models import UserProfile
from .models import Career, CareerSkill, RecommendationHistory
from training.models import TrainingResource


@api_view(['GET'])
def recommend_career(request, user_id):

    try:
        user = UserProfile.objects.get(id=user_id)
    except UserProfile.DoesNotExist:
        return Response({"error": "Profile not found"}, status=404)
    user_skills = set(
        s.lower().strip() for s in user.skills.values_list('name', flat=True)
    )

    career_scores = []

    careers = Career.objects.all()

    for career in careers:

        required_skills = set(
            s.lower().strip()
            for s in CareerSkill.objects.filter(career=career)
            .values_list('skill__name', flat=True)
        )

        match_score = len(user_skills.intersection(required_skills))

        career_scores.append({
            "career": career.title,
            "score": match_score,
            "required_skills": list(required_skills)
        })

    career_scores = sorted(career_scores, key=lambda x: x['score'], reverse=True)

    return Response(career_scores[:3])


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def recommendation_history(request):

    history = RecommendationHistory.objects.filter(
        user=request.user
    ).order_by("-created_at")

    data = []

    for h in history:
        data.append({
            "career": h.career,
            "matched_skills": h.matched_skills,
            "missing_skills": h.missing_skills,
            "match_percentage": h.match_percentage,
            "date": h.created_at
        })

    return Response(data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def skill_gap_analysis(request):

    user = request.user

    # SAFETY CHECK (THIS IS WHERE YOUR try/except GOES)
    try:
        profile = UserProfile.objects.get(user=user)
    except UserProfile.DoesNotExist:
        return Response({"error": "Profile not created"}, status=400)

    user_skills = set(
        s.lower().strip() for s in profile.skills.values_list("name", flat=True)
    )

    careers = Career.objects.all()

    results = []

    for career in careers:

        required_skills = set(
            s.lower().strip()
            for s in CareerSkill.objects.filter(career=career)
            .values_list("skill__name", flat=True)
        )

        matched = user_skills.intersection(required_skills)
        missing = required_skills - user_skills

        match_percentage = 0
        if len(required_skills) > 0:
            match_percentage = int((len(matched) / len(required_skills)) * 100)

        training_suggestions = []

        for skill in missing:
            resources = TrainingResource.objects.filter(
                skill__name__iexact=skill
            )

            for r in resources:
                training_suggestions.append({
                    "skill": skill,
                    "course": r.course_name,
                    "provider": r.provider,
                    "link": r.link
                })

        # SAVE RECOMMENDATION HISTORY
        if match_percentage > 0:
            RecommendationHistory.objects.create(
                user=user,
                career=career.title,
                matched_skills=", ".join(matched),
                missing_skills=", ".join(missing),
                match_percentage=match_percentage
            )

        results.append({
            "career": career.title,
            "matched_skills": list(matched),
            "missing_skills": list(missing),
            "training_resources": training_suggestions,
            "match_percentage": match_percentage
        })

    results = sorted(results, key=lambda x: x["match_percentage"], reverse=True)

    return Response(results[:3])