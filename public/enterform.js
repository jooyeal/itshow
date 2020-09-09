const main = document.querySelector("main");
const mainWrap = document.querySelector(".main-wrap");
const enterForm = document.getElementById("enterForm");
const createForm = document.getElementById("createForm");
const enterText = document.getElementById("enterText");
const createText = document.getElementById("createText");
const closebtn = document.querySelectorAll(".enter-cancel, .create-cancel");

function openForm(event) {
    const target = event.target
    if (target.id === 'enterText') {
        main.style.backgroundColor = "rgba(0,0,0,0.3)";
        mainWrap.style.display = "none";
        enterForm.style.display = "block";
    } else {
        mainWrap.style.display = "none";
        createForm.style.display = "block";
    }
}

function closeForm(event) {
    const target = event.target
    if (target.id === "enterCancel") {
        mainWrap.style.display = "block";
        main.style.backgroundColor = "";
        enterForm.style.display = "none";
    } else {
        mainWrap.style.display = "block";
        main.style.backgroundColor = "";
        createForm.style.display = "none";
    }
}

function init() {
    enterText.addEventListener("click", openForm);
    createText.addEventListener("click", openForm);
    closebtn[0].addEventListener("click", closeForm);
    closebtn[1].addEventListener("click", closeForm);
}

init();