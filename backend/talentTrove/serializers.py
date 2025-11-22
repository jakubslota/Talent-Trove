import datetime

from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Recruiter, City, Specialization, Invitation, Favorite, Worker, Visit, ProgrammingLanguages, \
    WorkerProgrammingLanguages


class RecruiterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recruiter
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email']
class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = '__all__'


class SpecializationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Specialization
        fields = '__all__'

class InvitationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invitation
        fields = '__all__'

    def validate(self, data):
        if data['status'] not in ['new', 'rejected', 'done', 'accepted', 'canceled']:
            raise serializers.ValidationError("Status musi być new, rejected, done, accepted lub canceled.")
        if data['date'] is not None:
            date = datetime.datetime.strptime(str(data['date'].strftime('%Y/%m/%d,%H:%M:%S')), '%Y/%m/%d,%H:%M:%S')
            if date < datetime.datetime.now() + datetime.timedelta(days=2):
                raise serializers.ValidationError("Data nie może być wcześniejsza niż 2 dni od teraz.")
        else:
            raise serializers.ValidationError("Data nie może być pusta.")
        return data

    def create(self, validated_data):
        # add always invite with status new
        validated_data['status'] = 'new'
        invitation = Invitation.objects.create(**validated_data)
        return invitation

    def to_representation(self, instance):
        response = super().to_representation(instance)
        response['worker'] = WorkerSerializer(instance.worker).data
        response['recruiter'] = RecruiterSerializer(instance.recruiter).data
        return response


class FavoriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Favorite
        fields = '__all__'

    def to_representation(self, instance):
        response = super().to_representation(instance)
        response['worker'] = WorkerSerializer(instance.worker).data
        response['recruiter'] = RecruiterSerializer(instance.recruiter).data
        return response



    def validate(self, data):
        if Favorite.objects.filter(worker=data['worker'], recruiter=data['recruiter']).exists():
            raise serializers.ValidationError("Ten rekord już istnieje.")
        return data


class WorkerSerializer(serializers.ModelSerializer):

    class Meta:
        model = Worker
        fields = '__all__'
    def to_representation(self, instance):
        response = super().to_representation(instance)
        response['user'] = UserSerializer(instance.user).data
        response['city'] = CitySerializer(instance.city).data
        response['specialization'] = SpecializationSerializer(instance.specialization).data
        response['programming_languages'] = WorkerProgrammingLanguagesSerializer(instance.worker_programming_languages, many=True).data
        return response


    def validate(self, data):
        if data['age'] < 18 or data['age'] > 70:
            raise serializers.ValidationError("Wiek musi być większy niż 18 i mniejszy niż 70 lat.")
        if data['experience'] <= 0 or data['experience'] > 50:
            raise serializers.ValidationError("Doświadczenie musi być większe niż 0 i mniejsze niż 50 lat.")
        if data['prefered_salary'] < 3000 or data['prefered_salary'] > 1000000:
            raise serializers.ValidationError("Wynagrodzenie musi być większe niż 3 000 i mniejsze niż 1 000 000zł")
        if data['prefered_style_of_work'] not in ['remote', 'office', 'hybrid']:
            raise serializers.ValidationError("Preferowany styl pracy musi być remote, office lub hybrid.")
        if len(data['field_visibility']) != 6 or not data['field_visibility'].isdigit() or not all([int(i) in [0,1] for i in data['field_visibility']]):
            raise serializers.ValidationError("Widoczność pól musi być 6-cio cyfrowa liczba binarna odpowiadającą kolejno za widoczność pól: specialization, description, experience, education, prefered_salary, prefered_style_of_work.")
        if data['education'] not in ['primary', 'secondary', 'bachelor', 'master', 'phd']:
            raise serializers.ValidationError("Wykształcenie musi być primary, secondary, bachelor, master lub phd.")
        if data['gender'] not in ['male', 'female', 'other']:
            raise serializers.ValidationError("Płeć muci być male, female lub other.")

        return data



class ProgrammingLanguagesSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProgrammingLanguages
        fields = '__all__'

    def to_representation(self, instance):
        response = super().to_representation(instance)
        response['name'] = instance.name
        return response

class WorkerProgrammingLanguagesSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkerProgrammingLanguages
        fields = '__all__'

    def validate(self, data):
        if data['advanced'] not in ['beginner', 'intermediate', 'advanced']:
            raise serializers.ValidationError("Poziom znajomości języka programowania musi być junior, mid lub senior.")
        return data

    def to_representation(self, instance):
        response = {
            'advanced': instance.advanced,
            'programming_languages': ProgrammingLanguagesSerializer(instance.programming_languages).data.get('name')
        }
        return response

class VisitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Visit
        fields = '__all__'

    def create(self, validated_data):
        visit = Visit.objects.create(**validated_data)
        return visit
