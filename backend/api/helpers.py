from .send_sms import send_sms
from .choices import NGO
from .models import City, Area, User
from .serilaizers import CitySerilizer, AreaSerilizer, ViewUsersSerializer
from .send_mail import send_mail

def get_city_by_id(id):
    city=City.objects.get(id=id)
    city_serializer=CitySerilizer(city)
    city_name = city_serializer.data['name']
    
    return city_name

def get_area_by_id(id):
    area=Area.objects.get(id=id)
    area_serializer=AreaSerilizer(area)
    area_name = area_serializer.data['name']

    return area_name

def get_username_by_id(id):
    user=User.objects.get(id=id)
    user_serializer=ViewUsersSerializer(user)
    user_name = user_serializer.data['name']
    # print(user_name)
    return user_name

def get_ngo_by_id(id):
    user=User.objects.get(id=id)
    user_serializer=ViewUsersSerializer(user)
    # print(user_name)
    return user_serializer.data

def send_food_notifications(city):
    user=User.objects.filter(role=NGO,city=city, is_ondrive=True)
    user_serializer=ViewUsersSerializer(user, many=True)
    for i in user_serializer.data:
        print(i['email'])
        print(i['mobile'])
        send_sms(i['mobile'])
        send_mail(subject='Food is available near you', text='Hey, Food is available near you. Pleas Login to see details and collect it.', to_emails=[i['email']], html='')