from django.db import models
from task.models import Task, TaskStatuses


class ProjectStatuses(models.IntegerChoices):
    PLANNING = 0
    IN_PROGRESS = 1
    PAUSED = 2
    FINISHED = 3


class Project(models.Model):
    name = models.CharField(max_length=40, verbose_name='Жоба атауы')
    description = models.CharField(
        max_length=500, null=True, blank=True, verbose_name='Жоба сипаттамасы')
    status = models.IntegerField(
        choices=ProjectStatuses.choices, default=ProjectStatuses.PLANNING)
    creator = models.ForeignKey(
        'user.User', on_delete=models.CASCADE, verbose_name='Құрушы')
    create_time = models.DateTimeField(
        auto_now_add=True, verbose_name='Құрылған уақыт')

    class Meta:
        db_table = 'project'
        verbose_name = 'Жоба'
        verbose_name_plural = 'Жобалар'

    def __str__(self):
        return self.name

    def get_progress(self, task_list=None):
        '''
        获取项目的完成度
        '''
        if self.status == ProjectStatuses.FINISHED:
            return 100

        if task_list == None:
            task_list = Task.objects.filter(project=self)
        
        task_count = task_list.count()
        
        if task_count == 0:
            return 0

        progress = 0
        task_weights = 100 / task_count

        for task in task_list:
            if task.status == TaskStatuses.BACKLOG:
                progress += 1
            elif task.status == TaskStatuses.TEST:
                progress += task_weights * 0.75
            elif task.status == TaskStatuses.DEVELOP:
                progress += task_weights * 0.5
            elif task.status == TaskStatuses.ANALYZE:
                progress += task_weights * 0.25
            else:
                progress += 0
        
        return progress



class Contributor(models.Model):
    project = models.ForeignKey(
        Project, on_delete=models.CASCADE, verbose_name='Жоба')
    user = models.ForeignKey(
        'user.User', on_delete=models.CASCADE, verbose_name='Мүше')
    can_modify_task = models.BooleanField(
        default=False, verbose_name='Тапсырма құруға/өзгертуге болады')
    join_time = models.DateTimeField(
        auto_now_add=True, verbose_name='Қосылған уақыт')

    class Meta:
        db_table = 'contributor'
        verbose_name = 'Мүше'
        verbose_name_plural = 'Мүшелер'

    def __str__(self):
        return self.user.fullname
