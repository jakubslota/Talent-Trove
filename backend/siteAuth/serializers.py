from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from talentTrove.models import Worker, Recruiter


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['user_id'] = user.id
        token['role'] = 'worker' if Worker.objects.filter(user=user).exists() else 'recruiter'
        token['user_role_id']= Worker.objects.get(user=user).id if Worker.objects.filter(user=user).exists() else Recruiter.objects.get(user=user).id
        return token


class RegisterSerializer(serializers.ModelSerializer):
    # custom validation for all fields in the serializer and return the error message
    def validate(self, data):
        if User.objects.filter(username=data['username']).exists():
            raise serializers.ValidationError("Użytkownik o podanej nazwie już istnieje.")
        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError("Użytkownik o podanym emailu już istnieje.")
        if len(data['password']) < 8:
            raise serializers.ValidationError("Hasło musi mieć co najmniej 8 znaków.")
        return data

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'last_name', 'first_name')
        # make password write only
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(username=validated_data['username'], email=validated_data['email'],
                                        password=validated_data['password'], first_name=validated_data['first_name'],
                                        last_name=validated_data['last_name'])
        Worker.objects.create(user=user)

        return user


class RegisterRecruiterSerializer(serializers.Serializer):
    company_name = serializers.CharField(label='Company name', max_length=240)
    username = serializers.CharField(label='Username', max_length=240)
    email = serializers.EmailField(label='Email')
    password = serializers.CharField(label='Password', max_length=240)
    last_name = serializers.CharField(label='Last name', max_length=240)
    first_name = serializers.CharField(label='First name', max_length=240)
    # custom validation for all fields in the serializer and return the error message
    def validate(self, data):
        if User.objects.filter(username=data['username']).exists():
            raise serializers.ValidationError("Użytkownik o podanej nazwie już istnieje.")
        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError("Użytkownik o podanym emailu już istnieje.")
        if len(data['password']) < 8:
            raise serializers.ValidationError("Hasło musi mieć co najmniej 8 znaków.")
        if len(data['company_name']) < 5:
            raise serializers.ValidationError("Nazwa firmy musi mieć co najmniej 5 znaków.")
        return data
