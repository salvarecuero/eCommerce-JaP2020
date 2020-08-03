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
        window.location.replace("home.html");
    }
}

function showError(){
    errorMsg.classList.add("alert", "alert-danger");
    errorMsg.innerHTML = "Correo y/o contraseña vacíos, por favor ingrese sus datos correctamente.";
}