let cartProducts = [];
let productsDataDiv;
let buyProcessDiv;
let productsCountInputs;
let shippingTypeValue = 1;
let payment;

document.addEventListener("DOMContentLoaded", function() {

    productsDataDiv = document.getElementById("productsData");
    buyProcessDiv = document.getElementById("buyProcess");
    
    if(window.localStorage.getItem("userCart") === null) {
        getJSONData(CART_INFO_URL).then(function(products){
            if(products.status === "ok"){
                cartProducts.push(...products.data.articles)
                window.localStorage.setItem("userCart", JSON.stringify(cartProducts));
                showCartProducts();
            };
        });
    }else {
        cartProducts = JSON.parse(window.localStorage.getItem("userCart"));
        showCartProducts();
    };

});

function showCartProducts(){
    let htmlContentToAppend;

    if(!cartProducts.length) {
        htmlContentToAppend = `
            <div class="row">
                <div class="col-lg-12 p-5 bg-white rounded shadow-sm mb-5">
                    <div class="alert alert-primary position-relative text-center" style="top: 0px;">
                        Parece que no tienes ningún producto en el carrito :( 
                        <a href="/categories.html" class="btn btn-sm btn-success mt-2 text-white">Ir a ver productos</a> <button class="btn btn-sm btn-info mt-2 text-white" onclick="restoreCart()">Restaurar <i class="fa fa-sync"></i></button>
                    </div>
                </div>
            </div>
        `;

        productsDataDiv.innerHTML = htmlContentToAppend;
        buyProcessDiv.innerHTML = "";
    }else{
        htmlContentToAppend = `
            <div class="row">
                <div class="col-lg-12 p-5 bg-white rounded shadow-sm mb-4">
                    <div class="table-responsive">
                    <table class="table">
                        <thead class="bg-dark text-white">
                            <tr class="text-center">
                                <th scope="col" class="border-0">
                                <div class="py-2 px-3 text-uppercase">Producto</div>
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
            let product = cartProducts[i];
            if(product.currency === "UYU") {
                product.unitCost = product.unitCost / 40;
                product.currency = "USD";
            }

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

        showBuyProcess();
    }
};

function changeProductCount(position, count){
    let product = cartProducts[position];
    product.count = count;
    window.localStorage.setItem("userCart", JSON.stringify(cartProducts));
    document.getElementById(`subtotal${position}`).innerHTML = `<b>$</b>${product.unitCost * count}`;
    updateCartCost(shippingTypeValue);
}

function deleteFromCart(position){
    cartProducts.splice(position, 1);
    window.localStorage.setItem("userCart", JSON.stringify(cartProducts));
    showCartProducts();
    if(cartProducts.length) updateCartCost(shippingTypeValue);
    obtainAndShowProductCount();
}

function showBuyProcess() {
    let subtotalValue = cartProducts.reduce((sum, x) => sum = sum + x.unitCost * x.count, 0);

    let htmlContentToAppend = `
        <div class="row p-5 bg-white rounded shadow-sm mb-5">
            <div class="border-right col-6">
                <form id="address-form" class="needs-validation" novalidate>
                    <div id="shippingType">
                        <h3>Tipo de envío</h3>
                        <div class="custom-control custom-radio ml-3">
                            <input id="formCheckbox1" name="shipping-type-select" type="radio" class="custom-control-input" onclick="updateCartCost(1.15)" required>  
                            <label class="custom-control-label" for="formCheckbox1">
                                <b>Premium</b> | 2 a 5 días | <i>(+15%)</i>
                            </label>
                        </div>
                        <div class="custom-control custom-radio ml-3">
                            <input id="formCheckbox2" name="shipping-type-select" type="radio" class="custom-control-input" onclick="updateCartCost(1.07)" required> 
                            <label class="custom-control-label" for="formCheckbox2">
                                <b>Express</b> | 5 a 8 días | <i>(+7%)</i>
                            </label>
                        </div>
                        <div class="custom-control custom-radio ml-3">
                            <input id="formCheckbox3" name="shipping-type-select" type="radio" class="custom-control-input" onclick="updateCartCost(1.05)" required> 
                            <label class="custom-control-label" for="formCheckbox3">
                                <b>Estándar</b> | 12 a 15 días | <i>(+5%)</i>
                            </label>
                            <div class="invalid-feedback">Debe seleccionar un método de envío.</div>
                        </div>
                    </div>
                    <div class="mt-2 ml-2">
                        <h3>Dirección de envío</h3>
                        <div class="form-row ml-2">
                            <div class="col-md-6 form-group">
                                <label for="streetName">Calle</label>
                                <input type="text" class="form-control" id="streetName" required>
                                <div class="invalid-feedback">
                                    Debe ingresar una calle.
                                </div>
                            </div>
                            <div class="col-md-4 form-group">
                                <label for="streetNumber">Número</label>
                                <input type="text" class="form-control" id="streetNumber" required>
                                <div class="invalid-feedback">
                                    Debe ingresar un número de calle.
                                </div>
                            </div>
                        </div>
                        <div class="form-row ml-2">
                            <div class="col-md-10 form-group">
                                <label for="corner">Esquina</label>
                                <input type="text" class="form-control" id="corner" required>
                                <div class="invalid-feedback">
                                    Debe ingresar una esquina.
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
                <div class="mt-2 ml-2">
                    <h3>Método de pago</h3>

                    <div id="selectedPayment" class="row ml-2"></div>

                    <button id="selectPaymentButton" type="button" class="btn btn-primary mt-2" data-toggle="modal" data-target="#paymentModal">
                        Seleccionar
                    </button>
                    
                    <div id="payment-needed" class="text-danger ml-2" style="display: none"><i class="fa fa-times" aria-hidden="true"></i> Debe seleccionar un método de pago</div>

                    <div class="modal fade" id="paymentModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="exampleModalLabel">Seleccionar método de pago</h5>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>

                                <form id="payment-form" class="needs-validation" novalidate>
                                    <div class="modal-body">
                                        <div class="row ml-1 mb-1">
                                            <div class=form-group>
                                                <div class="custom-control custom-radio custom-control-inline">
                                                    <input type="radio" id="credit-card" name="payment-option" class="custom-control-input" onclick="selectPayment('creditCard')" checked>
                                                    <label class="custom-control-label" for="credit-card">Tarjeta de crédito</label>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div class="row ml-2">
                                            <div class="col-8">
                                                <div class="form-group">
                                                    <label for="credit-card-number">Número de tarjeta</label>
                                                    <input id="credit-card-number" type="text" class="form-control" placeholder="#### #### #### ####" required>
                                                    <div class="invalid-feedback">
                                                        Ingrese un número de tarjeta.
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col">
                                                <div class="form-group">
                                                    <label for="credit-card-security">Código de seg.</label>
                                                    <input id="credit-card-security" type="text" class="form-control" placeholder="CVV / CVC" required>
                                                    <div class="invalid-feedback">
                                                        Ingrese su código de seguridad.
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row mt-2 ml-2">
                                            <div class="col-6">
                                                <div class="form-group">
                                                    <label for="credit-card-expire">Vencimiento (MM/AA)</label>
                                                    <input id="credit-card-expire" type="text" class="form-control" placeholder="Por ej. 05/21" required>
                                                    <div class="invalid-feedback">
                                                        Ingrese fecha de vencimiento.
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="row border-top mt-3 ml-1 mb-1 pt-3">
                                            <div class="custom-control custom-radio custom-control-inline">
                                                <input type="radio" id="bank-transfer" name="payment-option" class="custom-control-input" onclick="selectPayment('bankTransfer')">
                                                <label class="custom-control-label" for="bank-transfer">Transferencia bancaria</label>
                                            </div>
                                        </div>

                                        <div class="row ml-2">
                                            <div class="col">
                                                <div class="form-group">
                                                    <label for="bank-payment">Número de cuenta</label>
                                                    <input id="bank-payment" type="text" class="form-control" placeholder="14 dígitos" disabled required>
                                                    <div class="invalid-feedback">
                                                        Ingrese número de cuenta.
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>    
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                                        <button type="submit" class="btn btn-success">Confirmar</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-4 my-auto mx-auto">
                <div class="card">
                    <div class="card-header text-center">
                        <h5><b>Costos</b></h5>
                    </div>
                    <div class="card-body">
                        <ul class="list-group list-group-flush">
                            <li class="d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                                <div>Subtotal
                                    <small class="text-muted">(USD)</small>
                                </div>
                                <span id="subtotalCartValue">$${subtotalValue}</span>
                            </li>
                            <li class="d-flex justify-content-between align-items-center border-bottom mt-1 px-0">
                                <div>Envío
                                    <small class="text-muted">(USD)</small>
                                </div>
                                <span><small id="shippingCartValue"><em>Elija método de envío</em></small></span>
                            </li>
                            <li class="d-flex justify-content-between align-items-center px-0 my-2">
                                <div>
                                    <strong>Total</strong>
                                    <small class="text-muted">(USD)</small>
                                </div>
                                <span><strong id="totalCartValue">$${subtotalValue}</strong></span>
                            </li>
                        </ul>
                        <div class="text-center">
                            <button type="button" class="btn btn-success" onclick="endBuyProcess()">Finalizar compra</button>
                        </div>

                        <div class="modal fade" id="buySuccessModal" tabindex="-1" aria-labelledby="buySuccessModal" aria-hidden="true">
                            <div class="modal-dialog modal-dialog-centered">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title" id="buySuccessModal"><i class="fa fa-check" style="color:green" aria-hidden="true"></i> ¡Compra realizada!</h5>
                                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div class="modal-body">
                                        Usted ha completado el proceso de compra con éxito.
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-success" data-dismiss="modal">Aceptar</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    buyProcessDiv.innerHTML = htmlContentToAppend;

    window.addEventListener('load', function() {
        let forms = document.getElementsByClassName('needs-validation');
    
        let validation =  Array.prototype.filter.call(forms, function(form) {
            form.addEventListener("submit", function(event) {
                if (form.checkValidity() === false){
                    event.preventDefault();
                    event.stopPropagation();
                }
                else if(form === document.getElementById("payment-form") && form.checkValidity() === true){
                    event.preventDefault();
                    if(form["credit-card"].checked) payment = "Tarjeta de crédito"; else payment = "Cuenta bancaria";
                    document.getElementById("payment-needed").style.display = "none";
                    showSelectedPayment();
                    $("#paymentModal").modal("toggle");
                }
                else if(form.checkValidity() === true){
                    event.preventDefault();
                }
                form.classList.add("was-validated");
            }, false);
        });
    }, false);
}

function selectPayment(type){
    switch (type) {
        case 'creditCard':
                document.getElementById("credit-card-number").removeAttribute("disabled", "");
                document.getElementById("credit-card-security").removeAttribute("disabled", "");
                document.getElementById("credit-card-expire").removeAttribute("disabled", "");

                document.getElementById("bank-payment").setAttribute("disabled", "");
            break;
    
        case 'bankTransfer':
                document.getElementById("bank-payment").removeAttribute("disabled");

                document.getElementById("credit-card-number").setAttribute("disabled", "");
                document.getElementById("credit-card-security").setAttribute("disabled", "");
                document.getElementById("credit-card-expire").setAttribute("disabled", "");
            break;
    };
}

function endBuyProcess(){
    let addressForm = document.getElementById("address-form");
    let paymentForm = document.getElementById("payment-form");

    let paymentError = document.getElementById("payment-needed");

    if(addressForm.checkValidity() && paymentForm.checkValidity()){
        $("#buySuccessModal").modal("show");
    } else if(!addressForm.checkValidity()) {
        addressForm.classList.add("was-validated");
    } else if(!paymentForm.checkValidity()){
        paymentError.style.display = "block";
    }
}

function showSelectedPayment(){
    let selectedPaymentSection = document.getElementById("selectedPayment");
    let selectPaymentButton = document.getElementById("selectPaymentButton");

    selectedPaymentSection.innerHTML = `<span><i class="fa fa-check" aria-hidden="true" style="color: green;"></i> Usted ha seleccionado pagar con <b>${payment}</b>.</span>`
    selectPaymentButton.innerHTML = "Cambiar";
    selectPaymentButton.classList.remove("btn-primary");
    selectPaymentButton.classList.add("btn-info");
}

function updateCartCost(shippingValue) {
    if(shippingValue) shippingTypeValue = shippingValue;

    let subtotalValueHTML = document.getElementById("subtotalCartValue");
    let shippingValueHTML = document.getElementById("shippingCartValue");
    let totalValueHTML = document.getElementById("totalCartValue");

    let subtotalValue = cartProducts.reduce((sum, x) => sum = sum + x.unitCost * x.count, 0);
    let shippingCost = 0;
    if(shippingTypeValue > 1){
        shippingCost = Math.ceil(subtotalValue * (shippingTypeValue - 1));
        shippingValueHTML.innerHTML = `$${shippingCost}`;
    }
    let totalValue = subtotalValue + shippingCost;

    subtotalValueHTML.innerHTML = `$${subtotalValue}`;
    totalValueHTML.innerHTML = `$${totalValue}`;
}

function restoreCart(){
    localStorage.removeItem("userCart");
    location.reload();
}