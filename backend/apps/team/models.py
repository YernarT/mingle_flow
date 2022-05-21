from django.db import models


class Team(models.Model):

    name = models.CharField(max_length=40, verbose_name='Команда атауы')
    description = models.CharField(
        max_length=254, null=True, blank=True, verbose_name='Команда сипаттамасы')
    creator = models.ForeignKey('user.User', on_delete=models.CASCADE, verbose_name='Құрушы')
    create_time = models.DateTimeField(
        auto_now_add=True, verbose_name='Құрылған уақыт')

    class Meta:
        db_table = 'team'
        verbose_name = 'Команда'
        verbose_name_plural = 'Командалар'

    def __str__(self):
        return self.name


class TeamMember(models.Model):

    team = models.ForeignKey(Team, on_delete=models.CASCADE, verbose_name='Команда')
    member = models.ForeignKey('user.User', on_delete=models.CASCADE, verbose_name='Мүше')
    join_time = models.DateTimeField(
        auto_now_add=True, verbose_name='Қосылған уақыт')

    class Meta:
        db_table = 'team_member'
        verbose_name = 'Мүше'
        verbose_name_plural = 'Мүшелер'

    def __str__(self):
        return self.member.username
