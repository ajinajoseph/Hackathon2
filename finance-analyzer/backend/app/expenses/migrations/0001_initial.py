from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Expense',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('amount', models.DecimalField(decimal_places=2, max_digits=10)),
                ('category', models.CharField(
                    choices=[
                        ('Food & Dining', 'Food & Dining'),
                        ('Transportation', 'Transportation'),
                        ('Housing', 'Housing'),
                        ('Entertainment', 'Entertainment'),
                        ('Healthcare', 'Healthcare'),
                        ('Shopping', 'Shopping'),
                        ('Utilities', 'Utilities'),
                        ('Education', 'Education'),
                        ('Travel', 'Travel'),
                        ('Other', 'Other'),
                    ],
                    default='Other',
                    max_length=50,
                )),
                ('date', models.DateField(default=django.utils.timezone.now)),
                ('description', models.TextField(blank=True, default='')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'db_table': 'expenses',
                'ordering': ['-date', '-created_at'],
            },
        ),
    ]
