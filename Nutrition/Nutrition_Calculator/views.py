from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, Http404, HttpResponseBadRequest
from django.shortcuts import render
from django.urls import reverse
from django.views.decorators.http import require_POST
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

from .models import User, Food, Category, Ingredient

import json
import datetime
import calendar


# Create your views here.
def main(request):
    date = datetime.datetime.today()
    return render(request, "main.html", {"date": date})


def gender(request):
    if request.user.is_authenticated:
        if request.user.gender:
            return JsonResponse({"gender": "women"}, safe = False)
        else:
            return JsonResponse({"gender": "men"}, safe = False)


def ingredient_list(request, meal):
    user = User.objects.get(id = request.user.id)
    if meal == "Breakfast":
        li = Ingredient.objects.all().filter(
            user = user,
            input_date = datetime.datetime.today(),
            breakfast = True
        )
    elif meal == "Lunch":
        li = Ingredient.objects.all().filter(
            user = user,
            input_date = datetime.datetime.today(),
            lunch = True
        )
    else:
        li = Ingredient.objects.all().filter(
            user = user,
            input_date = datetime.datetime.today(),
            dinner = True
        )

    return JsonResponse({
        "ingredient_list": [l.serialize() for l in li]
    })

def search(request):
    name = json.loads(request.body).get("name", "").upper()
    foods = Food.objects.all().filter(category__category__contains = name)
    food_list = []
    for food in foods:
        if food.category.category.startswith(name):
            food_list.append(food.serialize())
    return JsonResponse({"foods": food_list})

def register_food(request):
    if request.method == "POST":
        food = Food()
        food.category = Category.objects.get(id = int(request.POST["category-id"]))
        food.kilocalories = request.POST["kilocalories"]
        food.description = request.POST["description"]
        food.carbohydrate = request.POST["carbohydrate"]
        food.cholesterol = request.POST["cholesterol"]
        food.fiber = request.POST["fiber"]
        food.protein = request.POST["protein"]
        food.fat = request.POST["fat"]
        food.calcium = request.POST["calcium"]
        food.copper = request.POST["copper"]
        food.iron = request.POST["iron"]
        food.magnesium = request.POST["magnesium"]
        food.manganese = request.POST["manganese"]
        food.phosphorus = request.POST["phosphorus"]
        food.potassium = request.POST["potassium"]
        food.sodium = request.POST["sodium"]
        food.zinc = request.POST["zinc"]
        food.vitaminA_IU = request.POST["vitaminA_IU"]
        food.vitaminA_RAE = request.POST["vitaminA_RAE"]
        food.vitaminB12 = request.POST["vitaminB12"]
        food.vitaminB6 = request.POST["vitaminB6"]
        food.vitaminC = request.POST["vitaminC"]
        food.vitaminE = request.POST["vitaminE"]
        food.vitaminK = request.POST["vitaminK"]
        food.save()
        return HttpResponseRedirect(reverse("main"))
    else:
        return render(request, "food.html")

def register_category(request):
    if request.method == "POST":
        categories = Category.objects.all()
        name = json.loads(request.body).get("name", "").upper()
        category_list = []
        for category in categories:
            if category.category.startswith(name):
                category_list.append(category.serialize())
        return JsonResponse({"categories": category_list})
    else:
        categories = Category.objects.all()
        category_list = []
        for category in categories:
            category_list.append(category.serialize())
        return JsonResponse({"categories": category_list})
        

def add_food(request):
    ingredient_form = json.loads(request.body)
    food_id = ingredient_form.get("food", "")
    food = Food.objects.get(id = food_id)
    quantity = ingredient_form.get("quantity", "")
    date = ingredient_form.get("date", "")
    meal = ingredient_form.get("meal", "")

    ingredient = Ingredient()
    ingredient.user = User.objects.get(id = request.user.id)
    ingredient.food = food
    ingredient.quantity = quantity
    if date:
        ingredient.input_date = date
    else:
        ingredient.input_date = datetime.datetime.today()
    if meal == "Breakfast":
        ingredient.breakfast = True
        ingredient.lunch = False
        ingredient.dinner = False
    elif meal == "Lunch":
        ingredient.breakfast = False
        ingredient.lunch = True
        ingredient.dinner = False
    elif meal == "Dinner":
        ingredient.breakfast = False
        ingredient.lunch = False
        ingredient.dinner = True
    ingredient.save()

    
    return JsonResponse({"message": "Added successfully."}, status=201)

def calculate(request):
    user = User.objects.get(id = request.user.id)
    ingredients = Ingredient.objects.all().filter(user = user, input_date = datetime.datetime.today())
    nutrition = {}
    for ingredient in ingredients:
       for key, value in ingredient.food.value_dict().items():
            if key in nutrition:
                nutrition[key] += value * ingredient.quantity / 100
            else:
                nutrition[key] = value * ingredient.quantity / 100
    return JsonResponse({"nutrition": nutrition}, safe = False)

def history(request, date):
    user = User.objects.get(id = request.user.id)
    d = datetime.datetime.strptime(date, "%Y-%m-%d").date()
    ingredients = Ingredient.objects.all().filter(user = user, input_date = d)
    nutrition = {}
    for ingredient in ingredients:
       for key, value in ingredient.food.value_dict().items():
            if key in nutrition:
                nutrition[key] += value * ingredient.quantity / 100
            else:
                nutrition[key] = value * ingredient.quantity / 100
    if ingredients:
        return JsonResponse({"nutrition": nutrition, "condition": True}, safe = False)
    else:
        return JsonResponse({"nutrition": nutrition, "condition": False}, safe = False)

def graph(request, year, month, value):
    user = User.objects.get(id = request.user.id)
    ingredients = Ingredient.objects.all().filter(user = user, input_date__month = month + 1)
    last_day = calendar.monthrange(year, month)[1]
    x_dict = {value: []}
    y_dict = {month: [d for d in range(1, last_day + 1)]}   
    for i in range(1, last_day + 1):
        total = 0
        for ingredient in ingredients:
            if ingredient.input_date.day == i:
                total += ingredient.food.value_dict()[value] * ingredient.quantity / 100
        x_dict[value].append(total)
    return JsonResponse({"x_dict": x_dict, "y_dict": y_dict}, safe = False)


def login_view(request):
    if request.method == "POST":
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username = username, password = password)

        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("main"))
        else:
            return render(request, "login.html", {"message": "Invalid username and/or password"})
    
    else:
        return render(request, "login.html")
    
def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("login"))

def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]
        

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "register.html", {
                "message": "Passwords must match."
            })
        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            if request.POST["gender"] == "female":
                user.gender = 1
            else:
                user.gender = 0
            user.save()
        except IntegrityError:
            return render(request, "register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("main"))
    else:
        return render(request, "register.html")
