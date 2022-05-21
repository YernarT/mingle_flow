from django.db import models


class Task(models.Model):

    name = models.CharField(max_length=40, verbose_name='Тапсырма атауы')
    description = models.CharField(
        max_length=254, null=True, verbose_name='Тапсырма сипаттамасы')
    start_time = models.DateTimeField(verbose_name='Бастау уақыт')
    end_time = models.DateTimeField(verbose_name='Аяқтау уақыт')
    funds = models.PositiveIntegerField(verbose_name='Бөлінген қаржы')
    team = models.ForeignKey(
        'team.Team', on_delete=models.CASCADE, verbose_name='Команда')
    creator = models.ForeignKey(
        'user.User', on_delete=models.CASCADE, verbose_name='Құрушы')
    create_time = models.DateTimeField(
        auto_now_add=True, verbose_name='Құрылған уақыт')

    class Meta:
        db_table = 'task'
        verbose_name = 'Тапсырма'
        verbose_name_plural = 'Тапсырмалар'

    def __str__(self):
        return self.name


class TaskResult(models.Model):

    task = models.ForeignKey(
        Task, on_delete=models.CASCADE, verbose_name='Тапсырма')
    file = models.FileField(upload_to='task/result/')
    submitter = models.ForeignKey(
        'user.User', on_delete=models.CASCADE, verbose_name='Тапсырушы')
    submitted = models.BooleanField(default=False, verbose_name='Орындалды')
    finished = models.BooleanField(default=False, verbose_name='Аяқталды')
    submitted_time = models.DateTimeField(
        auto_now_add=True, verbose_name='Тапсыған уақыт')

    class Meta:
        db_table = 'task_result'
        verbose_name = 'Тапсырма Нәтижесі'
        verbose_name_plural = 'Тапсырма Нәтижелері'

    def __str__(self):
        return self.task.name
