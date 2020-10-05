let cartProducts = [];
let cartDiv;
let productsCountInputs;

document.addEventListener("DOMContentLoaded", function() {

    getJSONData(CART_INFO_URL).then(function(products){
        if(products.status === "ok"){
            cartProducts.push(...products.data.articles)
            showCartProducts();
        };
    });

    productsDataDiv = document.getElementById("productsData");
});

function showCartProducts(){
    let htmlContentToAppend;

    if(!cartProducts.length) {
        htmlContentToAppend = `
            <div class="row">
                <div class="col-lg-12 p-5 bg-white rounded shadow-sm mb-5">
                    <div class="alert alert-primary position-relative text-center" style="top: 0px;">
                        Parece que no tienes ningún producto en el carrito :( <a href="/categories.html" class="btn btn-sm btn-success mt-2 text-white">Ir a ver productos</a>
                    </div>
                </div>
            </div>
        `;

        productsDataDiv.innerHTML = htmlContentToAppend;
    }else{
        htmlContentToAppend = `
            <div class="row">
                <div class="col-lg-12 p-5 bg-white rounded shadow-sm mb-5">
                    <div class="table-responsive">
                    <table class="table">
                        <thead class="bg-dark text-white">
                            <tr class="text-center">
                                <th scope="col" class="border-0">
                                <div class="p-2 px-3 text-uppercase">Producto</div>
                                </th>
                                <th scope="col" class="border-0">
                                <div class="py-2 text-uppercase">Cantidad</div>
                                </th>
                                <th scope="col" class="border-0">
                                <div class="py-2 text-uppercase">Subtotal <small>(USD)</small></div>
                                </th>
                                <th scope="col" class="border-0">
                                <div class="py-2 text-uppercase">Eliminar</div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
        `;

        for(let i = 0; i < cartProducts.length; i++){
            product = cartProducts[i];
            if(product.currency === "UYU") product.unitCost = product.unitCost / 40;

            htmlContentToAppend += `
                <tr class="border-bottom">
                    <th scope="row" class="border-0">
                        <div class="p-2">
                            <img src="${product.src}" width="70" class="img-fluid rounded shadow-sm">
                            <div class="ml-3 d-inline-block align-middle">
                                <h5 class="mb-0"><a href="product-info.html" class="text-dark d-inline-block align-middle"> ${product.name}</a></h5>
                                <span class="text-muted font-weight-normal font-italic d-block">$${product.unitCost}</span>
                            </div>
                        </div>
                    </th>

                    <td class="border-0 align-middle text-center" style="width: 15%;"><div class="col-10 d-inline-flex"><input class="form-control text-center productCountInput" type="number" value="${product.count}" min="1" prodPos="${i}"></div></td>
                    <td id="subtotal${i}" class="border-0 align-middle text-center"><b>$</b>${product.unitCost * product.count}</td>
                    <td class="border-0 align-middle text-center"><button class="btn text-dark ml-1" onclick="deleteFromCart(${i})"><i class="fa fa-trash"></i></button></td>
                </tr>
            `;
        };

        htmlContentToAppend += `
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        productsDataDiv.innerHTML = htmlContentToAppend;

        productsCountInputs = document.querySelectorAll(".productCountInput");
        productsCountInputs.forEach((countInput) => countInput.addEventListener("change", (e) => changeProductCount(e.target.attributes["prodpos"].value, e.target.value)));
    }
};

function changeProductCount(position, count){
    product = cartProducts[position]
    product.count = count;
    document.getElementById(`subtotal${position}`).innerHTML = `<b>$</b>${product.unitCost * count}`;
}

function deleteFromCart(position){
    cartProducts.splice(position, 1);
    showCartProducts();
}