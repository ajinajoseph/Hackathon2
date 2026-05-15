from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Sum, Count
from django.utils import timezone
from datetime import timedelta

from app.expenses.models import Expense
from .ai_service import generate_insights, chat_with_ai


def _get_expense_context(request):
    now = timezone.now().date()
    month_start = now.replace(day=1)
    last_month_start = (month_start - timedelta(days=1)).replace(day=1)
    last_month_end = month_start - timedelta(days=1)

    total_month = Expense.objects.filter(user=request.user, date__gte=month_start).aggregate(
        total=Sum('amount'))['total'] or 0
    total_last = Expense.objects.filter(
        user=request.user, date__gte=last_month_start, date__lte=last_month_end
    ).aggregate(total=Sum('amount'))['total'] or 0

    days_elapsed = max((now - month_start).days + 1, 1)
    avg_daily = float(total_month) / days_elapsed

    month_change = 0
    if total_last > 0:
        month_change = round(((float(total_month) - float(total_last)) / float(total_last)) * 100, 1)

    categories = list(
        Expense.objects.filter(user=request.user, date__gte=month_start)
        .values('category')
        .annotate(total=Sum('amount'), count=Count('id'))
        .order_by('-total')
        .values('category', 'total', 'count')
    )
    categories = [
        {'category': c['category'], 'total': float(c['total']), 'count': c['count']}
        for c in categories
    ]

    return {
        'total_month': float(total_month),
        'total_last_month': float(total_last),
        'month_change': month_change,
        'avg_daily': round(avg_daily, 2),
        'categories': categories,
    }


@api_view(['GET'])
def get_insights(request):
    """Get AI-generated financial insights."""
    context = _get_expense_context(request)
    insights = generate_insights(context)
    return Response(insights)


@api_view(['POST'])
def chat(request):
    """Chat with AI about finances."""
    message = request.data.get('message', '').strip()
    if not message:
        return Response({'error': 'Message is required.'}, status=400)

    context = _get_expense_context(request)
    context.update(request.data.get('context', {}))

    response_text = chat_with_ai(message, context)
    return Response({'response': response_text})
