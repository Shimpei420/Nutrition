from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.
class User(AbstractUser):
    gender = models.BooleanField(default = 0)
    

class Category(models.Model):
    category = models.CharField(max_length = 50)

    def serialize(self):
        return {
            "id": self.id,
            "category":self.category
        }

class Food(models.Model):
    category = models.ForeignKey(Category, on_delete = models.SET_DEFAULT, default = "N/A")
    description = models.CharField(max_length = 100)
    carbohydrate = models.FloatField(default = 0)
    cholesterol = models.FloatField(default = 0)	
    fiber = models.FloatField(default = 0)
    kilocalories = models.FloatField(default = 0)	
    protein	= models.FloatField(default = 0)
    fat	= models.FloatField(default = 0)
    calcium	= models.FloatField(default = 0)
    copper	= models.FloatField(default = 0)
    iron = models.FloatField(default = 0)
    magnesium = models.FloatField(default = 0)
    manganese = models.FloatField(default = 0)
    phosphorus = models.FloatField(default = 0)
    potassium = models.FloatField(default = 0)
    sodium = models.FloatField(default = 0)
    zinc = models.FloatField(default = 0)
    vitaminA_IU = models.FloatField(default = 0)
    vitaminA_RAE = models.FloatField(default = 0)
    vitaminB12 = models.FloatField(default = 0)
    vitaminB6 = models.FloatField(default = 0)
    vitaminC = models.FloatField(default = 0)
    vitaminE = models.FloatField(default = 0)
    vitaminK = models.FloatField(default = 0)

    def serialize(self):
        return {
            "id":self.id,
            "category":self.category.category,
            "description": self.description
        }
    
    def value_dict(self):
        return {
            "carbohydrate": self.carbohydrate,
            "cholesterol": self.cholesterol,
            "fiber": self.fiber,
            "kilocalories": self.kilocalories,
            "protein": self.protein,
            "fat": self.fat,
            "calcium": self.calcium,
            "copper": self.copper,
            "iron": self.iron,
            "magnesium": self.magnesium,
            "manganese": self.manganese,
            "phosphorus": self.phosphorus,
            "potassium": self.potassium,
            "sodium": self.sodium,
            "zinc": self.zinc,
            "vitaminA-IU": self.vitaminA_IU,
            "vitaminA-RAE": self.vitaminA_RAE,
            "vitaminB12": self.vitaminB12,
            "vitaminB6": self.vitaminB6,
            "vitaminC": self.vitaminC,
            "vitaminE": self.vitaminE,
            "vitaminK": self.vitaminK
        }
    
class Ingredient(models.Model):
    user = models.ForeignKey(User, on_delete = models.CASCADE)
    input_date = models.DateField()
    breakfast = models.BooleanField(default = True)
    lunch = models.BooleanField(default = False)
    dinner = models.BooleanField(default = False)
    food = models.ForeignKey(Food, on_delete = models.CASCADE)
    quantity = models.IntegerField(default = 0)

    def serialize(self):
        return {
            "id": self.id,
            "food": self.food.description,
            "quantity": self.quantity
        }
    
    def show_date(self):
        return {
            "year":self.input_date.year,
            "month": self.input_date.month,
            "day": self.input_date.day
        }
