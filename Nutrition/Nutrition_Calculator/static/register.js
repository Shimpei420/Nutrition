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

function category_suggest(input) {
    const csrftoken = getCookie('csrftoken')
    let select = document.getElementById("category-selection");
    let body = document.getElementById("main-form");
    let modal = document.getElementById("modal-box");
    let categoryId = document.getElementById("category-selection-id")

    fetch("/register_category", {
        method: "POST",
        headers: {'X-CSRFToken': csrftoken},
        mode: 'same-origin',
        body: JSON.stringify({
            name: input
        })
    })
    .then(response => response.json())
    .then(result => {
        let ul = document.getElementById("category-list");
        ul.innerHTML = ""
        let categories = result["categories"];
        categories.forEach((category) => {
            let li = document.createElement("li")
            li.innerHTML = category.category;
            ul.append(li)

            li.addEventListener("click", () => {
                select.value = li.innerHTML;
                categoryId.value = category.id
                modal.style.display = "none"
                body.className = ""
                
            })
       })
    })
    ul.innerHTML = ""
}

function category_list() {
    let select = document.getElementById("category-selection");
    let body = document.getElementById("main-form");
    let modal = document.getElementById("modal-box");
    let categoryId = document.getElementById("category-selection-id")


    fetch("/register_category")
    .then(response => response.json())
    .then(results => {
        let ul = document.getElementById("category-list")
        ul.innerHTML = ""

        let categories = results["categories"]
        categories.forEach((category) => {
            let li = document.createElement("li");
            li.innerHTML = category.category;
            ul.append(li)

            li.addEventListener("click", () => {
                select.value = li.innerHTML;
                categoryId.value = category.id

                modal.style.display = "none"
                body.className = ""
                
            })

        })
    })

}

document.addEventListener("DOMContentLoaded", () => {
    let body = document.getElementById("main-form");
    let modal = document.getElementById("modal-box");
    let close = document.getElementById("modal-close");
    let category = document.getElementById("category-selection");
    let input = document.getElementById("modal-input");
    let register = document.getElementById("register-button")

    category.onclick = function(){
        body.className = "overlay"
        modal.style.display = "block"
        category.value = ""
        input.value = ""
        category_list()
        
        input.addEventListener("keyup", () => {
            let ul = document.getElementById("category-list");
            document.getElementById("category-list").innerHTML = ""
            category_suggest(input.value)
           
        })
    }

    close.onclick = function(){
        modal.style.display = "none"
        body.className = ""
    }



})