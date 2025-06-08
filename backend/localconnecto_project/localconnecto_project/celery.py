import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'localconnecto_project.settings')

# This creates the Celery "app" object, named 'localconnecto_project'
app = Celery('localconnecto_project')

# Load settings from Django's settings.py (only keys starting with 'CELERY_')
app.config_from_object('django.conf:settings', namespace='CELERY') 

app.autodiscover_tasks()