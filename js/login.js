//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.

const errorMsg = document.getElementById("login-error");

document.forms["login"].addEventListener("submit", checkDatos);

function checkDatos(event){
    event.preventDefault()
    var correo = document.forms["login"]["correo"].value;
    var password = document.forms["login"]["password"].value;

    if(!correo || !password){
        showError();
    }else{
        localStorage.setItem('correo', correo);
        localStorage.setItem("logged", true);
        window.location.replace("index.html");
    }
};

function showError(){
    errorMsg.classList.add("alert", "alert-danger");
    errorMsg.innerHTML = "Correo y/o contraseña vacíos, por favor ingrese sus datos correctamente.";
};

function onSignIn(){
    localStorage.removeItem("correo");
    localStorage.setItem("logged", true);
    window.location.replace("index.html");
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
};