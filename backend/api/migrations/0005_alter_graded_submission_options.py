# Generated by Django 5.0.6 on 2024-06-18 08:01

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_remove_graded_submission_task_id_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='graded_submission',
            options={'verbose_name': 'Graded Submission', 'verbose_name_plural': 'Graded Submissions'},
        ),
    ]
