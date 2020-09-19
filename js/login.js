//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.

const errorMsg = document.getElementById("login-error");
const formBox = document.querySelector(".card");

if (window.location.hash === '#server') showError("server");

document.forms["login"].addEventListener("submit", checkDatos);

function checkDatos(event){
    event.preventDefault()
    var correo = document.forms["login"]["correo"].value;
    var password = document.forms["login"]["password"].value;

    if(!correo || !password){
        showError("data");
    }else{
        localStorage.setItem('correo', correo);
        localStorage.setItem("logged", true);
        window.location = "index.html";
    }
};

function showError(type){
    
    if(type === "data") {
        errorMsg.classList.add("alert", "alert-danger");
        errorMsg.innerHTML = "Correo y/o contraseña vacíos, por favor ingrese sus datos correctamente.";
    }
    else if(type === "server"){
        formBox.style.position = "absolute";
        errorMsg.innerHTML = `
        <div class="alert alert-dark bg-light mb-5" style="display: absolute !important;">
            <h4 class="alert-heading text-left mt-2 ml-3"><i class="fa fa-server"></i> <b>Oops!</b></h4>
            <p class="text-left ml-3">Para ingresar hay que hacerlo desde un servidor. <em>Google OAuth things!</em></p>
            <hr><br>
            
            <div class="row justify-content-center">
                <div class="col-5 mr-0">
                    <a href="https://salvarecuero.github.io/eCommerce-JaP2020/" id="github-button" class="btn d-inline text-white text-right"><i class="fa fa-link"></i> Ingresar por GitHub Pages</a><br>
                    <small><em>(Quizás no esté en la misma versión)</em></small>
                </div>

                <div class="col-1"><h5 class="d-inline">ó</h5></div>

                <div class="col-5 d-inline ml-0 align-content-left">
                    <em><b>Ingresar a través de localhost</b></em>
                </div>
            </div>
            <hr>
            
            <div class="bg-light text-right">
                <em><p class="mb-0">"The good news about computers is that they do what you tell them to do. <br> The bad news is that they do what you tell them to do."</p></em>
                - <cite title="Ted Nelson"><a href="https://es.wikipedia.org/wiki/Ted_Nelson" target="_blank">Ted Nelson</a></cite>
            </div>
        </div>
        `
    }
};

function onSignIn(){
    localStorage.removeItem("correo");
    localStorage.setItem("logged", true);
    window.location = "index.html";
};

function renderButton() {
    gapi.signin2.render('my-signin2', {
      'scope': 'profile email',
      'width': 338,
      'height': 50,
      'longtitle': true,
      'theme': 'dark',
      'onsuccess': onSignIn,
    });

    const target = document.getElementById('my-signin2');
    const observer = new MutationObserver(translateButton);
    observer.observe(target, { childList: true });
}

function translateButton() {
    document.querySelector('#my-signin2 span > span').innerHTML = 'Iniciar sesión con Google';
}