window.addEventListener("DOMContentLoaded", start);


function start() {
    console.log("Siden er loaded!");

    const dataContainer = document.querySelector(".data-container");
    const dishTemplate = document.querySelector("template");
    const googleSheetLink = "https://spreadsheets.google.com/feeds/list/17Dd7DvkPaFamNUdUKlrFgnH6POvBJXac7qyiS6zNRw0/od6/public/values?alt=json";
    const popUpDishContainer = document.querySelector(".pop-up-dish-container");
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

                let string = dish.gsx$kategori.$t;
                let stringFirstLetter = string.charAt(0).toUpperCase();
                string = stringFirstLetter + string.slice(1);

                let templateClone = dishTemplate.cloneNode(true).content;

                templateClone.querySelector(".dish-image").src = `http://evakjar.dk/kea/07_dynamisk_web/07_dynamisk_web-babushka/img/small/${dish.gsx$billede.$t}-sm.jpg`;
                //                templateClone.querySelector(".dish-image").src = `/img/small/${dish.gsx$billede.$t}-sm.jpg`;
                templateClone.querySelector(".dish-name").textContent = `Nr. ${dish.gsx$id.$t} ${dish.gsx$navn.$t}`;

                templateClone.querySelector(".dish-category").textContent = string;

                templateClone.querySelector(".dish-description").textContent = dish.gsx$kort.$t;
                templateClone.querySelector(".dish-price").textContent += `${dish.gsx$pris.$t} kr`;

                templateClone.querySelector(".dish").addEventListener("click", () => showPopUp(dish));

                dataContainer.appendChild(templateClone);
            }
        });
    }

    function showPopUp(dish) {
        let string = dish.gsx$kategori.$t;
        let stringFirstLetter = string.charAt(0).toUpperCase();
        string = stringFirstLetter + string.slice(1);

        popUpDishContainer.querySelector(".pop-up-dish-name").textContent = `Nr. ${dish.gsx$id.$t} ${dish.gsx$navn.$t}`;
        popUpDishContainer.querySelector(".pop-up-dish-category").textContent = string;
        popUpDishContainer.querySelector(".pop-up-dish-image").src = `http://evakjar.dk/kea/07_dynamisk_web/07_dynamisk_web-babushka/img/large/${dish.gsx$billede.$t}.jpg`;
        popUpDishContainer.querySelector(".pop-up-dish-image").alt = dish.gsx$navn.$t;
        popUpDishContainer.querySelector(".pop-up-dish-description").textContent = dish.gsx$lang.$t;
        popUpDishContainer.querySelector(".pop-up-dish-price").textContent = `Pris: ${dish.gsx$pris.$t} kr`;
        popUpDishContainer.querySelector(".pop-up-dish-origin").textContent = `Oprindelse: ${dish.gsx$oprindelse.$t}`;

        popUpDishContainer.style.display = "block";
    }

    document.querySelector(".pop-up-close-button").addEventListener("click", () => popUpDishContainer.style.display = "none");


    function addEventlistenersToButtons() {
        document.querySelectorAll(".filter").forEach(button => {
            button.addEventListener("click", filterDishes);
        });
    }

    function filterDishes() {
        filter = this.dataset.kategori;
        document.querySelector(".sub-headline-dish-category").textContent = this.textContent;
        document.querySelectorAll(".filter").forEach((button) => {
            button.classList.remove("active");
        });

        this.classList.add("valgt");

        show(json);
        console.log(filter);
    }

    fetchData();
}
