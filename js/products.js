const productsArray = [];
var productsToManipulate;

const ORDER_BY_PROD_SOLD_COUNT = "Relevancia";
const ORDER_BY_PROD_COST = "Precio";

let searchInput;
let searchIcon;
let clearButton;
let clearButtonSubmit;
let clearButtonStatus = false;

let minFilter;
let minValue;
let maxFilter;
let maxValue;

let currentSortCriteria;

var costSortSwitch = true;
var costIcon;

var soldCountSortSwitch = true;
var soldCountIcon;

let productsContainer;

document.addEventListener("DOMContentLoaded", function () {
    getJSONData(PRODUCTS_URL).then(function (products){
        if(products.status === "ok"){
            productsArray.push(...products.data);
            productsToManipulate = productsArray;
            showProductsList(productsArray);
        }
    })

    searchInput = document.getElementById("search");
    searchInput.addEventListener("input", showProductsList.bind(undefined, undefined));
    searchIcon = document.getElementById("searchIcon");

    const sortByCost = document.getElementById("sortByCost");
    sortByCost.addEventListener("click", toggleCostSort);
    costIcon = sortByCost.querySelector(".fas");

    const sortBySoldCount = document.getElementById("sortBySoldCount");
    sortBySoldCount.addEventListener("click", toggleSoldCount);
    soldCountIcon = sortBySoldCount.querySelector(".fas");

    minFilter = document.getElementById("rangeFilterCountMin");
    maxFilter = document.getElementById("rangeFilterCountMax");
    document.getElementById("rangeFilterCount").addEventListener("click", setRange);
    document.getElementById("clearRangeFilter").addEventListener("click", cleanFilters);
    
    productsContainer = document.getElementById("cat-list-container");

});

function showProductsList(array = [...productsToManipulate], criteria = currentSortCriteria){
    
    if(search(array) === "error") showErrorMsg();
    else {
        if(searchInput.value) array = search(array);
        array = array.sort(getSortFunc(criteria));
        array = filterArray(array);
        if(!array) showErrorMsg();
        currentSortCriteria = criteria;
        
        let htmlContentToAppend = "";

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

        productsContainer.style.transition = "all 200ms";
        productsContainer.style.opacity = "0.25";
        setTimeout(() => {
            productsContainer.innerHTML = htmlContentToAppend;
            productsContainer.style.opacity = "1";
        }, 200);
    }
}

function search(array){
    const searchValue = searchInput.value
        .toLowerCase()
        .replace(/\s+/g, '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

    if(searchValue) {
        let searchResult = array.filter((product) => (product.name + product.description)
            .toLowerCase()
            .replace(/\s+/g, '')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .search(searchValue) >= 0);

            if(!clearButtonStatus) showNHideClearButton("show");

            if(searchResult.length > 0) return searchResult;
            else return "error";
    }else{
        if(clearButtonStatus) showNHideClearButton("hide");
    }
}

function clearSearch(){
    searchInput.value = "";
    showProductsList(undefined, undefined);
}

function showNHideClearButton(action){
    switch (action) {
        case "show":
            clearButtonStatus = true;
            searchIcon.innerHTML = `
                <button id="clearButton" class="btn btn-outline-secondary">
                    <i class="fa fa-times-circle"></i>
                </button>
            `;
            clearButton = document.getElementById("clearButton");
            clearButtonSubmit = clearButton.addEventListener("click", clearSearch);
            break;
    
        case "hide":
            clearButtonStatus = false;
            searchIcon.innerHTML = `
                <div class="input-group-text bg-transparent"><i class="fa fa-search"></i></div>
            `;
            break;
    }
}

function showErrorMsg(){
    let htmlContentToAppend = `
        <div class="alert alert-danger mt-2" style="position: relative; width:auto; top: 0;">
            <h3 class="alert-heading">No se han encontrado resultados</h4>
        </div>
    `;
    productsContainer.innerHTML = htmlContentToAppend;
}



function toggleCostSort(){
    costIcon.style.transform = `scaleY(${costSortSwitch ? -1 : 1})`
    costSortSwitch = !costSortSwitch;
    showProductsList(undefined, ORDER_BY_PROD_COST);
}

function toggleSoldCount(){
    soldCountIcon.style.transform = `scaleY(${soldCountSortSwitch ? 1 : -1})`
    soldCountSortSwitch = !soldCountSortSwitch;
    showProductsList(undefined, ORDER_BY_PROD_SOLD_COUNT);
}

function getSortFunc(criteria) {
    switch (criteria) {
        case ORDER_BY_PROD_SOLD_COUNT:
            return (a, b) => (soldCountSortSwitch ? a.soldCount > b.soldCount : a.soldCount < b.soldCount);

        case ORDER_BY_PROD_COST:
            return (a, b) => (costSortSwitch ? a.cost < b.cost : a.cost > b.cost);
    }
}

function setRange(){
    minValue = minFilter.value;
    maxValue = maxFilter.value;

    showProductsList();
}

function filterArray(array){
    if(!minValue && !maxValue){
        minValue = 0;
        maxValue = Infinity;
    }else if(minValue && !maxValue){
        maxValue = Infinity;
    }
    
    return array.filter(({cost}) => minValue <= cost && maxValue >= cost);
}

function cleanFilters(){
    searchInput.value = "";

    minFilter.value = "";
    maxFilter.value = "";
    minValue = undefined;
    maxValue = undefined;
    
    costSortSwitch = true;
    costIcon.style.transform = "scaleY(-1)";
    costIcon.parentElement.classList.remove("active");
    currentSortCriteria;

    soldCountSortSwitch = true;
    soldCountIcon.style.transform = "scaleY(1)";
    soldCountIcon.parentElement.classList.remove("active");
    
    productsToManipulate = productsArray;
    showProductsList(productsToManipulate, undefined);
}