from django.contrib.auth.base_user import BaseUserManager

from .choices import ADMIN, ADMIN_VERIFIED

class UserManager(BaseUserManager):
    use_in_migrations = True

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email is required')
        
        email=self.normalize_email(email)
        user=self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    
    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('role', ADMIN)
        extra_fields.setdefault('verification_status', ADMIN_VERIFIED)
        if extra_fields.get('is_staff') is not True:
            raise ValueError(('Super user must have is_staff true'))
        
        return self.create_user(email=email, password=password, **extra_fields)

