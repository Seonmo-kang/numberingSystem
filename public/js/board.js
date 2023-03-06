
const socket = io("http://localhost:3000");
console.log("Test");
console.log(socket);

socket.on("connect",()=>{
    console.log("Successfully connected!");
})
// Receive adding number
// event by send button on numbering
//socket.on('send_number',(data)=>{});
socket.on("send_number_to_board",(data) => {
    console.log("send_number_to_board :", data);
    alertNumber(data);
    // Add element with data on id
    let currentOrder = document.createElement("div");
    let numberList = document.getElementById("numberList");
    currentOrder.id = data;
    currentOrder.classList.add("board-order");
    currentOrder.innerText = data;
    numberList.prepend(currentOrder);
})
// Receive deleting number
// event by delete button on numberlist
//socket.on('delete_number',(data)=>{});
socket.on('send_delete_number_to_board',(data)=>{
    console.log('send_delete_number_to_board :',data);
    // remove element have data on id
    let orderElement = document.getElementById(data);
    let listElement = document.getElementById("numberList");
    listElement.removeChild(orderElement);
});
// Receive store Name
// event by click change button in setting pop up window
//socket.on('send_storeName',(data)=>{});
socket.on('send_storeName_to_board',(data)=>{
    console.log('send_storeName :',data);
    // change innerText of element of storeName
    let storeBannerElement = document.getElementById("storeName");
    storeBannerElement.innerText = data;
});

// set storeName from localStorage
function setBoardStoreName(){
    let storeBannerElement = document.getElementById("storeName");
    if(localStorage.getItem("store-name")==null){
        storeBannerElement.innerText = "";
    }else{
        storeBannerElement.innerText = localStorage.getItem("store-name");
    }
}

//Show alert-modal when received number from WS
function alertNumber(number){
    let alertModalElement = document.getElementById('alert-modal');
    alertModalElement.style.display = "flex";
    alertModalElement.innerText = number;
    setTimeout(closeAlertNumber,5000);
}
function closeAlertNumber(){
    let alertModalElement = document.getElementById('alert-modal');
    alertModalElement.style.display = "none";
}
document.addEventListener("click",()=>{
    toggleFullScreen();
});

let modalFullScreen = document.getElementById("fullScreen");
let modalElem = document.getElementById("modal-content");
function openModal(){
    if(document.fullscreenElement){
        return ;
    }
    modalFullScreen.style.display = "block";
    modalElem.style.display = "flex";
    console.log("openModal lunched");
}

modalFullScreen.onclick = () =>{
    let key = modalFullScreen.getAttribute("data-key");
    if(key == "screen"){
        let modalContent = document.getElementById("modal-content");
        modalContent.innerText = "Press following shortcut";
        let imgElem = document.createElement("img");
        imgElem.src = "./images/shortcut.png";
        imgElem.classList.add("modal-img");
        modalContent.append(imgElem);
        modalFullScreen.setAttribute("data-key","shortcut");

    }
}
modalElem.onclick = () =>{
    let key = modalFullScreen.getAttribute("data-key");
    if(key == "screen"){
        let modalContent = document.getElementById("modal-content");
        modalContent.innerText = "Press following shortcut";
        let imgElem = document.createElement("img");
        imgElem.src = "./images/shortcut.png";
        imgElem.classList.add("modal-img");
        modalContent.append(imgElem);
        modalFullScreen.setAttribute("data-key","shortcut");

    }
}

// Short cut detect set
// modalFullScreen is full then It works.
// key down detector
let keysPressed = {};
document.addEventListener('keydown', (event) => {
    keysPressed[event.key] = true;
    console.log("event.key : ",event.key);
    if ( document.fullscreenElement && keysPressed['Meta'] && keysPressed['Shift'] && keysPressed['ArrowRight']) {
        modalFullScreen.style.display = "none";
        modalElem.style.display = "none";
    }
});
// keyup detector
document.addEventListener('keyup', (event) => {
    delete keysPressed[event.key];
});


screenElem = document.documentElement;
function openFullscreen() {
    if (screenElem.requestFullscreen) {
        screenElem.requestFullscreen();
    } else if (screenElem.webkitRequestFullscreen) { /* Safari */
        screenElem.webkitRequestFullscreen();
    } else if (screenElem.msRequestFullscreen) { /* IE11 */
        screenElem.msRequestFullscreen();
    }
}

/* Close fullscreen */
function closeFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { /* Safari */
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE11 */
        document.msExitFullscreen();
    }
}
// full screen toggle function
function toggleFullScreen(){
    console.log("toggle FullScreen");
    if(!document.fullscreenElement){
        openFullscreen();
        console.log("toggle on FullScreen");
    }else{
        closeFullscreen();
        console.log("toggle off FullScreen");
    }
}

window.onload = function (){
    setBoardStoreName();
    openModal();
}