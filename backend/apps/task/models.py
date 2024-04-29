from django.db import models


class TaskPriority(models.IntegerChoices):
    NONE = 0
    LOW = 1
    MEDIUM = 2
    HIGH = 3
    URGENT = 4


class TaskStatuses(models.IntegerChoices):
    BACKLOG = 0
    ANALYZE = 1
    DEVELOP = 2
    TEST = 3
    FINISH = 4


class Task(models.Model):
    name = models.CharField(max_length=40, verbose_name='Тапсырма атауы')
    description = models.CharField(
        max_length=500, null=True, blank=True, verbose_name='Тапсырма сипаттамасы')
    start_time = models.DateTimeField(verbose_name='Бастау уақыт')
    due_time = models.DateTimeField(verbose_name='Аяқтау уақыт')
    priority = models.IntegerField(
        choices=TaskPriority.choices, verbose_name='Басымдық')
    status = models.IntegerField(
        choices=TaskStatuses.choices, verbose_name='Күй')
    tags = models.CharField(max_length=520, verbose_name='Тег')
    finish_time = models.DateTimeField(
        null=True, blank=True, default=None, verbose_name='Тапсырма аяқталған уақыт')
    project = models.ForeignKey(
        'project.Project', on_delete=models.CASCADE,
        related_name='tasks', verbose_name='Жоба')
    creator = models.ForeignKey(
        'user.User', on_delete=models.SET_NULL,
        null=True, blank=True, verbose_name='Тапсыпма құрушы')
    worker = models.ForeignKey('user.User', on_delete=models.SET_NULL,
                               related_name='tasks',
                               null=True, blank=True, verbose_name='Жауапты мүше')
    update_time = models.DateTimeField(
        auto_now=True, verbose_name='Жаңартылған уақыт')
    create_time = models.DateTimeField(
        auto_now_add=True, verbose_name='Құрылған уақыт')

    class Meta:
        db_table = 'task'
        verbose_name = 'Тапсырма'
        verbose_name_plural = 'Тапсырмалар'

    def __str__(self):
        return self.name


class TaskAttachement(models.Model):
    task = models.ForeignKey(
        Task, on_delete=models.CASCADE, verbose_name='Тапсырма')
    uploader = models.ForeignKey(
        'user.User', on_delete=models.CASCADE, verbose_name='Жүкеуші')
    file = models.FileField(upload_to='task/attachement/',
                            null=True, verbose_name='Тіркеме')
    create_time = models.DateTimeField(
        auto_now_add=True, verbose_name='Құрылған уақыт')

    class Meta:
        db_table = 'task_attachement'
        verbose_name = 'Тапсырма тіркемесі'
        verbose_name_plural = 'Тапсырма тіркемелері'

    def __str__(self):
        return self.task.name


class TaskComment(models.Model):
    task = models.ForeignKey(
        Task, on_delete=models.CASCADE, verbose_name='Тапсырма')
    user = models.ForeignKey(
        'user.User', on_delete=models.CASCADE, verbose_name='Пайдаланушы')
    content = models.CharField(max_length=520, verbose_name='Пікір')
    create_time = models.DateTimeField(
        auto_now_add=True, verbose_name='Құрылған уақыт')

    class Meta:
        db_table = 'task_comment'
        verbose_name = 'Тапсырма пікірі'
        verbose_name_plural = 'Тапсырма пікірлері'

    def __str__(self):
        return self.task.name
