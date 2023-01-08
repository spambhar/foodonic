from django.conf import settings
from twilio.rest import Client

def send_sms(to_num):
        message = 'Food is available near you. Login to FoodOnic and start your drive.\n -Team FoodOnic.'
        from_num = '+15139603503'
        to = '+91'+to_num
        client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
        response = client.messages.create(body=message, to=to, from_=from_num)
        print("SMS Sent")