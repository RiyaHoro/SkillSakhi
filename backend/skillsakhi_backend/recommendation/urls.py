from django.urls import path
from .views import recommend_career
from .views import skill_gap_analysis


urlpatterns = [
    path('<int:user_id>/', recommend_career),
    path('gap/<int:user_id>/', skill_gap_analysis),
]