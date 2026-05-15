import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'app.settings')

# Auto-run migrations on startup (needed for Vercel serverless)
try:
    from django.core.management import call_command
    application_setup = get_wsgi_application()
    call_command('migrate', '--run-syncdb', verbosity=0, interactive=False)
except Exception as e:
    print(f"Migration warning: {e}")

application = get_wsgi_application()
app = application  # Vercel looks for 'app'
