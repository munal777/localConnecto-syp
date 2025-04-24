from django.apps import AppConfig



class UsersAuthConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'users_auth'


    def ready(self):
        import users_auth.signals