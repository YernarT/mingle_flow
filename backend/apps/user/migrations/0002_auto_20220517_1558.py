# Generated by Django 3.2.8 on 2022-05-17 09:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='password',
            field=models.CharField(max_length=254, verbose_name='Құпия сөз'),
        ),
        migrations.AlterField(
            model_name='user',
            name='username',
            field=models.CharField(max_length=24, verbose_name='Аты-жөн'),
        ),
    ]
