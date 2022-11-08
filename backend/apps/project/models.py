from django.db import models


class Project(models.Model):

    name = models.CharField(max_length=40, verbose_name='Жоба атауы')
    description = models.CharField(
        max_length=254, null=True, blank=True, verbose_name='Жоба сипаттамасы')
    creator = models.ForeignKey('user.User', on_delete=models.CASCADE, verbose_name='Құрушы')
    create_time = models.DateTimeField(
        auto_now_add=True, verbose_name='Құрылған уақыт')

    class Meta:
        db_table = 'project'
        verbose_name = 'Жоба'
        verbose_name_plural = 'Жобалар'

    def __str__(self):
        return self.name


class Contributor(models.Model):

    project = models.ForeignKey(Project, on_delete=models.CASCADE, verbose_name='Жоба')
    user = models.ForeignKey('user.User', on_delete=models.CASCADE, verbose_name='Мүше')
    join_time = models.DateTimeField(
        auto_now_add=True, verbose_name='Қосылған уақыт')

    class Meta:
        db_table = 'contributor'
        verbose_name = 'Мүше'
        verbose_name_plural = 'Мүшелер'

    def __str__(self):
        return self.user.username
