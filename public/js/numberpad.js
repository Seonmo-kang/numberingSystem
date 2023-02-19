
// operation number :
// 1 = add
// 0 = delete

const socket = io("http://localhost:3000");
console.log("Test");
console.log(socket);

// if localstorage doesn't have store name then open setting pop up window
function initialStoreNameSetUp(){
    if(localStorage.getItem("store-name")==null){

        //Disable cancel button
    }
}

function openModal(){
    //open setting pop up
    //Full monitor make dark
    let modalElement = document.getElementById("modal");
    let fullscreenElement = document.getElementById("fullScreen");
    fullscreenElement.style.display = "block";
    modalElement.style.display = "block";
}
function setStoreName(){
    const
}


window.onload = function (){
    initialStoreNameSetUp();
}
// Number key listener
    // Print number on numberInput element

// Send adding number
// event by send button on numbering
    //socket.emit('send_number',{});

// Send deleting number
// event by delete button on numberlist
    //socket.emit('delete_number',{});

// Send store Name
// event by click change button in setting pop up window
    //socket.emit('send_storeName',{});
