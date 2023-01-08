from rest_framework import serializers
from .models import User, Area, City, FoodRequest


class UsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'


class ViewUsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id','email', 'name', 'role', 'mobile', 'img_url',
                  'city', 'volunteer_name', 'verification_status', 'registration_number')


class AreaSerilizer(serializers.ModelSerializer):
    class Meta:
        model = Area
        fields = '__all__'


class CitySerilizer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = '__all__'


class FoodRequestSerilizer(serializers.ModelSerializer):
    class Meta:
        model = FoodRequest
        fields = '__all__'



class RegisterUserSerilizer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('email', 'password', 'is_active')

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance
