from datetime import datetime
from distutils.command.upload import upload
from email.policy import default
from tkinter.tix import Tree
from django.db import models
from django.contrib.auth.models import AbstractUser
from .manager import UserManager
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from .choices import FOOD_TYPE_CHOICES, NGO, NGO_VERIFICATION_STATUS_CHOICES, NONE, PENDING, ROLES, STATUS_CHOICES
from django.utils.translation import gettext_lazy as _


from django.dispatch import receiver
from django.urls import reverse
from django_rest_passwordreset.signals import reset_password_token_created
from .send_mail import send_mail 

class City(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class Area(models.Model):
    name = models.CharField(max_length=255)
    city = models.ForeignKey("City", null=True, on_delete=models.DO_NOTHING)

    def __str__(self):
        return self.name


class User(AbstractBaseUser, PermissionsMixin):
    last_name = None
    date_joined = None
    is_staff = models.BooleanField(default=False)
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=255)
    volunteer_name = models.CharField(max_length=255, null=True, blank=True)
    password = models.CharField(max_length=255)
    mobile = models.CharField(max_length=10, null=True, blank=True)
    registration_number = models.CharField(
        max_length=255, null=True, blank=True)
    img_url = models.ImageField(upload_to='user_images', null=True, blank=True)
    is_active = models.BooleanField(default=True)

    role = models.CharField(max_length=50, choices=ROLES, default=NGO)
    city = models.ForeignKey(
        "City", on_delete=models.DO_NOTHING, null=True, blank=True)
    verification_status = models.CharField(
        max_length=255, choices=NGO_VERIFICATION_STATUS_CHOICES, default=NONE)
    last_login = models.DateTimeField(null=True, blank=True)
    is_ondrive = models.BooleanField(default=False)

    objects = UserManager()
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['password']

    class Meta:
        db_table = "api_user"

    def __str__(self):
        return str(self.email)

    def has_perm(self, perm, obj=None): return self.is_superuser

    def has_module_perms(self, app_label): return self.is_superuser


class FoodRequest(models.Model):
    donor = models.ForeignKey(
        "User", on_delete=models.CASCADE, related_name='donor', db_index=True)
    ngo = models.ForeignKey(
        "User", on_delete=models.CASCADE, related_name='ngo', null=True, blank=True, db_index=True)
    food_name = models.CharField(max_length=255)
    type = models.CharField(
        max_length=255, choices=FOOD_TYPE_CHOICES, null=True)
    latitude = models.DecimalField(max_digits=22, decimal_places=16)
    longitude = models.DecimalField(max_digits=22, decimal_places=16)
    date_time = models.DateTimeField(default=datetime.now())
    quantity = models.IntegerField()
    img = models.ImageField(
        upload_to='food_request_images', null=Tree, blank=True)
    status = models.CharField(
        max_length=255, choices=STATUS_CHOICES, default=PENDING)
    city = models.ForeignKey("City", on_delete=models.CASCADE, db_index=True)
    area = models.ForeignKey("Area", on_delete=models.CASCADE)
    def image_img(self):
        if self.img:
            return u'<img src="%s" width="50" height="50" />' % self.img.url
        else:
            return '(Sin imagen)'
    image_img.short_description = 'Thumb'
    image_img.allow_tags = True



@receiver(reset_password_token_created)
def password_reset_token_created(sender, instance, reset_password_token, *args, **kwargs):

    email_plaintext_message = "http://localhost:3000{}{}".format(reverse('password_reset:reset-password-request'), reset_password_token.key)
    # link=f"<a hrerf={email_plaintext_message}> Link </a>"

    send_mail(
        #subject:
        subject="Password Reset Link",
        # title:
        text="Password Reset Link {title}".format(title="FoodOnic"),
        # message:
        html = email_plaintext_message,
        # from:
        from_email= "noreply@somehost.local",
        # to:
        to_emails=[reset_password_token.user.email]
    )

