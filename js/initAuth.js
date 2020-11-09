function initAuth() {
    gapi.load('auth2', function () {
        const auth2 = gapi.auth2.init({
            client_id: '213419820394-uvd8bancrgor4shmd9dqjupsni82kvt7.apps.googleusercontent.com',
        });

        auth2
            .then(() => {
                const profile = auth2.currentUser.get().getBasicProfile();
                if (profile) {
                    localStorage.removeItem("correo");
                    if(localStorage.getItem("userCustomImg")) var img = localStorage.getItem("userCustomImg");
                    else var img = profile.getImageUrl();
                    var name = profile.getGivenName();
                    var fullName = profile.getName();
                    var email = profile.getEmail();
                    var toAdd = createButton(name, img);
                    const menu = document.getElementById("menu");
                    menu.innerHTML += toAdd;
                    if(window.location.pathname === "/my-profile.html") setUserData(img, fullName, email);
                    obtainAndShowProductCount();
                }else if(localStorage.getItem('correo')){
                    var email = localStorage.getItem('correo');
                    if(localStorage.getItem("userCustomImg")) var img = localStorage.getItem("userCustomImg");
                    else var img = "img/defaultUserImg.svg";
                    var toAdd = createButton(email, img);
                    const menu = document.getElementById("menu");
                    menu.innerHTML += toAdd;
                    if(window.location.pathname === "/my-profile.html") setUserData(img, "", email);
                    obtainAndShowProductCount();
                }else throw Error();
            })
            .catch(() => {
                logOut();
            });
        window.auth2 = auth2;
    });
};

function createButton(nombre, img){
    let promiseName;
    if(localStorage.getItem("userDataObject")) {
        promiseName = JSON.parse(localStorage.getItem("userDataObject")).name;
        promiseName != "" && (nombre = promiseName.replace(/ .*/,''));
    }

    let btnMenu = `
    <div id="userMenu" class="dropdown show">
        <a class="btn dropdown-toggle" style="color: white;" href="" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <img id="profilePic" src="${img}" height="25px" style="display: inline-inblock;"> <span id="profileName">${nombre}</span>
        </a>
            
        <div class="dropdown-menu" style="width: 100%;" aria-labelledby="dropdownMenuLink">
            <a class="dropdown-item" href="my-profile.html"><i class="fa fa-user"></i> Mi perfil</a>
            <a id="cartButton" class="dropdown-item" href="cart.html"><i class="fa fa-shopping-cart"></i> Mi carrito</a>
            <a class="dropdown-item" href="#" onClick="logOut()"><i class="fa fa-power-off"></i> Cerrar sesión</a>
        </div>
    </div>
    `;
    
    return btnMenu;
};

async function obtainAndShowProductCount(){
    let cartCount;
    let cartButton = document.getElementById("cartButton");

    if(window.localStorage.getItem("userCart") === null){
        await getJSONData(CART_INFO_URL).then(function(products){
            if(products.status === "ok"){
                cartCount = products.data.articles.length;
                window.localStorage.setItem("userCart", JSON.stringify(products.data.articles));
            }
        });
    }else{
        cartCount = JSON.parse(window.localStorage.getItem("userCart")).length;
    };

    cartButton.innerHTML = `<i class="fa fa-shopping-cart"></i> Mi carrito </a><span class="badge badge-dark">${cartCount}</span>`
};

function logOut(){
    auth2.disconnect();
    localStorage.clear();
    window.location = "login.html";
}