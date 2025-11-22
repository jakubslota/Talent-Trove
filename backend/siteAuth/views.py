from django.contrib.auth.models import User
from rest_framework import status, generics, permissions, serializers
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import MyTokenObtainPairSerializer, RegisterSerializer, RegisterRecruiterSerializer
from talentTrove.models import Recruiter


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(['GET'])
def getRoutes(request):
    routes = [
        'siteAuth/token',
        'siteAuth/token/refresh',
    ]
    return Response(routes)


class RegisterAPI(generics.GenericAPIView):
    serializer_class = RegisterSerializer
    queryset = RegisterSerializer.Meta.model.objects.all()
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.validate(request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class RegisterRecruiterAPI(generics.GenericAPIView):
    serializer_class = RegisterRecruiterSerializer
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.validate(request.data)
        serializer.is_valid(raise_exception=True)

        user = User.objects.create_user(username=request.data['username'], email=request.data['email'],
                                        password=request.data['password'], first_name=request.data['first_name'],
                                        last_name=request.data['last_name'])

        Recruiter.objects.create(user=user, company_name=request.data['company_name'])

        return Response(serializer.data, status=status.HTTP_201_CREATED)
