// Función que checkea si se está ingresando al eCommerce desde un servidor o -else- desde un archivo local
function checkServer(){
    if (!document.location.host) {
        localStorage.clear();
        window.location = "login.html#server";
    }
}