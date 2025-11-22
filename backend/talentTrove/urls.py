from django.urls import path
from . import views
from rest_framework.schemas import get_schema_view
from django.views.generic import TemplateView

urlpatterns = [
    path('api-schema/', get_schema_view(
        title='API Schema',
        description='Guide for the REST API'
    ), name='api_schema'),
    path('docs/', TemplateView.as_view(
        template_name='docs.html',
        extra_context={'schema_url':'api_schema'}
        ), name='swagger-ui'),

    path('workers/public/', views.WorkersPublicList.as_view(), name='workers'), # Lista publicznych profili pracownikow
    path('workers/', views.WorkersList.as_view(), name='workers'), # Lista pracownikow
    path('workers/<int:pk>/', views.WorkersDetails.as_view(), name='workers'), # Profil pracownika

    path('visits/workers/<int:pk>/', views.Visits.as_view(), name='visits'), # Ilosc odwiedzin profilu pracownika

    path('invitations/workers/<int:pk>/', views.InvitationsWorkersList.as_view(), name='invitations'), # Lista zaproszen
    path('invitations/recruiters/<int:pk>/', views.InvitationsRecruitersList.as_view(), name='invitations'), # Lista zaproszen
    path('invitations/<int:pk>/', views.Invitations.as_view(), name='invitations'), # Szczegoly zaproszenia
    path('invitations/create/', views.InvitationsCreate.as_view(), name='invitations'), # Tworzenie zaproszenia

    path('favorites/recruiters/<int:pk>/', views.FavoritesRecruitersList.as_view(), name='favorites'), # Lista ulubionych
    path('favorites/create/', views.FavoritesCreate.as_view(), name='favorites'), # Dodawanie do ulubionych
    path('favorites/<int:pk>/', views.Favorites.as_view(), name='favorites'), # Usuwanie z ulubionych

    path('cities/', views.CitiesList.as_view(), name='cities'), # Lista miast

    path('specializations/', views.SpecializationsList.as_view(), name='specializations'),# Lista specjalizacji

    path('programming-languages/', views.ProgrammingLanguagesList.as_view(), name='programming_languages'),# Lista jezykow programowania
    path('programming-languages/workers/<int:pk>/', views.WorkersProgrammingLanguagesCreate.as_view(), name='workers'),
]
