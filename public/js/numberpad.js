
// operation number :
// 1 = add
// 0 = delete

const socket = io("http://localhost:3000");
console.log("Test");
console.log(socket);

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

function keyClick(){
    const keys = document.querySelectorAll("button.key");
    let numberInput = document.getElementById("numberInput");
    for(let key of keys){
        key.onclick = ({target}) => {
            const data = target.getAttribute("data-key");
            if(data == "enter"){
                let currentOrder = document.createElement("div");
                currentOrder.id = numberInput.innerText;
                currentOrder.classList.add("order");
                currentOrder.innerText = numberInput.innerText;
                document.getElementById("numberList").append(currentOrder);
                numberInput.innerText = '';
            }else if(data == "back"){
                numberInput.innerText.charAt(numberInput.innerText.length-1);
            }else if(data == "clear"){
                numberInput.innerText = '';
            }else{
                console.log("data : ",data);
                numberInput.innerText+=data;
            }
        }
    }
}





window.onload = function (){
    initialStoreNameSetUp();
    buttonClick();
    keyClick();
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
