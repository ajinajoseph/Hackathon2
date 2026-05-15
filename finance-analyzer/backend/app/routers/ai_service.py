import os
from django.conf import settings


def get_ai_client():
    """Return Google Gemini client."""
    if hasattr(settings, 'GEMINI_API_KEY') and settings.GEMINI_API_KEY:
        try:
            import google.generativeai as genai
            genai.configure(api_key=settings.GEMINI_API_KEY)
            return 'gemini', genai.GenerativeModel('gemini-flash-latest')
        except ImportError:
            pass
    return None, None


def generate_insights(expense_data: dict) -> list:
    """Generate AI-powered financial insights."""
    provider, client = get_ai_client()
    if not client:
        return _rule_based_insights(expense_data)

    prompt = f"""You are a personal finance advisor. Analyze this spending data and provide 4-5 concise, actionable insights.

Spending Summary:
- Total this month: ₹{expense_data.get('total_month', 0):.2f}
- Average daily: ₹{expense_data.get('avg_daily', 0):.2f}
- Month change: {expense_data.get('month_change', 0)}%

Category Breakdown:
{_format_categories(expense_data.get('categories', []))}

Return ONLY a JSON array with objects having these fields:
- type: "success" | "warning" | "info" | "ai"
- title: string (short, max 4 words)
- description: string (1-2 sentences, specific and actionable)
- badge: string (optional, 2-6 chars like "GOOD", "SAVE", "HIGH")

Return only the JSON array, no markdown, no explanation."""

    try:
        if provider == 'gemini':
            response = client.generate_content(prompt)
            content = response.text
        else:
            return _rule_based_insights(expense_data)

        import json
        # Strip markdown if present
        content = content.strip()
        if content.startswith('```'):
            content = '\n'.join(content.split('\n')[1:-1])
        return json.loads(content)

    except Exception as e:
        print(f"AI insight error: {e}")
        return _rule_based_insights(expense_data)


def chat_with_ai(message: str, context: dict) -> str:
    """Chat with AI about finances."""
    provider, client = get_ai_client()
    if not client:
        return "AI service is not configured. Please add GEMINI_API_KEY to your .env file."

    system = """You are FinanceOS AI, a helpful personal finance advisor. 
You have access to the user's spending data. All amounts are in Indian Rupees (₹).
Be concise, specific, and actionable. Keep responses under 200 words. Use numbers when available."""

    context_str = ""
    if context:
        context_str = f"\n\nUser's financial context:\n{_format_context(context)}"

    try:
        if provider == 'gemini':
            chat_session = client.start_chat(history=[])
            response = chat_session.send_message(f"{system}\n\n{message + context_str}")
            return response.text
        else:
            return "Gemini AI is not configured. Please add GEMINI_API_KEY to your .env file."

    except Exception as e:
        return f"I encountered an error: {str(e)}. Please try again."


def _format_categories(categories):
    if not categories:
        return "No category data available."
    lines = []
    for cat in categories[:8]:
        lines.append(f"  - {cat['category']}: ₹{cat['total']:.2f} ({cat['count']} transactions)")
    return '\n'.join(lines)


def _format_context(context):
    parts = []
    if 'total_month' in context:
        parts.append(f"Monthly total: ₹{context['total_month']:.2f}")
    if 'avg_daily' in context:
        parts.append(f"Daily average: ₹{context['avg_daily']:.2f}")
    if 'categories' in context:
        parts.append("Top categories: " + ', '.join(
            f"{c['category']} (₹{c['total']:.0f})"
            for c in context['categories'][:5]
        ))
    return '\n'.join(parts)


def _rule_based_insights(data):
    """Fallback rule-based insights when AI is unavailable."""
    insights = []
    total = data.get('total_month', 0)
    change = data.get('month_change', 0)
    categories = data.get('categories', [])

    if change < -5:
        insights.append({
            'type': 'success',
            'title': 'Spending Down',
            'description': f'Great job! Your spending is {abs(change):.0f}% lower than last month.',
            'badge': 'SAVE',
        })
    elif change > 10:
        insights.append({
            'type': 'warning',
            'title': 'Spending Increased',
            'description': f'Your spending is {change:.0f}% higher than last month. Review recent transactions.',
            'badge': 'HIGH',
        })

    if categories:
        top = categories[0]
        pct = (top['total'] / total * 100) if total > 0 else 0
        if pct > 40:
            insights.append({
                'type': 'warning',
                'title': f'{top["category"]} Dominant',
                'description': f'{top["category"]} accounts for {pct:.0f}% of your spending this month.',
                'badge': 'WATCH',
            })

    insights.append({
        'type': 'ai',
        'title': 'Configure AI',
        'description': 'Add GEMINI_API_KEY to .env for personalized AI insights.',
        'badge': 'TIP',
    })

    return insights
