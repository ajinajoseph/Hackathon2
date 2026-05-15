from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from app.expenses.models import Expense
from django.utils import timezone
from datetime import timedelta
import random

class Command(BaseCommand):
    help = 'Seeds the database with dummy data for John'

    def handle(self, *args, **options):
        # 1. Create User John
        username = 'John'
        password = 'johnpassword123'
        email = 'john@example.com'

        user, created = User.objects.get_or_create(username=username)
        if created:
            user.set_password(password)
            user.save()
            self.stdout.write(self.style.SUCCESS(f'Successfully created user: {username}'))
        else:
            self.stdout.write(self.style.WARNING(f'User {username} already exists'))

        # 2. Clear existing expenses for John to avoid duplicates during demo setup
        Expense.objects.filter(user=user).delete()

        # 3. Dummy Expenses
        categories = [
            'Food & Dining', 'Transportation', 'Housing', 'Entertainment',
            'Healthcare', 'Shopping', 'Utilities', 'Education', 'Travel', 'Other'
        ]

        dummy_data = [
            {'title': 'Grocery Shopping', 'amount': 2500.50, 'category': 'Food & Dining', 'days_ago': 2},
            {'title': 'Dinner at Italian Restaurant', 'amount': 1800.00, 'category': 'Food & Dining', 'days_ago': 1},
            {'title': 'Uber Ride', 'amount': 350.00, 'category': 'Transportation', 'days_ago': 0},
            {'title': 'Monthly Rent', 'amount': 25000.00, 'category': 'Housing', 'days_ago': 14},
            {'title': 'Netflix Subscription', 'amount': 499.00, 'category': 'Entertainment', 'days_ago': 10},
            {'title': 'Movie Tickets', 'amount': 800.00, 'category': 'Entertainment', 'days_ago': 3},
            {'title': 'Electricity Bill', 'amount': 3200.00, 'category': 'Utilities', 'days_ago': 5},
            {'title': 'New Running Shoes', 'amount': 5500.00, 'category': 'Shopping', 'days_ago': 7},
            {'title': 'Pharmacy - Vitamins', 'amount': 1200.00, 'category': 'Healthcare', 'days_ago': 6},
            {'title': 'Gas Refill', 'amount': 4200.00, 'category': 'Transportation', 'days_ago': 4},
            {'title': 'Online Course - Python', 'amount': 4500.00, 'category': 'Education', 'days_ago': 12},
            {'title': 'Weekend Getaway Hotel', 'amount': 12000.00, 'category': 'Travel', 'days_ago': 8},
            {'title': 'Coffee with Friends', 'amount': 450.00, 'category': 'Food & Dining', 'days_ago': 0},
            {'title': 'Internet Bill', 'amount': 999.00, 'category': 'Utilities', 'days_ago': 9},
            {'title': 'Gym Membership', 'amount': 2000.00, 'category': 'Other', 'days_ago': 11},
        ]

        for item in dummy_data:
            Expense.objects.create(
                user=user,
                title=item['title'],
                amount=item['amount'],
                category=item['category'],
                date=timezone.now().date() - timedelta(days=item['days_ago']),
                description=f"Automated seed data for {item['title']}"
            )

        self.stdout.write(self.style.SUCCESS(f'Successfully seeded {len(dummy_data)} expenses for {username}'))
