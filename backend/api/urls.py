"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, include, re_path
from . import views
from rest_framework import routers


router = routers.DefaultRouter()
router.register(r'city', views.AllCityView)
router.register(r'area', views.AllAreaView)
router.register(r'food-request', views.AllFoodRequestView)
router.register(r'users', views.AllUserView)

urlpatterns = [
    path('', include(router.urls)),

    # authhentication urls
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('api-auth/', include('drf_social_oauth2.urls', namespace='drf')),
    path('register/', views.RegisterUser.as_view(), name='create_user'),
    path('delete-account/', views.DeleteAccount.as_view(), name="delete_account"),
    path('password-reset/', include('django_rest_passwordreset.urls',
         namespace='password_reset')),
    path('activate', views.Verify.as_view(), name="verify_user"),
    
    path('feedback/', views.FeedBack.as_view(), name="feedback"),

    # role wise users list urls
    # path('all-user/', views.AllUserView.as_view(), name="all"),
    path('all-donor/', views.AllDonorView.as_view(), name="all_donor"),
    path('all-ngo/', views.AllNgoView.as_view(), name="all_ngo"),

    # update self user data
    path('user/update/', views.UpdateCurrentUserDetails.as_view(), name="update_user"),

    # for admin verification of NGO
    path('verify-ngo/<int:id>/', views.VerifyNgo.as_view(), name='verify_ngo'),

    # view self user data
    path('user/details/', views.CurrentUserView.as_view(),
         name="view_user_details"),

    # get user details by id
    path('user/details/<int:id>/',
         views.GetUserById.as_view(), name="get_user_by_id"),

    path('statistics/', views.GetStatistics.as_view(), name="get_statistics"),

    path('past-donations/', views.GetPastDonations.as_view(),
         name="get_past_donations"),

    path('current-requests/', views.GetCurrentFoodRequests.as_view(),
         name="get_current_foodrequests"),

    path('send-sms/', views.SendSMS.as_view(), name='send_sms'),


    path('accepted-current-requests/', views.GetCurrentAcceptedFoodRequests.as_view(),
         name="get_current_foodrequests"),

    path('get-areas/<int:city>/', views.GetAreasByCity.as_view(),
         name="get_areas_by_city"),

    path('add-food-request/', views.AddFoodRequest.as_view(),
         name='add_food_request'),

    path('complete-food-request/<int:id>/', views.CompleteFoodRequest.as_view(),
         name='add_food_request'),

    path('accept-food-request/<int:id>/', views.AcceptFoodRequest.as_view(),
         name='accept_food_request'),
    path('generate-report/<int:area>/', views.GetFoodRequestsForReport.as_view(),
         name='get_food_requests_for_report'),

]
