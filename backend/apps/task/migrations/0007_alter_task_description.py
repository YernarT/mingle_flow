# Generated by Django 3.2.8 on 2022-05-21 13:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('task', '0006_taskresult_submitted_time'),
    ]

    operations = [
        migrations.AlterField(
            model_name='task',
            name='description',
            field=models.CharField(blank=True, max_length=254, null=True, verbose_name='Тапсырма сипаттамасы'),
        ),
    ]
