document.addEventListener("DOMContentLoaded", () => {

    const date = new Date();
    const today = date.getDate();
    const currentMonth = date.getMonth();
    const year = date.getFullYear()
    const month_list = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
                        'August', 'September', 'October', 'November', 'December']


    let suggest = document.getElementById("food-suggest").style.display = "none";

    let food_name = document.getElementById("food-input");
    let ul = document.getElementById("food-suggest-list");
    
    let select1 = document.getElementById("meal-type-selection")
    let select2 = document.getElementById("summary-select")

    gender()
    calculate()

    if (sessionStorage.getItem("meal_type")) {
        if (sessionStorage.getItem("meal_type") === "Breakfast") {
            select1.options[0].selected = true;
        } else if (sessionStorage.getItem("meal_type") === "Lunch") {
            select1.options[1].selected = true;
        } else if (sessionStorage.getItem("meal_type") === "Dinner") {
            select1.options[2].selected = true;
        }
    }

    if (sessionStorage.getItem("summary_type")) {
        if (sessionStorage.getItem("summary_type") === "Breakfast") {
            select2.options[1].selected = true;
            ingredient_list(sessionStorage.getItem("summary_type"));
        } else if (sessionStorage.getItem("summary_type") === "Lunch") {
            select2.options[2].selected = true;
            ingredient_list(sessionStorage.getItem("summary_type"));
        } else if (sessionStorage.getItem("summary_type") === "Dinner") {
            select2.options[3].selected = true;
            ingredient_list(sessionStorage.getItem("summary_type"));
        }
    }

    //Suggestion
    food_name.onclick = function(){
        food_name.innerHTML = ""
        document.getElementById("food-input").value = ""
    }

    food_name.addEventListener("keyup", () => {
        const csrftoken = getCookie('csrftoken');

        if (food_name.value === "") {
            document.getElementById("food-suggest").style.display = "none";
        } else {
            document.getElementById("food-suggest").style.display = "block";
            fetch("/search", {
                method: "POST",
                headers: {'X-CSRFToken': csrftoken},
                mode: 'same-origin',
                body: JSON.stringify({
                    name: food_name.value
                })
            })
            .then(response => response.json())
            .then(result => {
                foods = result["foods"]
                ul.innerHTML = ""
                foods.forEach((food) => {
                    id = food.id
                    category = food.category
                    description = food.description
                    let li = document.createElement("li")
                    li.innerHTML = `${category}: ${description}`
                    li.id = `food-id-${id}`
                    ul.append(li)

                    li.onclick = function() {
                        let input = document.getElementById("food-input");
                        input.value = li.innerHTML
                        document.getElementById("food-suggest").style.display = "none";

                        let id_input = document.getElementById("food-id");
                        id_input.value = Number(li.id.replace("food-id-", ""))
                    }
                })
            })
        }
    })
            
    
    //Add Ingredients
    let add_button = document.getElementById("add-button");
    add_button.onclick = function() {
        add_ingredient();
        input.innerHTML = ""
    }

    //Summary
    let selection = document.getElementById("summary-select");
    selection.addEventListener("change", function() {
        ingredient_list(selection.value);
    })

    //Calendar
    if (window.performance.navigation.type === 1) {
        sessionStorage.removeItem("month");
        sessionStorage.removeItem("year");
    }

    if (sessionStorage.getItem("month")){
        let month = sessionStorage.getItem("month");
        let y = sessionStorage.getItem("year")
        document.getElementById("calendar-box").innerHTML = calender(month, y);
        document.getElementById("month-english").innerHTML = `${month_list[month]} ${y}`
    } else {
        document.getElementById("calendar-box").innerHTML = calender(currentMonth, date.getFullYear());
        document.getElementById("month-english").innerHTML = `${month_list[currentMonth]} ${year}`
    }

    let tdlist = document.getElementsByTagName("td")
    for (var i = 0; i < tdlist.length; i++) {
        tdlist[i].onclick = function() {
            history(this.id)
        }
    }
    

    let previous_month = document.getElementById("previous-month");
    previous_month.onclick = function() {
        if (sessionStorage.getItem("month")){
            let current = parseInt(sessionStorage.getItem("month"))
            let temp_year = parseInt(sessionStorage.getItem("year"))
            if (current - 1 >= 0) {
                sessionStorage.setItem("month", current - 1)
                sessionStorage.setItem("year", temp_year)
            } else {
                sessionStorage.setItem("month", 11)
                sessionStorage.setItem("year", temp_year - 1)
            }   
        } else {
            if (currentMonth - 1 >= 0) {
                sessionStorage.setItem("month", currentMonth - 1);
                sessionStorage.setItem("year", year)
            } else {
                sessionStorage.setItem("month", 11)
                let temp_year = sessionStorage.getItem("year")
                sessionStorage.setItem("year", temp_year - 1)
            }
        }
        let month = parseInt(sessionStorage.getItem("month"));
        let y = parseInt(sessionStorage.getItem("year"));
        document.getElementById("calendar-box").innerHTML = calender(month, y);
        document.getElementById("month-english").innerHTML = `${month_list[month]} ${y}`

        let tdlist = document.getElementsByTagName("td")
        for (var i = 0; i < tdlist.length; i++) {
            tdlist[i].onclick = function() {
                history(this.id)
            }
        }
    }

    let next_month = document.getElementById("next-month");
    next_month.onclick = function() {
        if (sessionStorage.getItem("month")){
            let current2 = parseInt(sessionStorage.getItem("month"));
            let temp_year2 = parseInt(sessionStorage.getItem("year"));
            if (current2 + 1 <= 11) {
                sessionStorage.setItem("month", current2 + 1)
                sessionStorage.setItem("year", temp_year2)
            } else {
                sessionStorage.setItem("month", 0)
                sessionStorage.setItem("year", temp_year2 + 1)
            }   
        } else {
            if (currentMonth + 1 <= 11) {
                sessionStorage.setItem("month", currentMonth + 1);
                sessionStorage.setItem("year", year)
            } else {
                sessionStorage.setItem("month", 0)
                let temp_year2 = sessionStorage.getItem("year")
                sessionStorage.setItem("year", temp_year2 + 1)
            }
        }
        let month = parseInt(sessionStorage.getItem("month"));
        let y = parseInt(sessionStorage.getItem("year"));
        document.getElementById("calendar-box").innerHTML = calender(month, y);
        document.getElementById("month-english").innerHTML = `${month_list[month]} ${y}`

        let tdlist = document.getElementsByTagName("td")
        for (var i = 0; i < tdlist.length; i++) {
            tdlist[i].onclick = function() {
                history(this.id)
            }
        }
    }

    /* Graph */
    document.getElementById("search-no-result").style.display = "block";
    document.getElementById("search-nutrition-table").style.display = "none";

    document.getElementById("graph-button").onclick = function() {
        let graphValue = document.getElementById("graph-value").value;
        if (graphValue.startsWith("Vitamin")){
            graphValue = graphValue.replace("V", "v").replace(" ", "").replace("_", "-")
        } else {
            graphValue = graphValue.toLowerCase()
        }
        let graphYear;
        let graphMonth;
        if (sessionStorage.getItem("month")) {
            graphMonth = sessionStorage.getItem("month")
            graphYear = sessionStorage.getItem("year")
        } else {
            graphYear = date.getFullYear()
            graphMonth = currentMonth
        }

        let unit = document.getElementById("unit-label")
        unit.innerHTML = ""
        if (graphValue === "kilocalories") {
            unit.innerHTML = "Unit: kcal"
        } else if (graphValue === "carbohydrate" || graphValue === "fiber" || graphValue === "protein" || graphValue === "fat") {
            unit.innerHTML = "Unit: g"
        } else if (graphValue === "vitaminA-RAE" || graphValue === "vitaminB12" || graphValue === "vitaminB6" || graphValue === "vitaminK"){
            unit.innerHTML = "Unit: mcg"
        } else if (graphValue === "vitaminA-IU") {
            unit.innerHTML = "Unit: IU"
        } else {
            unit.innerHTML = "Unit: mg"
        }

        graph(graphYear, graphMonth, graphValue)
        let canvas = document.getElementById("chart")
        canvas.attr = ("width", container.width())
        canvas.attr = ("height", container.height()) 
    }

})

function gender(){
    fetch("/gender")
    .then(response => response.json())
    .then(result => {
        if (result["gender"] === "women") {
            
            let tr = document.getElementById("women-row")
            tr.style.backgroundColor = "#FFFF99"
        } else {
            let tr = document.getElementById("men-row")
            tr.style.backgroundColor = "#FFFF99"
        }
    })
}


function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function add_ingredient() {
    food_id = document.getElementById("food-id").value;
    food_value = document.getElementById("food-input").value;
    quantity_value = document.getElementById("food-quantity").value;
    meal_type = document.getElementById("meal-type-selection").value;
    input_date = document.getElementById("date-input").value;


    const csrftoken = getCookie('csrftoken');

    fetch("/add_food", {
        method: "POST",
        headers: {'X-CSRFToken': csrftoken},
        mode: 'same-origin',
        body: JSON.stringify({
            food: food_id,
            quantity: quantity_value,
            date: input_date,
            meal: meal_type
        })
    })
    .then(response => response.json())
    .then(result => {console.log(result)})

    sessionStorage.setItem("meal_type", meal_type)
    sessionStorage.setItem("summary_type", meal_type)

}

function ingredient_list(meal_type) {
    let ul = document.getElementById("added-food-list");
    ul.innerHTML = ""

    fetch(`ingredient_list/${meal_type}`)
    .then(response => response.json())
    .then(result => {
        ingredients = result["ingredient_list"];
        let ul = document.getElementById("added-food-list");
        
        ingredients.forEach((ingredient) => {
            let li = document.createElement("li");
            li.innerHTML = `${ingredient.food} : ${ingredient.quantity} g`
            ul.append(li)
        })
    })
}

function calculate() {
    fetch("/calculate")
    .then(response => response.json())
    .then(result => {
        nutrition = result["nutrition"];
        for (let element in nutrition) {
            let value = nutrition[element];
            if (element === "kilocalories") {
                let p = document.getElementById("kilocalories");
                p.innerHTML = `Kilocalories: ${value.toFixed(2)} kcal`
            } else {
                let td = document.getElementById(`${element}-value`)
                td.innerHTML = value.toFixed(2)
            }
            
        }
    })
}


function calender(month, year) {

    const date = new Date();
    const today = date.getDate();
    const currentMonth = date.getMonth();
    const day = date.getDay()
    
    const monthDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    let calendarHTML = '<table class="calendar"><thead><tr>';

    for (let i = 0; i < 7; i++) {
        if (i === 0) {
            calendarHTML += `<th class="sun">${monthDays[i]}</th>`;
        } else if (i === 6) {
            calendarHTML += `<th class="sat">${monthDays[i]}</th>`;
        } else {
            calendarHTML += `<th>${monthDays[i]}</th>`;
        }
    }

    calendarHTML += '</tr></thead><tbody>';

    const daysInMonth = new Date(date.getFullYear(), month + 1, 0).getDate();
    const firstDay = new Date(date.getFullYear(), month, 1).getDay();

    const daysInPrevMonth = new Date(date.getFullYear(), month, 0).getDate();

    let dayCount = 1;
    let prevDayCount = daysInPrevMonth - firstDay + 1;

    for (let i = 0; i < 6; i++) {
        calendarHTML += '<tr>';

        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < firstDay) {
                calendarHTML += `<td class="mute">${prevDayCount}</td>`;
                prevDayCount++;
            } else if (dayCount > daysInMonth) {
                    let nextMonthDayCount = dayCount - daysInMonth;
                    calendarHTML += `<td class="mute">${nextMonthDayCount}</td>`;
                    dayCount++;

            } else {
                if (dayCount === today && month === currentMonth) {
                    calendarHTML += `<td class="today" id = "${year}-${month}-${day}">${dayCount}</td>`;
                } else {
                    calendarHTML += `<td id = "${year}-${parseInt(month) + 1}-${dayCount}">${dayCount}</td>`;
                }
                dayCount++;
            }
        }

        calendarHTML += '</tr>';

        if (dayCount > daysInMonth) {
            break;
        }
    }

    calendarHTML += '</tbody></table>';

    return calendarHTML;
}

function history(date){
    fetch(`/history/${date}`)
    .then(response => response.json())
    .then(result => {
        if (result["condition"] === false) {
            document.getElementById("search-no-result").style.display = "block";
            document.getElementById("search-nutrition-table").style.display = "none";
        } else {
            document.getElementById("search-no-result").style.display = "none";
            document.getElementById("search-nutrition-table").style.display = "block";

            nutrition = result["nutrition"]
            for (let element in nutrition) {
                let value = nutrition[element];
                if (element === "kilocalories") {
                    let td = document.getElementById("search-kilocalories-value");
                    td.innerHTML = `${value.toFixed(2)} kcal`
                } else {
                    let td = document.getElementById(`search-${element}-value`)
                    td.innerHTML = value.toFixed(2)
                }
                
            }
        }
        
    })
}

function graph(year, month, value){
    fetch(`/graph/${year}/${month}/${value}`)
    .then(response => response.json())
    .then(result => {
        const month_list = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
                        'August', 'September', 'October', 'November', 'December']
        

        let ctx = document.getElementById("chart").getContext("2d");
        let month_in_english = month_list[month]

        if (typeof myChart !== 'undefined' && myChart) {
            myChart.destroy();
          }

        window.myChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: result["y_dict"][month],
            datasets: [
                {
                label: `${value} in ${month_in_english}, ${year}`,
                backgroundColor: "#79AEC8",
                borderColor: "#417690",
                data: result["x_dict"][value]
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            title: {
                text: "Gross Volume in 2020",
                display: true,
            }
        }
        })

        
    })
    
}

