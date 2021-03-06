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
    
    productsContainer = document.getElementById("prod-list-container");

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
                <div class="col-md-6 col-lg-3 mb-2 d-flex">
                    <div class="card rounded shadow border-0">
                        <div class="card-body pt-4 p-r4 pb-1 pl-4 flex-fill h-100">
                            <a href="/product-info.html" class="text-dark">
                                <img src="${product.imgSrc}" class="img-fluid d-block mx-auto mb-3">
                                <h5>${product.name}</h5>
                            </a>
                            <p class="small text-muted font-italic">${product.description}</p>
                        </div>
                        <div class="card-body border-top container">
                            <div class="row d-flex align-middle">
                                <div class="col-4 px-0 text-center text-success font-weight-bold">$${product.cost}</div>
                                <div class="col ml-1 pl-4 pr-0 border-left text-muted font-italic">${product.soldCount} vendidos</div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
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
        <div class="alert-danger p-3 my-4 rounded shadow">
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