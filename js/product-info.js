let productInfo;
let productRelatedProducts;
let productReviews;

let productContainer;
let reviewContainer;

let userName;
let userPic;
let userSelectedScore;

document.addEventListener("DOMContentLoaded", function(){

    const target = document.getElementById('menu');
    const observer = new MutationObserver(showUserReviewBox);
    
    getJSONData(PRODUCT_INFO_COMMENTS_URL).then(function (resultObj) {
        if(resultObj.status === "ok") {
            productReviews = resultObj.data;
        }
        obtainProductInfo();
    });
    
    function obtainProductInfo() { 
        getJSONData(PRODUCT_INFO_URL).then(function (resultObj) {
            if (resultObj.status === "ok") {
                productInfo = resultObj.data;
                showProduct();
                showReviews();
                observer.observe(target, { childList: true });
                obtainAllProducts();
            }
        });
    };

   function obtainAllProducts() {
        getJSONData(PRODUCTS_URL).then(function (resultObj) {
            if(resultObj.status === "ok") {
                productRelatedProducts = resultObj.data;
            }
            showRelatedProducts();
        });
    };

    productContainer = document.getElementById("product-info");
    reviewContainer = document.getElementById("product-review");
    relatedsContainer = document.getElementById("product-relateds");
});

function showProduct(){

    let productScore = Math.round(productReviews
        .map(review => review.score)
        .reduce((prev, curr) => prev + curr, 0) / productReviews.length);
    
    let htmlToAppend = `
        <div class="row text-left">
            <div class="col-6 border-right">
                <div class="carousel slide" data-ride="carousel" id="carousel-1">
                    <div class="carousel-inner" role="listbox">`;
                        for(let i = 0; i < productInfo.images.length; i++){
                            let img = productInfo.images[i];
                            if(i === 0) htmlToAppend += `<div class="carousel-item active"><img class="w-100 d-block" src="${img}" alt="${productInfo.name}"></div>`
                            else htmlToAppend += `<div class="carousel-item"><img class="w-100 d-block" src="${img}" alt="${productInfo.name}"></div>`
                        };

    htmlToAppend += `</div>
                    <div><a class="carousel-control-prev" href="#carousel-1" role="button" data-slide="prev"><span class="carousel-control-prev-icon"></span><span class="sr-only">Anterior</span></a><a class="carousel-control-next" href="#carousel-1" role="button"
                            data-slide="next"><span class="carousel-control-next-icon"></span><span class="sr-only">Siguiente</span></a></div>
                    <ol class="carousel-indicators">`;
                        for(let i = 0; i < productInfo.images.length; i++){
                            if(i === 0) htmlToAppend += `<li data-target="#carousel-1" data-slide-to="${i}" class="active"></li>`
                            else htmlToAppend += `<li data-target="#carousel-1" data-slide-to="${i}"></li>`
                        };
    htmlToAppend += `
                    </ol>
                </div>
            </div>
            <div class="col-6">
                <h1 class="display-4 text-nowrap"><strong>${productInfo.name}</strong></h1>
                <hr>
                <p class="lead d-inline" style="font-size: 35px;">${productInfo.currency} $${productInfo.cost} <strong>|</strong>&nbsp;</p>
                <p class="d-inline lead" style="font-size: 25px;"><em>${productInfo.soldCount} vendidos</em></p><br>
                <div id="prodStars">`
                    for(let i = 1; i <= 5; i++){
                        if(i <= productScore) htmlToAppend += `<span class="fa fa-star checked"></span>`
                        else htmlToAppend += `<span class="fa fa-star"></span>`
                    };
    htmlToAppend += `
                </div>
                <p class="text-justify">${productInfo.description}</p>
            </div>
        </div>
        <hr>
        `;

    productContainer.innerHTML = htmlToAppend;
    $(".carousel").carousel({
        pause: "hover",
        interval: 2000
    });
};

function showReviews(){
    let htmlToAppend = `<div class="row people reviews">`;

    for(let i = 0; i < productReviews.length; i++){
        let review = productReviews[i];
        if (userName && review.user === userName) review.pic = userPic;
        if (!review.pic) review.pic = `http://placeimg.com/320/320/people?=${i}`;

        htmlToAppend += `
            <div class="col-md-6 col-lg-4 item">
                <div class="box">
                    <p class="description">${review.description}</p>
                </div>
                <div class="author">
                    <img class="rounded-circle" src="${review.pic}">
                    <h5 class="name">${review.user}</h5>`
                    for(let i = 1; i <= 5; i++){
                        if(i <= review.score) htmlToAppend += `<span class="fa fa-star checked"></span>`
                        else htmlToAppend += `<span class="fa fa-star"></span>`
                    };
        htmlToAppend += `
                    <p class="date">${review.dateTime}</p>
                </div>
            </div>
        `;
    };
    htmlToAppend += `
        </div>
        <hr>
        `;
    
    reviewContainer.innerHTML = htmlToAppend;
};

function showUserReviewBox() {
    userPic = document.getElementById("profilePic").src;
    userName = document.getElementById("profileName").textContent;
    
    let htmlToAppend = "";

    htmlToAppend = `
        <div id="userCommentBox" class="col-md-6 col-lg-4 item">
            <div class="box review-input border border-success">
                <input id="userComment" class="description form-control" placeholder="Ingresa tu comentario..." required>
            </div>
            <div class="author">
                <img id="userReviewPic" class="rounded-circle d-inline" src="${userPic}">
                    <div class="d-inline-block">
                        <h5 class="name">${userName}</h5>
                        <div id="userReviewStars" data-toggle="tooltip">
                            ${[1, 2, 3, 4, 5].reduce((acum, v) => acum + `<span class="fa fa-star star-rating" onClick="setRating(${v})"></span>`, "")}
                        </div>
                    </div>
                <button id="submitReview" type="button" class="btn btn-sm btn-success mb-4 ml-2" onClick="submitUserReview()">Enviar</button>
            </div>
        </div>
    `;
    document.querySelector(".row.people.reviews").innerHTML += htmlToAppend;
    if(userPic.includes("defaultUserImg.svg")) document.getElementById("userReviewPic").classList.add("bg-dark");
}

function setRating(rating){
    divStars = document.querySelector("#userReviewStars");
    stars = document.querySelectorAll(".star-rating");

    if(userSelectedScore) stars[userSelectedScore - 1].classList.remove("checked");

    divStars.classList.add("checked");
    stars[rating - 1].classList.add("checked");
    userSelectedScore = rating;
}

function submitUserReview(){
    let userName = document.getElementById("profileName").textContent;
    let commentInput = document.getElementById("userComment");
    let boxToDelete = document.getElementById("userCommentBox");

    if(!commentInput.value) commentInput.reportValidity();
    else if(!userSelectedScore) {
        let options = {
            title: "Es necesario puntuar el producto.",
            animation: true,
            placement: "bottom",
            trigger: "manual"
        };
        $("#userReviewStars").tooltip(options);
        $("#userReviewStars").tooltip("show");
    }else{
        $("#userReviewStars").tooltip("hide");
        let rightNow = new Date;
        rightNow = rightNow.toISOString().slice(0,10) + " " + rightNow.toTimeString().split(' ')[0];
        let userComment = {
            "score": userSelectedScore,
            "description": commentInput.value,
            "user": userName,
            "dateTime": rightNow
        };

        productReviews.push(userComment);
        boxToDelete.parentElement.removeChild(boxToDelete);
        showReviews();
        calcNewProdScore();
    };
}

function calcNewProdScore(){
    const productStars = document.getElementById("prodStars");
    let htmlToAppend = "";
    let productScore = Math.round(productReviews
        .map(review => review.score)
        .reduce((prev, curr) => prev + curr, 0) / productReviews.length);

    for(let i = 1; i <= 5; i++){
        if(i <= productScore) htmlToAppend += `<span class="fa fa-star checked"></span>`;
        else htmlToAppend += `<span class="fa fa-star"></span>`;
    };

    productStars.innerHTML = htmlToAppend;
}

function showRelatedProducts() {
    let htmlToAppend = `
        <h3 class="text-center">Productos relacionados</h2>
        <div class="row justify-content-center">
    `;

    for (let i = 0; i < productInfo.relatedProducts.length; i++){
        related = productRelatedProducts[productInfo.relatedProducts[i]];
        htmlToAppend += `
        <a href="">
            <div class="col-auto">
                    <div class="card" style="width: 18rem;">
                        <img src="${related.imgSrc}" class="card-img-top w-75 d-block mx-auto">
                        <div class="card-body">
                            <h4 class="card-title text-body">${related.name}</h4>
                            <p class="card-text text-dark">${related.currency} $ ${related.cost}</p>
                        </div>
                    </div>
            </div>
        </a>
        `;
    }

    htmlToAppend += `
        </div>
        <hr>
    `;
    relatedsContainer.innerHTML = htmlToAppend;
}