# Generated by Django 5.0.6 on 2024-06-20 04:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_graded_submission_task_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='task',
            name='file_name',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='task',
            name='file_upload',
            field=models.FileField(blank=True, null=True, upload_to='tasks_files/'),
        ),
    ]
