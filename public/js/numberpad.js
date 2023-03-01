
// operation number :
// 1 = add
// 0 = delete

const socket = io("http://localhost:3000");
console.log("Test");
console.log(socket);

// Number key listener
// Print number on numberInput element
// socket.emit("send_number", data);

// Send adding number
// event by send button on numbering
//socket.emit('send_number',{});

// Send deleting number
// event by delete button on numberlist
//socket.emit('delete_number',{});

// Send store Name
// event by click change button in setting pop up window
//socket.emit('send_storeName',{});

// if localstorage doesn't have store name then open setting pop up window
function initialStoreNameSetUp(){
    if(localStorage.getItem("store-name")==null){
        modalControl("block");
        //Disable cancel button
        let closeButton = document.getElementById("close");
        closeButton.disabled = true;
        let cancelButton = document.getElementById("cancel");
        cancelButton.disabled = true;
        cancelButton.style.background = "gray";
    }else{
        let storeBanner = document.getElementById("storeName");
        storeBanner.innerText = localStorage.getItem("store-name");
    }
}

function modalControl(string){
    //open setting pop up
    //Full monitor make dark
    if(string==null)
        return console.log("Need string parameter in modalControl function");
    console.log(string, typeof string);
    let modalElement = document.getElementById("modal");
    let fullscreenElement = document.getElementById("fullScreen");
    fullscreenElement.style.display = string;
    modalElement.style.display = string;
}

function setStoreName(){
    let storeNameInput = document.getElementById("store-name");
    let storeBanner = document.getElementById("storeName");
    let storeName = storeNameInput.value;
    console.log("storeName :",storeName);
    // exception : Store Name is empty
    if(storeName.innerText==""){
        // alert
        console.log("storeName is empty. Alert should be popped up");
    }
    // exception : Store Name has Front space
    else if(!hasFrontSpace(storeName)){
        // alert
        console.log("hasFrontSpace : false, Alert should be popped up");
    }
    else{
        let closeButton = document.getElementById("close");
        closeButton.disabled = false;
        window.localStorage.setItem("store-name",storeName);
        localStorage.setItem("store-name",storeName);
        storeBanner.innerText = storeName;
        socket.emit("send_storeName",storeName);
    }
}
function hasFrontSpace(string){
    const re = new RegExp("^[a-zA-Z]+\\s?");
    if(re.exec(string)==null){
        return false;
    }
    return true;
}

function buttonClick(){
    const buttons = document.querySelectorAll(".button");
    console.log(buttons);
    for(let button of buttons){
        button.onclick = ({target}) =>{
            const data = target.getAttribute("data-key");
            console.log("data : ",data);
            switch (data){
                case "close":
                    modalControl("none");
                    break;
                case "save":
                    setStoreName();
                    modalControl("none");
                    break;
                case "cancel":
                    modalControl("none");
                    break;
                case "setting":
                    modalControl("block");
                    break;
                default:
                    console.log("Hit ",data);
            }
        }
    }
}
// Key click - number, enter, back, clear, save
function keyClick(){
    const keys = document.querySelectorAll("button.key");
    let numberInput = document.getElementById("numberInput");
    for(let key of keys){
        key.onclick = ({target}) => {
            const data = target.getAttribute("data-key");
            if(data == "enter"){
                // prevent blank number
                if(numberInput.innerText == "")
                    return ;
                // The number is duplicated then number order color is changed red.
                if(!isDuplicatedNum(numberInput.innerText)){
                    let currentOrder = document.createElement("div");
                    currentOrder.id = numberInput.innerText;
                    currentOrder.classList.add("order");
                    currentOrder.innerText = numberInput.innerText;

                    // repeat button
                    let repeatButton = document.createElement("button");
                    repeatButton.id = "repeat-" + numberInput.innerText;
                    repeatButton.classList.add("repeat-order");
                    repeatButton.dataset.key = "repeat-order";
                    repeatButton.onclick = function (){
                        let order_id = repeatButton.id.slice(7);
                        let order = document.getElementById(order_id);
                        order.style.color = "red";
                        tts(localStorage.getItem("store-name"),order_id);
                    }
                    repeatButton.innerText = "repeat";
                    currentOrder.append(repeatButton);

                    // delete button
                    let deleteButton = document.createElement("button");
                    deleteButton.id = "delete-" + numberInput.innerText;
                    deleteButton.classList.add("delete-order");
                    deleteButton.classList.add("key");
                    deleteButton.dataset.key = "delete-order";
                    deleteButton.onclick = function (){
                        // oder id is letters over 7 letters.
                        let order_id = deleteButton.id.slice(7);
                        console.log("order_id :", order_id);
                        let order = document.getElementById(order_id);
                        console.log("order : ", order);
                        order.parentElement.removeChild(order);
                        socket.emit("delete_number",order_id);
                    };
                    deleteButton.innerText = "Delete";
                    currentOrder.append(deleteButton);

                    document.getElementById("numberList").prepend(currentOrder);
                    socket.emit("send_number", numberInput.innerText);
                }
                tts(localStorage.getItem("store-name"),numberInput.innerText);

                numberInput.innerText = '';

            }else if(data == "back"){
                numberInput.innerText = numberInput.innerText.slice(0,-1);
            }else if(data == "clear") {
                numberInput.innerText = '';
            }
            else{
                console.log("data : ",data);
                numberInput.innerText += data;
            }
        }
    }
}


function audioPlay(){
    // ding dong sound
    let audioElement = new Audio("../sound/ding-dong-sound.mp3");
    audioElement.play();
}
// order announce
function tts(storeName, number){
    audioPlay();
    setTimeout(()=>{
        // let utterance =  new SpeechSynthesisUtterance(storeName+ "  your number "+number+" is ready");
        let utterance =  new SpeechSynthesisUtterance("  your number "+number+" is ready");
        const synth = window.speechSynthesis;
        utterance.rate = 0.8;
        synth.speak(utterance);
    },2000);
}

// Duplicated order number
function isDuplicatedNum(number){
    const orders = document.querySelectorAll(".numberList div");
    console.log("orders : ", orders);
    for(let order of orders){
        if(order.id == number){
            // Error?
            // Making number red?
            console.log("Number has been notified");
            order.style.color = "red";
            return true;
        }
    }
    return false;
}


window.onload = function (){
    initialStoreNameSetUp();
    buttonClick();
    keyClick();
}

