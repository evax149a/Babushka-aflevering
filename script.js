window.addEventListener("DOMContentLoaded", start);


function start() {
    console.log("Siden er loaded!");

    const dataContainer = document.querySelector(".data-container");
    const dishTemplate = document.querySelector("template");
    const googleSheetLink = "https://spreadsheets.google.com/feeds/list/17Dd7DvkPaFamNUdUKlrFgnH6POvBJXac7qyiS6zNRw0/od6/public/values?alt=json";
    let json;

    let filter = "all";


    async function fetchData() {
        const response = await fetch(googleSheetLink);
        const jsonData = await response.json();
        json = jsonData;
        console.log(json);
        show(jsonData);
        addEventlistenersToButtons();
    }

    function show(json) {
        console.log("show(json)");
        dataContainer.innerHTML = "";

        json.feed.entry.forEach(dish => {
            if (filter == "all" || filter == dish.gsx$kategori.$t) {
                console.log(dish);
                let templateClone = dishTemplate.cloneNode(true).content;

                templateClone.querySelector(".dish-image").src = `/img/small/${dish.gsx$billede.$t}-sm.jpg`;
                templateClone.querySelector(".dish-name").textContent = dish.gsx$navn.$t;
                templateClone.querySelector(".dish-description").textContent = dish.gsx$kort.$t;
                templateClone.querySelector(".dish-price").textContent += `${dish.gsx$pris.$t} kr`;

                dataContainer.appendChild(templateClone);
            }
        });
    }

    function addEventlistenersToButtons() {
        document.querySelectorAll(".filter").forEach(button => {
            button.addEventListener("click", filterDishes);
        });
    }

    function filterDishes() {
        filter = this.dataset.kategori;
        document.querySelector(".sub-headline").textContent = this.textContent;
        document.querySelectorAll(".filter").forEach((button) => {
            button.classList.remove("active");
        });

        this.classList.add("valgt");

        show(json);
        console.log(filter);
    }

    fetchData();
}
