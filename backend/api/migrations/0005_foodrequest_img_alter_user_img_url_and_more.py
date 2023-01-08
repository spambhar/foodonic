# Generated by Django 4.1 on 2022-09-30 06:36

from django.db import migrations, models
import tkinter.tix


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_alter_user_password'),
    ]

    operations = [
        migrations.AddField(
            model_name='foodrequest',
            name='img',
            field=models.ImageField(blank=True, null=tkinter.tix.Tree, upload_to='food_request_images'),
            preserve_default=tkinter.tix.Tree,
        ),
        migrations.AlterField(
            model_name='user',
            name='img_url',
            field=models.ImageField(blank=True, null=True, upload_to='user_images'),
        ),
        migrations.AlterField(
            model_name='user',
            name='verification_status',
            field=models.CharField(choices=[('none', 'none'), ('details_filled', 'details_filled'), ('otp_verified', 'otp_verified'), ('admin_verified', 'admin_verified')], default='none', max_length=255),
        ),
    ]