from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Area, City, FoodRequest, User
# Register your models here.

admin.site.register(User)
admin.site.register(Area)
admin.site.register(City)
admin.site.register(FoodRequest)