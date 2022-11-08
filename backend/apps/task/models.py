from django.db import models


class Task(models.Model):

    name = models.CharField(max_length=40, verbose_name='Тапсырма атауы')
    description = models.CharField(
        max_length=520, null=True, blank=True, verbose_name='Тапсырма сипаттамасы')
    start_time = models.DateTimeField(verbose_name='Бастау уақыт')
    end_time = models.DateTimeField(verbose_name='Аяқтау уақыт')
    funds = models.PositiveIntegerField(verbose_name='Бөлінген қаржы')
    is_finished = models.BooleanField(
        default=False, verbose_name='Тапсырма аяқталған')

    project = models.ForeignKey(
        'project.Project', on_delete=models.CASCADE, verbose_name='Жоба')
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


class TaskPrincipal(models.Model):

    task = models.ForeignKey(
        Task, on_delete=models.CASCADE, verbose_name='Тапсырма')
    user = models.ForeignKey(
        'user.User', on_delete=models.CASCADE, verbose_name='Жауапты мүше')

    class Meta:
        db_table = 'task_principal'
        verbose_name = 'Жауапты мүше'
        verbose_name_plural = 'Жауапты мүшелер'

    def __str__(self):
        return self.task.name


class SubmittedResult(models.Model):

    task = models.ForeignKey(
        Task, on_delete=models.CASCADE, verbose_name='Тапсырма')
    description = models.TextField(
        max_length=5000, null=True, blank=True, verbose_name='Нәтиже сипаттамасы')
    file = models.FileField(upload_to='task/result/',
                            null=True, verbose_name='Қосымша құжат')
    submitter = models.ForeignKey(
        'user.User', on_delete=models.CASCADE, verbose_name='Тапсырушы')
    submitted_time = models.DateTimeField(
        auto_now_add=True, verbose_name='Тапсыған уақыт')

    class Meta:
        db_table = 'submitted_result'
        verbose_name = 'Тапсырма Нәтижесі'
        verbose_name_plural = 'Тапсырма Нәтижелері'

    def __str__(self):
        return self.task.name
