from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Sum, Count, Avg
from django.db.models.functions import TruncMonth, TruncDay
from django.utils import timezone
from datetime import timedelta, date
import calendar

from app.expenses.models import Expense


@api_view(['GET'])
def summary(request):
    """Overall financial summary."""
    now = timezone.now().date()
    month_start = now.replace(day=1)
    last_month_start = (month_start - timedelta(days=1)).replace(day=1)
    last_month_end = month_start - timedelta(days=1)
    week_start = now - timedelta(days=now.weekday())

    # Current month
    month_qs = Expense.objects.filter(user=request.user, date__gte=month_start, date__lte=now)
    total_month = month_qs.aggregate(total=Sum('amount'))['total'] or 0

    # Last month
    last_month_qs = Expense.objects.filter(user=request.user, date__gte=last_month_start, date__lte=last_month_end)
    total_last_month = last_month_qs.aggregate(total=Sum('amount'))['total'] or 0

    # Month change %
    if total_last_month > 0:
        month_change = round(((float(total_month) - float(total_last_month)) / float(total_last_month)) * 100, 1)
    else:
        month_change = 0

    # Days elapsed this month
    days_elapsed = (now - month_start).days + 1
    avg_daily = float(total_month) / days_elapsed if days_elapsed > 0 else 0

    # Last month avg daily
    days_last_month = (last_month_end - last_month_start).days + 1
    avg_daily_last = float(total_last_month) / days_last_month if days_last_month > 0 else 0
    daily_change = round(((avg_daily - avg_daily_last) / avg_daily_last) * 100, 1) if avg_daily_last > 0 else 0

    # This week
    total_week = Expense.objects.filter(user=request.user, date__gte=week_start, date__lte=now).aggregate(
        total=Sum('amount'))['total'] or 0

    # Count
    count = Expense.objects.filter(user=request.user).count()

    return Response({
        'total_month': float(total_month),
        'total_last_month': float(total_last_month),
        'month_change': month_change,
        'avg_daily': round(avg_daily, 2),
        'daily_change': daily_change,
        'total_week': float(total_week),
        'count': count,
    })


@api_view(['GET'])
def by_category(request):
    """Spending by category."""
    date_from = request.query_params.get('date_from')
    date_to = request.query_params.get('date_to')

    qs = Expense.objects.filter(user=request.user)
    if date_from:
        qs = qs.filter(date__gte=date_from)
    if date_to:
        qs = qs.filter(date__lte=date_to)

    data = (
        qs.values('category')
        .annotate(total=Sum('amount'), count=Count('id'))
        .order_by('-total')
    )

    return Response([
        {'category': d['category'], 'total': float(d['total']), 'count': d['count']}
        for d in data
    ])


@api_view(['GET'])
def monthly_trend(request):
    """Monthly spending trend."""
    months = int(request.query_params.get('months', 12))
    cutoff = timezone.now().date() - timedelta(days=months * 30)

    data = (
        Expense.objects.filter(user=request.user, date__gte=cutoff)
        .annotate(month=TruncMonth('date'))
        .values('month')
        .annotate(total=Sum('amount'), count=Count('id'))
        .order_by('month')
    )

    return Response([
        {
            'month': d['month'].strftime('%b %Y'),
            'total': float(d['total']),
            'count': d['count'],
        }
        for d in data
    ])


@api_view(['GET'])
def daily_spending(request):
    """Daily spending for the last 30 days."""
    days = int(request.query_params.get('days', 30))
    cutoff = timezone.now().date() - timedelta(days=days)

    data = (
        Expense.objects.filter(user=request.user, date__gte=cutoff)
        .annotate(day=TruncDay('date'))
        .values('day')
        .annotate(total=Sum('amount'), count=Count('id'))
        .order_by('day')
    )

    return Response([
        {
            'day': d['day'].strftime('%b %d'),
            'total': float(d['total']),
            'count': d['count'],
        }
        for d in data
    ])
