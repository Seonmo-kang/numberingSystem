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
    setInterval(closeAlertNumber,5000);
}
function closeAlertNumber(){
    let alertModalElement = document.getElementById('alert-modal');
    alertModalElement.style.display = "none";
}

window.onload = function (){
    setBoardStoreName();
}