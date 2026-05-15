from django.urls import path, include
from rest_framework.routers import DefaultRouter
from app.routers.expenses import ExpenseViewSet
from app.routers import analytics, insights, auth

router = DefaultRouter()
router.register(r'expenses', ExpenseViewSet, basename='expense')

urlpatterns = [
    path('register/', auth.register, name='register'),
    path('profile/', auth.get_profile, name='profile'),
    path('', include(router.urls)),

    # Analytics
    path('analytics/summary/', analytics.summary, name='analytics-summary'),
    path('analytics/by-category/', analytics.by_category, name='analytics-by-category'),
    path('analytics/monthly-trend/', analytics.monthly_trend, name='analytics-monthly-trend'),
    path('analytics/daily/', analytics.daily_spending, name='analytics-daily'),

    # AI Insights
    path('insights/', insights.get_insights, name='insights'),
    path('insights/chat/', insights.chat, name='insights-chat'),
]
