# Generated by Django 3.2.8 on 2022-05-17 08:55

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('username', models.CharField(max_length=60, verbose_name='Аты-жөн')),
                ('password', models.CharField(max_length=60, verbose_name='Құпия сөз')),
                ('avatar', models.FileField(blank=True, null=True, upload_to='user/avatar/', verbose_name='Аватар')),
                ('create_time', models.DateTimeField(auto_now_add=True, verbose_name='Тіркелген уақыт')),
            ],
            options={
                'verbose_name': 'Пайдаланушы',
                'verbose_name_plural': 'Пайдаланушылар',
                'db_table': 'user',
            },
        ),
    ]
