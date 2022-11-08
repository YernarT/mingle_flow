# Generated by Django 3.2.8 on 2022-11-08 03:11

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('user', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Project',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=40, verbose_name='Жоба атауы')),
                ('description', models.CharField(blank=True, max_length=254, null=True, verbose_name='Жоба сипаттамасы')),
                ('create_time', models.DateTimeField(auto_now_add=True, verbose_name='Құрылған уақыт')),
                ('creator', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='user.user', verbose_name='Құрушы')),
            ],
            options={
                'verbose_name': 'Жоба',
                'verbose_name_plural': 'Жобалар',
                'db_table': 'project',
            },
        ),
        migrations.CreateModel(
            name='Contributor',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('join_time', models.DateTimeField(auto_now_add=True, verbose_name='Қосылған уақыт')),
                ('project', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='project.project', verbose_name='Жоба')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='user.user', verbose_name='Мүше')),
            ],
            options={
                'verbose_name': 'Мүше',
                'verbose_name_plural': 'Мүшелер',
                'db_table': 'contributor',
            },
        ),
    ]