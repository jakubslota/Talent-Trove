from django.urls import path
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

from .views import MyTokenObtainPairView, RegisterAPI, RegisterRecruiterAPI, getRoutes

urlpatterns = [
    path('', getRoutes),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterAPI.as_view(), name='register'),
    path('register/recruiter/', RegisterRecruiterAPI.as_view(), name='register-recruiter')
]
