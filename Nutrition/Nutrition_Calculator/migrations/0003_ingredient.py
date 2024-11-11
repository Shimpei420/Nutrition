# Generated by Django 4.1 on 2024-04-02 12:27

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('Nutrition_Calculator', '0002_rename_name_category_category'),
    ]

    operations = [
        migrations.CreateModel(
            name='Ingredient',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateTimeField(auto_now_add=True)),
                ('quantity', models.IntegerField(default=0)),
                ('food', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Nutrition_Calculator.food')),
            ],
        ),
    ]
