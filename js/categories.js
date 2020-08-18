const ORDER_ASC_BY_NAME = "AZ";
const ORDER_DESC_BY_NAME = "ZA";
const ORDER_BY_PROD_COUNT = "Cant.";

const categoriesArray = [];
var rangedCategories;

var categoriesContainer;

var currentSortCriteria;
var minFilter;
var maxFilter;

var prodCountSortSwitch = true;
var prodCountIcon;

document.addEventListener("DOMContentLoaded", function (e) {
    getJSONData(CATEGORIES_URL).then(function (resultObj) {
        if (resultObj.status === "ok") {
            categoriesArray.push(...resultObj.data);
            rangedCategories = categoriesArray;
            showCategoriesList(categoriesArray);
        }
    });

    document.getElementById("sortAsc").addEventListener("click", () => showCategoriesList(rangedCategories, ORDER_ASC_BY_NAME));
    document.getElementById("sortDesc").addEventListener("click", () => showCategoriesList(rangedCategories, ORDER_DESC_BY_NAME));

    const prodCount = document.getElementById("sortByCount");
    prodCount.addEventListener("click", toggleProductCount);
    prodCountIcon = prodCount.querySelector(".fas");

    minFilter = document.getElementById("rangeFilterCountMin");
    maxFilter = document.getElementById("rangeFilterCountMax");

    document.getElementById("rangeFilterCount").addEventListener("click", filterArray);
    document.getElementById("clearRangeFilter").addEventListener("click", cleanFilters);

    categoriesContainer = document.getElementById("cat-list-container");
});

function showCategoriesList([...array], criteria) {
    let htmlContentToAppend = "";

    if (criteria) {
        array.sort(getSortFunc(criteria));
        currentSortCriteria = criteria;
    }

    for (let i = 0; i < array.length; i++) {
        let category = array[i];
        htmlContentToAppend += `
        <a href="category-info.html" class="list-group-item list-group-item-action">
            <div class="row">
                <div class="col-3">
                    <img src="` + category.imgSrc + `" alt="` + category.description + `" class="img-thumbnail">
                </div>
                <div class="col">
                    <div class="d-flex w-100 justify-content-between">
                        <h4 class="mb-1">`+ category.name + `</h4>
                        <small class="text-muted">` + category.productCount + ` artículos</small>
                    </div>
                    <p class="mb-1">` + category.description + `</p>
                </div>
            </div>
        </a>
        `
    }
    categoriesContainer.innerHTML = htmlContentToAppend;
}

function toggleProductCount(){
    prodCountIcon.style.transform = `scaleY(${prodCountSortSwitch ? 1 : -1})`
    prodCountSortSwitch = !prodCountSortSwitch;
    showCategoriesList(rangedCategories, ORDER_BY_PROD_COUNT);
}

function getSortFunc(criteria) {
    switch (criteria) {
        case ORDER_ASC_BY_NAME:
            return (a, b) => (a.name > b.name)

        case ORDER_DESC_BY_NAME:
            return (a, b) => (a.name < b.name)

        case ORDER_BY_PROD_COUNT:
            return ({productCount:a}, {productCount:b}) => (prodCountSortSwitch ? +a > +b : +a < +b);
    }
}


function filterArray() {
    let minValue = minFilter.value;
    let maxValue = maxFilter.value;

    if (!minValue && !maxValue) {
        showCategoriesList(categoriesArray, currentSortCriteria);
        return
    } else if (minValue && !maxValue) {
        maxValue = Infinity;
    }

    rangedCategories = categoriesArray.filter(({ productCount }) => +productCount >= minValue && +productCount <= maxValue);

    showCategoriesList(rangedCategories, currentSortCriteria);
}

function cleanFilters() {
    minFilter.value = "";
    maxFilter.value = "";
    currentSortCriteria = "";

    prodCountSortSwitch = true;
    prodCountIcon.style.transform = "scaleY(1)";
    prodCountIcon.parentElement.classList.remove("active");

    rangedCategories = categoriesArray;
    showCategoriesList(rangedCategories);
}