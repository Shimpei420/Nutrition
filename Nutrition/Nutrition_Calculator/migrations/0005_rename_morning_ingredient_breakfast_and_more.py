# Generated by Django 4.1 on 2024-04-03 02:14

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('Nutrition_Calculator', '0004_ingredient_lunch_ingredient_morning_ingredient_night'),
    ]

    operations = [
        migrations.RenameField(
            model_name='ingredient',
            old_name='morning',
            new_name='breakfast',
        ),
        migrations.RenameField(
            model_name='ingredient',
            old_name='night',
            new_name='dinner',
        ),
    ]
