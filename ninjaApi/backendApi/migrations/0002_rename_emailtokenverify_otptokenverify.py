# Generated by Django 5.0.7 on 2024-07-18 21:17

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('backendApi', '0001_initial'),
        ('user', '0001_initial'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='EmailTokenVerify',
            new_name='OtpTokenVerify',
        ),
    ]
