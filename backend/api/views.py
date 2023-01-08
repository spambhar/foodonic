import base64
from datetime import datetime
from rest_framework import viewsets, status, generics
from . import choices,helpers
from .send_mail import send_mail
from .choices import ADMIN_VERIFIED, DONOR, NGO, NONE, PICKEDUP, DETAILS_FILLED, EMAIL_VERIFIED
from .serilaizers import RegisterUserSerilizer, UsersSerializer, AreaSerilizer, CitySerilizer, FoodRequestSerilizer, ViewUsersSerializer
from .models import User, Area, City, FoodRequest
from rest_framework.permissions import AllowAny
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from .permissions import IsAdmin, IsDonor, IsNgo
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
import threading
from django.conf import settings
from twilio.rest import Client


class AllUserView(viewsets.ModelViewSet):
    permission_classes = [IsAdmin]
    serializer_class = ViewUsersSerializer
    queryset = User.objects.all()


class CurrentUserView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        serializer = UsersSerializer(self.request.user)
        data = serializer.data.copy()
        if data['verification_status'] not in (NONE, EMAIL_VERIFIED):
            data['city_name'] = helpers.get_city_by_id(serializer.data['city'])
        return Response(data)


class AllAreaView(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = AreaSerilizer
    queryset = Area.objects.all()


class AllCityView(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = CitySerilizer
    queryset = City.objects.all()


class GetAreasByCity(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, city):
        areas = Area.objects.filter(city=city)
        areas_serializer = AreaSerilizer(areas, many=True)
        return Response(areas_serializer.data, status=status.HTTP_200_OK)


class AllFoodRequestView(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = FoodRequestSerilizer
    queryset = FoodRequest.objects.all()


class AddFoodRequest(APIView):
    permission_classes = [IsDonor]
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        food_request = FoodRequestSerilizer(data=request.data)
        if (food_request.is_valid()):
            food_request.save()
            send_mails = threading.Thread(
                target=helpers.send_food_notifications, args=(request.data['city'], ))
            send_mails.start()
            return Response({'message': "Created"}, status=status.HTTP_201_CREATED)
        print(food_request.errors)
        return Response(food_request.errors, status=status.HTTP_400_BAD_REQUEST)

class CompleteFoodRequest(APIView):
    permission_classes = [IsDonor]

    def get(self, request, id):
        requestt = FoodRequest.objects.get(id=id)
        requestt.status=PICKEDUP
        requestt.save()
        return Response({'message': "Accepted"}, status=status.HTTP_200_OK)


class AllDonorView(generics.ListAPIView):
    permission_classes = [IsAdmin]
    # serializer_class = UsersSerializer
    # queryset = User.objects.filter(role=DONOR)

    def get(self, request):
        user = User.objects.raw("select * from api_user where role='Donor'")
        user_serializer = ViewUsersSerializer(user, many=True)
        # user_data=user_serializer.data
        print(user_serializer.data)
        for i in user_serializer.data:
            if i['verification_status'] not in (NONE, EMAIL_VERIFIED):
                i['city_name'] = (helpers.get_city_by_id((i['city'])))

        return Response(user_serializer.data, status=status.HTTP_200_OK)


class AllNgoView(generics.ListAPIView):
    permission_classes = [IsAdmin]
    # serializer_class = ViewUsersSerializer
    # queryset = User.objects.filter(role=NGO)

    def get(self, request):
        user = User.objects.raw("select * from api_user where role='Ngo'")
        user_serializer = ViewUsersSerializer(user, many=True)
        # user_data=user_serializer.data
        print(user_serializer.data)
        for i in user_serializer.data:
            if i['verification_status'] not in (NONE, EMAIL_VERIFIED):
                i['city_name'] = (helpers.get_city_by_id((i['city'])))

        return Response(user_serializer.data, status=status.HTTP_200_OK)


class RegisterUser(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data.copy()
        data['is_active'] = False
        reg_serilizer = RegisterUserSerilizer(data=data)
        if (reg_serilizer.is_valid()):
            reg_serilizer.save()

            # send activation link
            email_ascii = data['email'].encode("ascii")
            email_enc = base64.b64encode(email_ascii)
            email_enc_str = email_enc.decode("ascii")

            activation_link = "http://localhost:3000/activate/" + email_enc_str
            send_mail(
                subject='Verification for FoodOnic',
                text='Find the verification link for your account: ' + activation_link,
                html='',
                from_email='socialnet@gmail.com',
                to_emails=[data['email']]
            )

            return Response({'message': 'User registered Successfully.'}, status=status.HTTP_201_CREATED)
        return Response(reg_serilizer.errors, status=status.HTTP_400_BAD_REQUEST)


class Verify(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        if request.query_params.get("tk"):
            email = request.query_params.get("tk").encode("ascii")
            email_dec = base64.b64decode(email)
            email_dec_str = email_dec.decode("ascii")
            try:
                user = User.objects.get(email=email_dec_str)
                user.verification_status=EMAIL_VERIFIED
                if not user.is_active:
                    user.is_active = True
                    user.save()
                print(user.id)
                return Response({'message': 'Your account has been verified.'}, status=status.HTTP_200_OK)

            except:
                return Response(status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_400_BAD_REQUEST)


class ViewUserDetails(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        instance = User.objects.get(id=request.user.id)
        serializer = ViewUsersSerializer(instance)
        if serializer:
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UpdateCurrentUserDetails(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        req_data=request.data.copy()
        instance = User.objects.get(id=request.user.id)
        # request.data._mutable = True
        # city_name = request.data['city']
        # city_instance = City.objects.get(name=city_name)
        # city_serialier = CitySerilizer(city_instance)
        # # print(city_serialier)
        # request.data['city'] = city_serialier.data.get('id')
        if instance.verification_status!=ADMIN_VERIFIED and instance.role==NGO:
            req_data['is_active']=False
        serializer = UsersSerializer(
            instance, data=req_data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response({'message': "Data updated successfully"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GetUserById(APIView):
    permission_classes = [IsAdmin]

    def get(self, request, id):
        user = User.objects.get(id=id)
        serializer = UsersSerializer(instance=user)
        if serializer:
            return Response(data=serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_204_NO_CONTENT)


class VerifyNgo(APIView):
    permission_classes = [IsAdmin]

    def get(self, request, id):
        ngo_instance = User.objects.get(id=id)
        ngo_instance.is_active=True
        ngo_instance.save()
        if ngo_instance:
            data = {"verification_status": ADMIN_VERIFIED}
            serializer = ViewUsersSerializer(
                ngo_instance, data=data, partial=True)
            
            if serializer.is_valid():
                serializer.save()
                send_mail(html='', text=f"Hey {serializer.data['volunteer_name']},\n Thank you for creating account on our website.\n Your account has been verified by our officials. You are good to go.\n ",
                          subject='Account verification', from_email='', to_emails=[serializer.data['email'], ])
                return Response({'message': f"NGO {serializer.data['name']} verified successfully"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GetStatistics(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        data = {}
        food_requests = FoodRequest.objects.all()
        food_requests_serializer = FoodRequestSerilizer(
            food_requests, many=True)
        data['total_foodrequest'] = food_requests.count()
        data['food_quantity'] = 0
        for i in food_requests_serializer.data:
            data['food_quantity'] += i["quantity"]

        users = User.objects.count()
        data['total_user'] = users

        city = City.objects.count()
        data['total_city'] = city

        return Response(data, status=status.HTTP_200_OK)


class GetPastDonations(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role == 'Donor':
            foodrequests = FoodRequest.objects.filter(donor=request.user.id)
        else:
            foodrequests = FoodRequest.objects.filter(ngo=request.user.id)
        foodrequests_serializer = FoodRequestSerilizer(foodrequests, many=True)

        filtered_feed = []
        formate = '%Y-%m-%d %H:%M:%S'
        for i in foodrequests_serializer.data:
            # print(datetime.strptime(i['date_time'], formate))
            if i['status'] == choices.PICKEDUP:
                i['city_name'] = helpers.get_city_by_id(i['city'])
                i['area_name'] = helpers.get_area_by_id(i['area'])
                i['ngo_name'] = helpers.get_username_by_id(i['ngo'])
                i['donor_name'] = helpers.get_username_by_id(i['donor'])
                filtered_feed.append(i)
        return Response(filtered_feed, status=status.HTTP_200_OK)


class GetCurrentFoodRequests(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role == DONOR:
            foodrequests = FoodRequest.objects.filter(donor=request.user.id)
        else:
            foodrequests = FoodRequest.objects.filter(city=request.user.city)
        foodrequests_serializer = FoodRequestSerilizer(foodrequests, many=True)

        filtered_feed = []
        for i in foodrequests_serializer.data:
            # print(datetime.strptime(i['date_time'], formate))
            if i['status'] in (choices.PENDING, choices.ACCEPT):
                i['city_name'] = helpers.get_city_by_id(i['city'])
                i['area_name'] = helpers.get_area_by_id(i['area'])
                i['donor_d']=helpers.get_ngo_by_id(i['donor'])
                if (i.get('ngo')):
                    i['ngo_d'] = helpers.get_ngo_by_id(i['ngo'])
                filtered_feed.append(i)
        return Response(filtered_feed, status=status.HTTP_200_OK, content_type="multipart")

class GetCurrentAcceptedFoodRequests(APIView):
    parser_classes=[IsAuthenticated]

    def get(self, request):
        foodrequests = FoodRequest.objects.filter(ngo=request.user.id)
        foodrequests_serializer = FoodRequestSerilizer(foodrequests, many=True)

        filtered_feed = []
        for i in foodrequests_serializer.data:
            # print(datetime.strptime(i['date_time'], formate))
            if i['status'] == choices.ACCEPT:
                i['city_name'] = helpers.get_city_by_id(i['city'])
                i['area_name'] = helpers.get_area_by_id(i['area'])
                i['donor_d']=helpers.get_ngo_by_id(i['donor'])
                if (i.get('ngo')):
                    i['ngo_d'] = helpers.get_ngo_by_id(i['ngo'])
                filtered_feed.append(i)
        return Response(filtered_feed, status=status.HTTP_200_OK, content_type="multipart")


class DeleteAccount(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        user = User.objects.get(id=request.user.id)
        user.is_active = False
        user.save()
        # user_serializer = UsersSerializer(user)
        # user_serializer.data['is_active'] = False
        # if(user_serializer.is_valid()):
        #     user_serializer.save()

        return Response({"message": "Account deleted successfully"}, status=status.HTTP_200_OK)


class AcceptFoodRequest(APIView):
    permission_classes = [IsNgo]

    def get(self, request, id):
        food_request = FoodRequest.objects.get(id=id)
        food_request.ngo = request.user
        food_request.status = choices.ACCEPT
        food_request.save()

        return Response({'message': 'Request Accepted'}, status=status.HTTP_200_OK)

class SendSMS(APIView):
    permission_classes=[AllowAny]
    def get(self,request):
        message = 'Food is available near you. Login to FoodOnic and start your drive.\n -Team FoodOnic.'
        from_num = '+15139603503'
        to = ['+918866580464', '+919925611286']
        client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
        response = client.messages.create(body=message, to=to, from_=from_num)
        return Response("SMS Sent")


class GetFoodRequestsForReport(APIView):
    permission_classes=[IsAdmin]

    def get(self, requests, area):
        obj=FoodRequest.objects.raw(f"select * from api_foodrequest where area_id={area} and julianday('now') - julianday(date_time)<30 and status='pickedup'")
        serializer=FoodRequestSerilizer(obj, many=True)
        for i in serializer.data:
            i['city_name'] = helpers.get_city_by_id(i['city'])
            i['area_name'] = helpers.get_area_by_id(i['area'])
            i['donor_name'] = helpers.get_username_by_id(i['donor'])
            i['ngo_name'] = helpers.get_username_by_id(i['ngo'])
        print(serializer.data)
        return Response(serializer.data, status=status.HTTP_200_OK)

class FeedBack(APIView):
    permission_classes=[AllowAny]

    def post(self, request):
        admin = User.objects.get(role="Admin")
        data=request.data
        send_mails = threading.Thread(
                target=send_mail, args=('',f"Name: {data['name']}<br/> Email: {data['email']} <br/> Message: {data['feedbackData']}",f"Someone has provided a feedback.",'', [admin.email]))
        send_mails.start()
        
        return Response(status=status.HTTP_200_OK)
        
