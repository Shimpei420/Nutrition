# Generated by Django 4.1 on 2024-04-03 13:16

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('Nutrition_Calculator', '0005_rename_morning_ingredient_breakfast_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='ingredient',
            old_name='date',
            new_name='input_date',
        ),
    ]
