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

        # 2. Clear existing expenses for John
        Expense.objects.filter(user=user).delete()

        # 3. Comprehensive Generation
        categories = {
            'Food & Dining': (200, 2000, ['Grocery Store', 'Italian Restaurant', 'Coffee Shop', 'Fast Food', 'Sushi Bar', 'Bakery']),
            'Transportation': (100, 1500, ['Uber Ride', 'Gas Station', 'Bus Pass', 'Train Ticket', 'Parking Fee']),
            'Housing': (15000, 30000, ['Monthly Rent', 'Mortgage Payment']),
            'Entertainment': (500, 5000, ['Netflix', 'Cinema', 'Concert Tickets', 'Bowling', 'Spotify', 'Gaming']),
            'Healthcare': (500, 3000, ['Pharmacy', 'Doctor Consultation', 'Dental Checkup', 'Health Insurance']),
            'Shopping': (1000, 10000, ['Amazon Purchase', 'Clothing', 'Electronics', 'Home Decor']),
            'Utilities': (1000, 5000, ['Electricity Bill', 'Water Bill', 'Internet Subscription', 'Mobile Plan']),
            'Education': (2000, 8000, ['Online Course', 'Books', 'Workshop Fee']),
            'Travel': (5000, 20000, ['Hotel Booking', 'Flight Ticket', 'Rental Car']),
            'Other': (100, 1000, ['Miscellaneous', 'Gift', 'Donation']),
        }

        total_seeded = 0
        now = timezone.now().date()
        
        # Seed for the last 12 months
        for month_offset in range(12):
            # Calculate start of month
            days_back = month_offset * 30
            month_date = now - timedelta(days=days_back)
            
            # Recurring Monthly Expenses
            # Housing
            Expense.objects.create(
                user=user,
                title='Monthly Rent',
                amount=random.uniform(22000, 25000),
                category='Housing',
                date=month_date.replace(day=1),
                description='Automated monthly rent'
            )
            # Utilities (Internet)
            Expense.objects.create(
                user=user,
                title='Broadband Internet',
                amount=random.uniform(800, 1200),
                category='Utilities',
                date=month_date.replace(day=5),
                description='Monthly internet subscription'
            )
            total_seeded += 2

            # Weekly Expenses
            for week in range(4):
                week_date = month_date - timedelta(days=week * 7)
                
                # Groceries (Weekly)
                Expense.objects.create(
                    user=user,
                    title='Weekly Groceries',
                    amount=random.uniform(2000, 4500),
                    category='Food & Dining',
                    date=week_date,
                    description='Weekly grocery run'
                )
                total_seeded += 1

                # Random Transactions (2-4 per week)
                num_random = random.randint(3, 6)
                for _ in range(num_random):
                    cat_name = random.choice(list(categories.keys()))
                    if cat_name == 'Housing': continue # Skip housing for randoms
                    
                    min_amt, max_amt, titles = categories[cat_name]
                    title = random.choice(titles)
                    
                    # Random date within the week
                    rand_day = week_date - timedelta(days=random.randint(0, 6))
                    # Don't seed future dates
                    if rand_day > now: continue

                    Expense.objects.create(
                        user=user,
                        title=title,
                        amount=round(random.uniform(min_amt, max_amt), 2),
                        category=cat_name,
                        date=rand_day,
                        description=f"Generated {cat_name} expense"
                    )
                    total_seeded += 1

        self.stdout.write(self.style.SUCCESS(f'Successfully seeded {total_seeded} expenses over 12 months for {username}'))
