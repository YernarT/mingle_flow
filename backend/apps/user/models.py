from django.db import models
from django.dispatch import receiver
from django.db.models.signals import pre_save, post_delete, post_init
from django.contrib.auth.hashers import make_password


class User(models.Model):

    username = models.CharField(
        max_length=24, unique=True, verbose_name='Аты-жөн')
    password = models.CharField(max_length=254, verbose_name='Құпия сөз')
    avatar = models.FileField(upload_to='user/avatar/',
                              null=True, blank=True, verbose_name='Аватар')
    create_time = models.DateTimeField(
        auto_now_add=True, verbose_name='Тіркелген уақыт')

    class Meta:
        db_table = 'user'
        verbose_name = 'Пайдаланушы'
        verbose_name_plural = 'Пайдаланушылар'

    def __str__(self):
        return self.username


@receiver(pre_save, sender=User)
def user_pre_save(sender, instance, **kwargs):
    '''Пайдаланушыны сақтамас бұрын құпия сөзді шифрлау'''
    # pbkdf2_sha256$
    if not instance.password.startswith('pbkdf2_sha256$'):
        instance.password = make_password(instance.password)

    '''Пайдаланушыны сақтамас бұрын ескі аватарын жою'''
    try:
        user = sender.objects.get(id=instance.id)
    except sender.DoesNotExist:
        user = False
    
    if user and user.avatar != instance.avatar:
        user.avatar.delete(save=False)


@receiver(post_delete, sender=User)
def user_post_delete(instance, **kwargs):
    '''Пайдаланушыны жойғаннан кейін пайдаланушы аватарын жойу'''
    instance.avatar.delete(save=False)
