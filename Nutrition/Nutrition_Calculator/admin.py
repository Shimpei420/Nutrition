from django.contrib import admin
from .models import Category, Food, Ingredient, User
from import_export import resources
from import_export.admin import ImportExportModelAdmin
from import_export.fields import Field 
from import_export.widgets import ForeignKeyWidget

# Register your models here.
class CategoryResource(resources.ModelResource):
    id = Field(attribute='id', column_name='category_id')
    category = Field(attribute = "category", column_name = "category")

    class Meta:
        model = Category
        skip_unchanged = True
        use_bulk = True

class  FoodResource(resources.ModelResource):
    id = Field(attribute = "id", column_name = "food_id")
    category = Field(attribute = "category", column_name = "Category", widget = ForeignKeyWidget(Category, "category"))
    description = Field(attribute = "description", column_name = "Description")
    carbohydrate = Field(attribute = "carbohydrate", column_name = "Carbohydrate")
    cholesterol = Field(attribute = "cholesterol", column_name = "Cholesterol")
    fiber = Field(attribute = "fiber", column_name = "Fiber")
    kilocalories = Field(attribute = "kilocalories", column_name = "Kilocalories")
    protein	= Field(attribute = "protein", column_name = "Protein")
    fat	= Field(attribute = "fat", column_name = "Fat")
    calcium	= Field(attribute = "calcium", column_name = "Calcium")
    copper	= Field(attribute = "copper", column_name = "Copper")
    iron = Field(attribute = "iron", column_name = "Iron")
    magnesium = Field(attribute = "magnesium", column_name = "Magnesium")
    manganese = Field(attribute = "Manganese", column_name = "Manganese")
    phosphorus = Field(attribute = "phosphorus", column_name = "Phosphorus")
    potassium = Field(attribute = "potassium", column_name = "Potassium")
    sodium = Field(attribute = "sodium", column_name = "Sodium")
    zinc = Field(attribute = "zinc", column_name = "Zinc")
    vitaminA_IU = Field(attribute = "vitaminA_IU", column_name = "Vitamin A - IU")
    vitaminA_RAE = Field(attribute = "vitaminA_RAE", column_name = "Vitamin A - RAE")
    vitaminB12 = Field(attribute = "vitaminB12", column_name = "Vitamin B12")
    vitaminB6 = Field(attribute = "vitaminB6", column_name = "Vitamin B6")
    vitaminC = Field(attribute = "vitaminC", column_name = "Vitamin C")
    vitaminE = Field(attribute = "vitaminE", column_name = "Vitamin E")
    vitaminK = Field(attribute = "vitaminK", column_name = "Vitamin K")
    
    class Meta:
        model = Food
        skip_unchanged = True
        use_bulk = True

@admin.register(Category)
class CategoryAdmin(ImportExportModelAdmin):
    ordering = ["id"]
    list_display = ("id", "category")
    resource_class = CategoryResource

@admin.register(Food)
class FoodAdmin(ImportExportModelAdmin):
    ordering = ["id"]
    list_display = ("id", "category", "description", "carbohydrate", "cholesterol", "fiber", "kilocalories", "protein", "fat", "calcium", 
                    "copper", "iron", "magnesium", "manganese", "phosphorus", "potassium", "sodium", "zinc", "vitaminA_IU", "vitaminA_RAE",
                    "vitaminB12", "vitaminB6", "vitaminC", "vitaminE", "vitaminK")
    resource_class = FoodResource

admin.site.register(Ingredient)
admin.site.register(User)
