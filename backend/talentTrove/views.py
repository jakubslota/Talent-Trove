import datetime

from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .serializers import *

private_permissions = [permissions.IsAuthenticated]
public_permissions = [permissions.AllowAny]

class WorkersProgrammingLanguagesCreate(generics.CreateAPIView):
    permission_classes = private_permissions
    queryset = WorkerProgrammingLanguages.objects.all()
    serializer_class = WorkerProgrammingLanguagesSerializer

    def post(self, request, *args, **kwargs):
        lista_elementow = request.data  # Przyjmuje JSON jako listę

        if not isinstance(lista_elementow, list):
            return Response({"error": "Oczekiwano listy obiektów JSON."}, status=status.HTTP_400_BAD_REQUEST)

        for element_data in lista_elementow:
            # Pobieramy pola, które mają być użyte do identyfikacji obiektu
            identyfikacyjne_pola = {
                'worker': self.kwargs['pk'],
                'programming_languages': element_data.get('programming_languages', None),
                # Dodaj kolejne pola, które mają być użyte do identyfikacji
            }

            # Sprawdzamy, czy obiekt o podanych polach istnieje
            try:
                instance = WorkerProgrammingLanguages.objects.get(**identyfikacyjne_pola)
            except WorkerProgrammingLanguages.DoesNotExist:
                instance = None

            serializer = WorkerProgrammingLanguagesSerializer(instance=instance, data=element_data)
            if serializer.is_valid():
                serializer.save()
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response({"message": "Operacja zakończona sukcesem."}, status=status.HTTP_200_OK)
class WorkersPublicList(generics.ListAPIView):
    # API endpoint that allows backend to be viewed.
    permission_classes = public_permissions
    serializer_class = WorkerSerializer

    def get_queryset(self):
        workers = Worker.objects.filter(account_visibility=True)
        # set to none fields which are not visible looking at field_visibility
        for worker in workers:
            if worker.field_visibility[0] == '0':
                worker.prefered_salary = None
            if worker.field_visibility[1] == '0':
                worker.experience = None
            if worker.field_visibility[2] == '0':
                worker.specialization = None
            if worker.field_visibility[3] == '0':
                worker.education = None
            if worker.field_visibility[4] == '0':
                worker.prefered_style_of_work = None
            if worker.field_visibility[5] == '0':
                worker.description = None
            worker.account_visibility = None
            worker.field_visibility = None
            worker.user.email = None
            worker.description = None

        return workers


class WorkersList(generics.ListAPIView):
    # API endpoint that allows backend to be viewed.
    permission_classes = private_permissions
    queryset = Worker.objects.all()
    serializer_class = WorkerSerializer


class WorkersDetails(generics.RetrieveUpdateAPIView):
    # API endpoint that allows backend to be viewed.
    permission_classes = private_permissions
    serializer_class = WorkerSerializer

    def get_queryset(self):
        worker = Worker.objects.filter(id=self.kwargs['pk'])
        # add dict with all programming languages and advanced level
        worker[0].programming_languages = WorkerProgrammingLanguages.objects.filter(worker=worker[0])
        return worker


class Invitations(generics.RetrieveUpdateDestroyAPIView):
    # API endpoint that allows backend to be viewed.
    permission_classes = private_permissions
    queryset = Invitation.objects.all()
    serializer_class = InvitationSerializer
    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        # Update the status field based on the request data
        new_status = request.data.get('status', None)

        if new_status == 'new' and (
                instance.status == 'accepted' or instance.status == 'done' or instance.status == 'rejected' or instance.status == 'canceled' or instance.status == 'new'):
            raise serializers.ValidationError(
                "Nie można zmienić statusu z new, accepted, done, rejected lub canceled na new.")
        if new_status == 'accepted' and (
                instance.status == 'done' or instance.status == 'rejected' or instance.status == 'canceled' or instance.status == 'accepted'):
            raise serializers.ValidationError("Nie można zmienić statusu z accepted, done, rejected lub canceled na accepted.")
        if new_status == 'done' and (instance.status == 'rejected' or instance.status == 'canceled' or instance.status == 'done'):
            raise serializers.ValidationError("Nie można zmienić statusu z done, rejected lub canceled na done.")
        if new_status == 'rejected' and (instance.status == 'canceled' or instance.status == 'rejected' or instance.status == 'done'):
            raise serializers.ValidationError("Nie można zmienić statusu z done, rejected lub canceled na rejected.")
        if new_status == 'canceled' and (instance.status == 'done' or instance.status == 'rejected' or instance.status == 'canceled'):
            raise serializers.ValidationError("Nie można zmienić statusu z done, rejected lub canceled na canceled.")

        if new_status is not None:
            instance.status = new_status
            instance.save()

            # You can perform additional logic here if needed

            return Response({"status": "Status updated successfully."}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid request data."}, status=status.HTTP_400_BAD_REQUEST)


class InvitationsCreate(generics.CreateAPIView):
    # API endpoint that allows backend to be viewed.
    permission_classes = private_permissions
    queryset = Invitation.objects.all()
    serializer_class = InvitationSerializer


class FavoritesCreate(generics.CreateAPIView):
    # API endpoint that allows backend to be viewed.
    permission_classes = private_permissions
    queryset = Favorite.objects.all()
    serializer_class = FavoriteSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.validate(request.data)
        serializer.is_valid(raise_exception=True)

        # check if worker is in favorites
        if Favorite.objects.filter(worker=request.data['worker'], recruiter=request.data['recruiter']).exists():
            return Response({"error": "Ten rekord już istnieje."}, status=status.HTTP_400_BAD_REQUEST)

        # check if worker is in workers
        if Worker.objects.filter(user=request.user):
            return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)

        favorite = serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class Favorites(generics.DestroyAPIView):
    # API endpoint that allows backend to be viewed.
    permission_classes = private_permissions
    queryset = Favorite.objects.all()
    serializer_class = FavoriteSerializer


class CitiesList(generics.ListAPIView):
    # API endpoint that allows backend to be viewed.
    permission_classes = private_permissions
    queryset = City.objects.all()
    serializer_class = CitySerializer


class SpecializationsList(generics.ListAPIView):
    # API endpoint that allows backend to be viewed.
    permission_classes = private_permissions
    queryset = Specialization.objects.all()
    serializer_class = SpecializationSerializer


class ProgrammingLanguagesList(generics.ListAPIView):
    # API endpoint that allows backend to be viewed.
    permission_classes = private_permissions
    queryset = ProgrammingLanguages.objects.all()
    serializer_class = ProgrammingLanguagesSerializer


class InvitationsWorkersList(generics.ListAPIView):
    # API endpoint that allows backend to be viewed.
    permission_classes = private_permissions
    serializer_class = InvitationSerializer

    def get_queryset(self):
        return Invitation.objects.filter(worker=self.kwargs['pk'])


class InvitationsRecruitersList(generics.ListAPIView):
    # API endpoint that allows backend to be viewed.
    permission_classes = private_permissions
    serializer_class = InvitationSerializer

    def get_queryset(self):
        return Invitation.objects.filter(recruiter=self.kwargs['pk'])


class FavoritesRecruitersList(generics.ListAPIView):
    # API endpoint that allows backend to be viewed.
    permission_classes = private_permissions
    serializer_class = FavoriteSerializer

    def get_queryset(self):
        return Favorite.objects.filter(recruiter=self.kwargs['pk'])


class Visits(generics.ListCreateAPIView):
    # API endpoint that allows backend to be viewed.
    permission_classes = private_permissions
    serializer_class = VisitSerializer

    def get_queryset(self):
        return Visit.objects.filter(worker=self.kwargs['pk'])

    def get(self, request, *args, **kwargs):
        daily = self.get_queryset().filter(date__date=datetime.date.today()).count()
        weekly = self.get_queryset().filter(date__week=datetime.date.today().isocalendar()[1]).count()
        monthly = self.get_queryset().filter(date__month=datetime.date.today().month).count()
        yearly = self.get_queryset().filter(date__year=datetime.date.today().year).count()
        return Response({"daily": daily, "weekly": weekly, "monthly": monthly, "yearly": yearly}, status=status.HTTP_200_OK)




