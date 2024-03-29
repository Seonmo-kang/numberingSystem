const socket = io("http://localhost:3000");
console.log("Test");
console.log(socket);

socket.on("connect",()=>{
    console.log("Board page Successfully connected!");
    
});
function initialStoreNameSetup(){
    socket.emit("request_store_name","");
}
// Receive adding number
// event by send button on numbering
//socket.on('send_number',(data)=>{});
// data : number, operation
socket.on("send_number_to_board",(data) => {
    console.log("send_number_to_board :", data);
    alertNumber(data.number);
    // Skip add number on board list
    if(data.operation === "repeat"){
        return;
    }
    // Add element with data on id if it is not repeat
    let currentOrder = document.createElement("div");
    let numberList = document.getElementById("numberList");
    currentOrder.id = data.number;
    currentOrder.classList.add("board-order");
    currentOrder.innerText = data.number;
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
// Receive close alert modal
socket.on('send_close_alert_to_board',(data)=>{
    closeAlertNumber();
})
// Receive store Name
// event by click change button in setting pop up window
//socket.on('send_storeName',(data)=>{});
socket.on('send_storeName_to_board',(data)=>{
    console.log('send_storeName to board :',data);
    window.localStorage.setItem('store-name',data);
    // change innerText of element of storeName
    let storeBannerElement = document.getElementById("storeName");
    storeBannerElement.innerText = data;

});

socket.on('send_delete_all_orders_to_board',(data)=>{
    console.log('send_delete_all_orders :', data);
    // remove all element on board list
    let numberListElem = document.getElementById("numberList");
    while(numberListElem.firstChild){
        numberListElem.removeChild(numberListElem.firstChild);
    }
})

// set storeName from localStorage
function setBoardStoreName(){
    let storeBannerElement = document.getElementById("storeName");
    if(localStorage.getItem("store-name")!=null)
        storeBannerElement.innerText = localStorage.getItem("store-name");
}

function getBoardStoreName(){
    let storeBannerElement = document.getElementById("storeName");
    return storeBannerElement.innerText;
}

//Show alert-modal when received number from WS
function alertNumber(number){
    let alertModalElement = document.getElementById('alert-modal');
    alertModalElement.style.display = "flex";
    
    let storenameElement = document.createElement("div");
    storenameElement.classList.add("alert-storename");
    storenameElement.innerText = getBoardStoreName();

    let numberElement = document.createElement("div");
    numberElement.classList.add("alert-number");
    numberElement.innerText = number;
    
    alertModalElement.append(storenameElement);
    alertModalElement.append(numberElement);
    // setTimeout(closeAlertNumber,5000);
}
function closeAlertNumber(){
    let alertModalElement = document.getElementById('alert-modal');
    while(alertModalElement.firstChild){
        alertModalElement.removeChild(alertModalElement.firstChild);
    }
    alertModalElement.style.display = "none";
}
document.addEventListener("click",()=>{
    toggleFullScreen();
});

let modalFullScreen = document.getElementById("fullScreen");
let modalElem = document.getElementById("modal-content");
modalFullScreen.style.display = "none";
modalElem.style.display = "none";

// function openModal(){
//     if(document.fullscreenElement){
//         return ;
//     }
//     modalFullScreen.style.display = "block";
//     modalElem.style.display = "flex";
//     console.log("openModal lunched");
// }

// Click Modal then guide modal comes and full screen
// modalFullScreen.onclick = () =>{
//     let key = modalFullScreen.getAttribute("data-key");
//     if(key == "screen"){
//         let modalContent = document.getElementById("modal-content");
//         modalContent.innerText = "Press following shortcut";
//         let imgElem = document.createElement("img");
//         imgElem.src = "./images/shortcut.png";
//         imgElem.classList.add("modal-img");
//         modalContent.append(imgElem);
//         modalFullScreen.setAttribute("data-key","shortcut");
//
//     }
// }
// modalElem.onclick = () =>{
//     let key = modalFullScreen.getAttribute("data-key");
//     if(key == "screen"){
//         let modalContent = document.getElementById("modal-content");
//         modalContent.innerText = "Press following shortcut";
//         let imgElem = document.createElement("img");
//         imgElem.src = "./images/shortcut.png";
//         imgElem.classList.add("modal-img");
//         modalContent.append(imgElem);
//         modalFullScreen.setAttribute("data-key","shortcut");
//
//     }
// }

// Short cut detect set
// modalFullScreen is full then It works.
// key down detector
// let keysPressed = {};
// document.addEventListener('keydown', (event) => {
//     keysPressed[event.key] = true;
//     console.log("event.key : ",event.key);
//     if ( document.fullscreenElement && keysPressed['Meta'] && keysPressed['Shift'] && keysPressed['ArrowRight']) {
//         modalFullScreen.style.display = "none";
//         modalElem.style.display = "none";
//     }
// });
// // keyup detector
// document.addEventListener('keyup', (event) => {
//     delete keysPressed[event.key];
// });


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
    // setBoardStoreName();
    initialStoreNameSetup();
    // openModal();
}