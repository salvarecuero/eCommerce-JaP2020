function mustBeLogged(){
    if(localStorage.getItem("logged") === null){
        window.location = "login.html";
    };
};

function mustBeUnlogged(){
    if(localStorage.getItem("logged") === "true"){
        window.location = "index.html";
    };
};