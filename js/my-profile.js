let storedUser;

let myProfileImg;
let myProfileName;
let myProfileEmail;
let myProfileAge;

let userImage;

let changePictureInput;
let nameInput;
let birthdayInput;
let emailInput;
let phoneInput;

let saveDataButton;

let userDataObject;

let todaysDate;

document.addEventListener("DOMContentLoaded", () => {
    myProfileImg = document.getElementById("user-image");
    myProfileName = document.getElementById("user-name");
    myProfileEmail = document.getElementById("user-email");
    myProfileAge = document.getElementById("user-age");

    nameInput = document.getElementById("nameInput");

    birthdayInput = document.getElementById("birthdayInput");
    todaysDate = new Date().toJSON().slice(0,10).replace(/-/g,'-');
    birthdayInput.setAttribute("max", todaysDate);

    emailInput = document.getElementById("emailInput");
    phoneInput = document.getElementById("phoneInput");
    
    saveDataButton = document.getElementById("saveDataButton");
    saveDataButton.addEventListener("click", saveUserData);
});

function setUserData(img, name = "", email = "", birthday = "", phone = "") {
    userImage = img;

    storedUser = JSON.parse(localStorage.getItem("userDataObject"));

    if(storedUser) {
        storedUser.name && storedUser.name != name && (name = storedUser.name);
        storedUser.email && (email = storedUser.email);
        birthday = storedUser.birthday;
        phone = storedUser.phone;
    }

    userDataObject = {
        name: name,
        birthday: birthday,
        email: email,
        phone: phone
    }

    localStorage.setItem("userDataObject", JSON.stringify(userDataObject));
    showUserData(img, name, email, birthday, phone);
    setInputs(name, email, birthday, phone);
}

function showUserData(img, name, email, birthday){
    if(img === "img/defaultUserImg.svg") myProfileImg.innerHTML = `
        <img class="rounded-circle mt-5" src="${img}" height="90" style="background: #343a40;"/>
    `;
    else myProfileImg.innerHTML = `<img src="${img}" class="rounded-circle mt-5" width="90">`;

    myProfileName.innerHTML = name;
    myProfileEmail.innerHTML = email;

    if(birthday) {
        let today = new Date(todaysDate).getTime();
        birthday = new Date(birthday).getTime();
        const age = Math.floor((today - birthday) / (365 * 24 * 60 * 60 * 1000));
        myProfileAge.innerHTML = `- ${age} años -`;
    }
};

function setInputs(name, email, birthday, phone){
    nameInput.value = name;
    emailInput.value = email;
    birthdayInput.value = birthday;
    phoneInput.value = phone;
}

function saveNewProfileImage(e){
    let reader = new FileReader();

    reader.onload = function(e) {
        myProfileImg.firstElementChild.src = e.target.result;
        document.querySelector("#profilePic").src = e.target.result;
        localStorage.setItem("userCustomImg", e.target.result);
    };

    reader.readAsDataURL(e.target.files[0]);
}

function saveUserData(){
    userDataObject = {
        name: nameInput.value,
        birthday: birthdayInput.value,
        email: emailInput.value,
        phone: phoneInput.value
    }

    if(userDataObject.name && !localStorage.getItem("correo")) document.getElementById("profileName").innerHTML = userDataObject.name.replace(/ .*/,'');

    localStorage.setItem("userDataObject", JSON.stringify(userDataObject));
    setUserData(userImage);
}