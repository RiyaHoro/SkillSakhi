from django.urls import path
from .views import recommend_career, skill_gap_analysis, recommendation_history

urlpatterns = [
    path("career/<int:user_id>/", recommend_career),
    path("gap/", skill_gap_analysis),
    path("history/", recommendation_history),
]