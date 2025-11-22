from django.db import models
from django.utils import timezone

class Recruiter(models.Model):
    company_name = models.CharField(max_length=100)
    user = models.ForeignKey('auth.User', on_delete=models.CASCADE, related_name='recruiter')


class City(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class Specialization(models.Model):
    name = models.CharField(max_length=200, unique=True)

    def __str__(self):
        return self.name


class Worker(models.Model):
    user = models.ForeignKey('auth.User', on_delete=models.CASCADE, related_name='worker')
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name='worker', null=True)
    gender = models.CharField(max_length=255, null=True, blank=True)
    age = models.IntegerField(null=True, blank=True)
    specialization = models.ForeignKey(Specialization, on_delete=models.CASCADE, related_name='worker', null=True)
    description = models.TextField(null=True, blank=True)
    experience = models.IntegerField(null=True, blank=True)
    education = models.CharField(max_length=255, null=True, blank=True)
    prefered_salary = models.IntegerField(null=True, blank=True)
    prefered_style_of_work = models.CharField(max_length=255, null=True, blank=True)
    account_visibility = models.BooleanField(default=False)
    field_visibility = models.CharField(max_length=6, default="000000")


class Favorite(models.Model):
    worker = models.ForeignKey(Worker, on_delete=models.CASCADE, related_name='favorite')
    recruiter = models.ForeignKey(Recruiter, on_delete=models.CASCADE, related_name='favorite')


class Invitation(models.Model):
    worker = models.ForeignKey(Worker, on_delete=models.CASCADE, related_name='invite')
    recruiter = models.ForeignKey(Recruiter, on_delete=models.CASCADE, related_name='invite')
    status = models.CharField(max_length=255, null=True, blank=True)
    date = models.DateTimeField(null=True, blank=True)



class ProgrammingLanguages(models.Model):
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name


class WorkerProgrammingLanguages(models.Model):
    worker = models.ForeignKey(Worker, on_delete=models.CASCADE, related_name='worker_programming_languages')
    programming_languages = models.ForeignKey(ProgrammingLanguages, on_delete=models.CASCADE,
                                              related_name='worker_programming_languages')
    advanced = models.CharField(max_length=255)


class Visit(models.Model):
    worker = models.ForeignKey(Worker, on_delete=models.CASCADE, related_name='visit')
    date = models.DateTimeField(auto_now_add=True)
