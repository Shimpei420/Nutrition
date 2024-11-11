from django.urls import path
from . import views

urlpatterns = [
    path("", views.main, name = "main"),
    path("login", views.login_view, name = "login"),
    path("logout", views.logout_view, name = "logout"),
    path("register", views.register, name = "register"),
    path("gender", views.gender, name = "gender"),
    path("search", views.search, name = "search"),
    path("register_food", views.register_food, name = "register_food"),
    path("register_category", views.register_category, name = "register_category"),
    path("add_food", views.add_food, name = "add_food"),
    path("ingredient_list/<str:meal>", views.ingredient_list, name = "ingredient_list"),
    path("calculate", views.calculate, name = "calculate"),
    path("history/<str:date>", views.history, name = "history"),
    path("graph/<int:year>/<int:month>/<str:value>", views.graph, name = "graph")
]