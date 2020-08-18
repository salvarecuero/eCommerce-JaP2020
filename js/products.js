const productsArray = [];
var rangedProducts;

const ORDER_BY_PROD_SOLD_COUNT = "Relevancia";
const ORDER_BY_PROD_COST = "Precio";

let minFilter;
let maxFilter;

var currentSortCriteria;

var costSortSwitch = true;
var costIcon;

var soldCountSortSwitch = true;
var soldCountIcon;

let productsContainer;

document.addEventListener("DOMContentLoaded", function () {
    getJSONData(PRODUCTS_URL).then(function (products){
        if(products.status === "ok"){
            productsArray.push(...products.data);
            rangedProducts = productsArray;
            showProductsList(productsArray);
        }
    })

    const sortByCost = document.getElementById("sortByCost");
    sortByCost.addEventListener("click", toggleCostSort);
    costIcon = sortByCost.querySelector(".fas");

    const sortBySoldCount = document.getElementById("sortBySoldCount");
    sortBySoldCount.addEventListener("click", toggleSoldCount);
    soldCountIcon = sortBySoldCount.querySelector(".fas");

    minFilter = document.getElementById("rangeFilterCountMin");
    maxFilter = document.getElementById("rangeFilterCountMax");
    document.getElementById("rangeFilterCount").addEventListener("click", filterArray);
    document.getElementById("clearRangeFilter").addEventListener("click", cleanFilters);
    
    productsContainer = document.getElementById("cat-list-container");

});

function showProductsList([...array], criteria){
    let htmlContentToAppend = "";

    if (criteria) {
        array.sort(getSortFunc(criteria));
        currentSortCriteria = criteria;
    }

    for(let i = 0; i < array.length; i++){
        let product = array[i];

        htmlContentToAppend += `
        <div class="list-group-item list-group-item-action">
            <div class="row">
                <div class="col-3">
                    <img src="` + product.imgSrc + `" class="img-thumbnail">
                </div>
                <div class="col">
                    <div class="d-flex w-100 justify-content-between">
                        <h4 class="mb-1">`+ product.name +`</h4>
                        <small class="font-muted">
                            <b>` + product.currency + " $" + product.cost + `</b><br>
                            `+ product.soldCount + ` artículos vendidos
                        </small>
                    </div>
                    ${product.description}
                </div>
            </div>
        </div>
        `
    }
    productsContainer.innerHTML = htmlContentToAppend;
}

function toggleCostSort(){
    costIcon.style.transform = `scaleY(${costSortSwitch ? -1 : 1})`
    costSortSwitch = !costSortSwitch;
    showProductsList(rangedProducts, ORDER_BY_PROD_COST)
}

function toggleSoldCount(){
    soldCountIcon.style.transform = `scaleY(${soldCountSortSwitch ? 1 : -1})`
    soldCountSortSwitch = !soldCountSortSwitch;
    showProductsList(rangedProducts, ORDER_BY_PROD_SOLD_COUNT);
}

function getSortFunc(criteria) {
    switch (criteria) {
        case ORDER_BY_PROD_SOLD_COUNT:
            return (a, b) => (soldCountSortSwitch ? a.soldCount > b.soldCount : a.soldCount < b.soldCount);

        case ORDER_BY_PROD_COST:
            return (a, b) => (costSortSwitch ? a.cost < b.cost : a.cost > b.cost);
    }
}

function filterArray(){
    let minValue = minFilter.value;
    let maxValue = maxFilter.value;

    if(!minValue && !maxValue){
        showProductsList(productsArray, currentSortCriteria)
        return
    }else if(minValue && !maxValue){
        maxValue = Infinity;
    }

    rangedProducts = productsArray.filter(({cost}) => minValue <= cost && maxValue >= cost);
    showProductsList(rangedProducts, currentSortCriteria);
}

function cleanFilters(){
    minFilter.value = "";
    maxFilter.value = "";
    currentSortCriteria = "";

    costSortSwitch = true;
    costIcon.style.transform = "scaleY(-1)";
    costIcon.parentElement.classList.remove("active");

    soldCountSortSwitch = true;
    soldCountIcon.style.transform = "scaleY(1)";
    soldCountIcon.parentElement.classList.remove("active");
    
    rangedProducts = productsArray;
    showProductsList(rangedProducts, currentSortCriteria);
}