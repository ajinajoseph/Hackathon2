import sys
import os

# Add the Django backend to the Python path
backend_dir = os.path.join(os.path.dirname(__file__), '..', 'finance-analyzer', 'backend')
sys.path.insert(0, os.path.abspath(backend_dir))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'app.settings')

# Auto-run migrations (SQLite is ephemeral on Vercel, so run every cold start)
try:
    import django
    django.setup()
    from django.core.management import call_command
    call_command('migrate', '--run-syncdb', verbosity=0, interactive=False)
except Exception as e:
    print(f"Migration warning: {e}")

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
app = application  # Vercel looks for 'app'
