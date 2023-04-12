const socket = io("http://localhost:3000");
console.log(socket);

let orderList = [];
let orderDetect;
socket.on("resend_storeName", async ()=>{
    if(window.localStorage.getItem("store-name")!=null)
        await socket.emit("send_storeName",window.localStorage.getItem("store-name"));
})
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
function initialSetUp(){
    if(localStorage.getItem("store-name") == null){
        alertToast("Please set up Store name!","red");
        modalControl("setting-modal","block");
        //Disable cancel button
        let closeButton = document.getElementById("close");
        closeButton.disabled = true;
        let cancelButton = document.getElementById("cancel");
        cancelButton.disabled = true;
        cancelButton.style.background = "gray";
    }else{
        let store_name = localStorage.getItem("store-name")
        //Set store name on banner
        let storeBanner = document.getElementById("storeName");
        storeBanner.innerText = store_name;
        // Set store name on setting input
        let storeNameInput = document.getElementById("store-name");
        storeNameInput.value = store_name;
        // Send storeName if localStorage is not null
        socket.emit("send_storeName",store_name);
    }
    // Fill Speech order
    let orderSpeechInput = document.getElementById("order-speech");
    orderSpeechInput.value = localStorage.getItem("order-speech")==null ? "" : localStorage.getItem("order-speech");
    // Fill Timer duration
    let timerDurationInput = document.getElementById("timer-duration");
    timerDurationInput.value = localStorage.getItem("timer-duration")==null ? "" : localStorage.getItem("timer-duration");
}

function setStoreName(){
    let storeNameInput = document.getElementById("store-name");
    let storeBanner = document.getElementById("storeName");
    let storeName = storeNameInput.value;
    console.log("storeName :",storeName);
    // exception : Store Name is empty
    if(storeName==""){
        // alert
        alertToast("Please insert StoreName","red");
    }
    // exception : Store Name has Front space
    else if(!hasFrontSpace(storeName)){
        // alert
        alertToast("Store name has front space","red");
    }
    else{
        let closeButton = document.getElementById("close");
        closeButton.disabled = false;
        let cancelButton = document.getElementById("cancel");
        cancelButton.disabled = false;
        cancelButton.style.background = "brown";

        window.localStorage.setItem("store-name",storeName);
        storeBanner.innerText = storeName;
        socket.emit("send_storeName",storeName);
        return true;
    }
    // if store name is not defined well, return false not to close modal.
    return false;
}
// Set order-speech on localStorage data
function setOrderSpeech(){
    let orderSpeechInput = document.getElementById("order-speech");
    let orderSpeechValue = orderSpeechInput.value;
    if(orderSpeechValue!==null)
        localStorage.setItem("order-speech",orderSpeechValue);
}
function hasFrontSpace(string){
    const re = new RegExp("^[a-zA-Z]+\\s?");
    if(re.exec(string)==null){
        return false;
    }
    return true;
}

// Toast function
function alertToast(text, color = "green"){
    let alertColor = color == "green"? "linear-gradient(to right, #00b09b, #96c93d)" : "linear-gradient(to right, rgb(255,95,109) , rgb(255,195,113) )";
    Toastify({
        text: text,
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "center", // `left`, `center` or `right`
        stopOnFocus: false, // Prevents dismissing of toast on hover
        style: {
            padding: "2rem",
            fontSize: "2rem",
            background: alertColor,
        },
        onClick: function(){} // Callback after click
    }).showToast();
}

//Guide Modal
let guideModals = document.getElementsByClassName("guide-modal");
let guideContent = document.getElementsByClassName("guide-content");
function guideModalButton(){
    const buttons = document.getElementsByClassName("guide-button");
    console.log("buttons : ", buttons);
    for(let button of buttons){
        button.onclick = ({target}) => {
            const data = target.getAttribute("data-guide");
            console.log("data from guideModalButton : ",data)
            let guideButtons = document.getElementsByClassName("guide-button");
            if(data == "close"){
                modalControl("guide-modal","none");
            }else if(data == "next"){
                guideContent[0].innerText = "Please check board page is on TV Screen";

                // Move to checking board page window is available process button or Close modal
                guideButtons[1].setAttribute("data-guide","closeModal");
                guideButtons[1].innerText = "Yes";
                guideButtons[2].setAttribute("data-guide","newWindow");
                guideButtons[2].innerText = "No";
            }else if(data == "monitor"){
                // Move to monitor turn on process
                guideButtons[1].setAttribute("data-guide","next");
                guideButtons[1].innerText = "I did";
                guideButtons[2].setAttribute("data-guide","help");
                guideButtons[2].innerText = " Need a help";
                guideContent[0].innerText = "Please turn TV on and connect HDMI Cable";
            }else if(data== "help"){
                // Open Guide PDF file
                alertToast("There is No number");
            }else if(data == "newWindow"){
                // close board using socket IO
                socket.emit('close_board',"null");
                // open new board
                window.open("http://localhost:3000/board","_blank","height=800,width=800");
                // in Board
                // Hover mouse then Alert F11 for full screen
                // if It is fullscreen then alert win+shift+ left Arrow keyboard
            }else if(data == "closeModal"){
                guideModals[0].style.display = "none";
                document.getElementById("fullScreen").style.display = "none";
            }
        }
    }
}
//Setting modal button
function settingButtonClick(){
    const buttons = document.querySelectorAll(".button");
    console.log(buttons);
    for(let button of buttons){
        button.onclick = ({target}) =>{
            const data = target.getAttribute("data-key");
            console.log("data : ",data);
            switch (data){
                case "close":
                    modalControl("setting-modal","none");
                    break;
                case "save":
                    if(setStoreName()){
                        setOrderSpeech();
                        setTimerDuration()
                        modalControl("setting-modal","none");
                    }
                    break;
                case "cancel":
                    modalControl("setting-modal","none");
                    break;
                case "setting":
                    modalControl("setting-modal","block");
                    break;
                case "fullscreen":
                    toggleFullScreen();
                    break;
                    // socket.emit('fullscreen_board',"fullscreen_board is working");
                case "help":
                    document.getElementById("fullScreen").style.display = "block";
                    document.getElementById("guide-modal").style.display = "block";
                    break;
                default:
                    console.log("Hit ",data);
            }
        }
    }
}

// Set enter as save button
let keysPressed = {};
document.addEventListener('keydown',(e)=>{
    keysPressed[e.key] = true;
    let fullScreenElem = document.getElementById("fullScreen").style.display;
    let settingModalElem = document.getElementById("setting-modal").style.display;
    if( fullScreenElem == 'block' && settingModalElem == 'block' && keysPressed['Enter']){
        let saveButtonElem = document.getElementById('save');
        saveButtonElem.click();
        console.log("saveButtonElem is clicked");
    }
})
document.addEventListener('keyup', (e)=>{
    delete keysPressed[e.key];
})
function modalControl(modalName,string){
    //open setting pop up
    //Full monitor make dark
    if(string==null)
        return console.log("Need string parameter in modalControl function");
    console.log(string, typeof string);
    let modal = document.getElementById(modalName);
    let fullscreenElement = document.getElementById("fullScreen");
    fullscreenElement.style.display = string;
    modal.style.display = string;
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
                if(numberInput.innerText == "" || formatNumber(numberInput.innerText)=="" ){
                    numberInput.innerText = "";
                    return ;
                }
                // numberInput.innerText = formatNumber(numberInput.innerText);
                createNumber(formatNumber(numberInput.innerText));
                numberInput.innerText = '';
            }else if(data == "back"){
                numberInput.innerText = numberInput.innerText.slice(0,-1);
            }else if(data == "clear") {
                // Clear all order list on Numberpad, Board page
                let numberListElem = document.getElementById("numberList");
                while(numberListElem.firstChild){
                    numberListElem.removeChild(numberListElem.firstChild);
                }
                socket.emit('send_delete_all_orders',"");
            }else if( data == "next" ){
                let numberListElem = document.getElementById("numberList");
                // If there is no Number then alert.
                if(numberListElem.firstChild.id === undefined){
                    alertToast("There is No number","red");
                    return ;
                }
                let nextNum = Number(numberListElem.firstChild.id) + 1;

                // If there is number then preappend next number
                createNumber(nextNum);
            }
            else{
                console.log("data : ",data);
                console.log("numberInput.innerText.length :",numberInput.innerText.length);
                if(numberInput.innerText.length==4){
                    numberInput.innerText = numberInput.innerText.slice(1);
                    alertToast("Order number limit is 4 digit");
                }
                numberInput.innerText += data;
            }
        }
    }
}
function formatNumber(number){
    const re = new RegExp("[1-9]+");
    if(re.exec(number)==null){
        return "";
    }
    return number.slice(re.exec(number).index);
}
// Create number & TTS
// Exception : duplicated
async function createNumber(number){
    // The number is duplicated then number order color is changed red.
    if(!isDuplicatedNum(number)){
        let currentOrder = document.createElement("div");
        currentOrder.id = number;
        currentOrder.classList.add("order");
        currentOrder.innerText = number;

        // repeat button
        let repeatButton = document.createElement("button");
        repeatButton.id = "repeat-" + number;
        repeatButton.classList.add("order-button");
        repeatButton.classList.add("repeat-order");
        repeatButton.dataset.key = "repeat-order";
        repeatButton.onclick = function (e){
            let order_id = repeatButton.id.slice(7);
            let order = document.getElementById(order_id);
            order.style.color = "red";
            // tts(localStorage.getItem("store-name"),order_id);
            orderList.push({number : order_id, operation: "repeat" });
        }
        repeatButton.innerText = "Repeat";
        currentOrder.append(repeatButton);

        // delete button
        let deleteButton = document.createElement("button");
        deleteButton.id = "delete-" + number;
        deleteButton.classList.add("order-button");
        deleteButton.classList.add("delete-order");
        // deleteButton.classList.add("key");
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
        //Create and append Processing bar
        let loadingBarElem = document.createElement("div");
        let progressBarElem = document.createElement("div");
        loadingBarElem.classList.add("loading-bar");
        progressBarElem.classList.add("progress-bar");
        progressBarElem.id = "progress-bar-"+number;
        loadingBarElem.append(progressBarElem);

        currentOrder.append(loadingBarElem);
        // waiting for progressBar exists
        function waitForElm(id){
            return new Promise(resolve => {
                if (document.getElementById(id)) {
                    return resolve(document.getElementById(id));
                }

                const observer = new MutationObserver(mutations => {
                    if (document.getElementById(id)) {
                        resolve(document.getElementById(id));
                        observer.disconnect();
                    }
                });

                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            });
        }
        // waitForElm return element node
        waitForElm("progress-bar-"+number).then((elm)=>{startLoadingBar(elm)});
        document.getElementById("numberList").prepend(currentOrder);
        orderList.push({"number": number, operation: "add"});
    }else{
        // Order number is duplicated
        orderList.push({"number": number, operation: "repeat"});
    }

}

// Order timer
function startLoadingBar(element) {
    console.log(element);
    let width = 0;
    const intervalId = setInterval(() => {
        // timer Duration 1000(1s) * 60 * customizing input
        let timerDuration = localStorage.getItem("timerDuration")===null? 180000 : localStorage.getItem("timerDuration");
        let loadingSpeed = 100/timerDuration;
        console.log("loadingSpeed : ", loadingSpeed);
        width += loadingSpeed;
        element.style.width = width + '%';
        if (width >= 100) {
            clearInterval(intervalId);
            let number = element.id;
            number = number.slice(13);
            console.log("number is ",number);
            let orderElem = document.getElementById(number);
            orderElem.parentElement.removeChild(orderElem);
            socket.emit("delete_number",number);
        }
    }, 1000);
}

//Set up the local storage timerDuration value
function setTimerDuration(){
    const timerDurationInput = document.getElementById("timer-duration");
    let timerDuration = timerDurationInput.value;
    console.log(timerDuration);
    if(timerDuration != ""){
        localStorage.setItem("timer-duration",timerDuration);
        console.log("timer-duration has been changed");
    }
}

// Ding Dong Sound
function audioPlay(){
    return new Promise((res,rej)=>{
        let audioElement = new Audio("../sound/ding-dong-sound.mp3");
        audioElement.play();
        audioElement.onplay = ()=>{
            clearInterval(orderDetect);
        }
        audioElement.addEventListener("ended",(e)=>{
            res(console.log("AudioPlay stopped"));
        });
    })
}

let speech_voices;
function setVoice(){
    if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = function() {
            speech_voices = window.speechSynthesis.getVoices();
            console.log(speech_voices);
        };
        console.log("SpeechSynthesis is in window");
    }
}
/*
* It seems that the voices array is empty on the first call. From what I read it has something to do with an asynchronous call to load the voices. So, it's always empty the first time it's called. For me this did the magic:
* */

/*
 order announce if order is on orderList
 send order number to board to announce order.
*/
async function tts(){
    // console.log("tts active");
    // console.log("orderList :",orderList);
    let orderSpeech = localStorage.getItem('order-speech')===null ? "" : localStorage.getItem('order-speech') ;
    // Play tts if order is in order List
    if(orderList.length > 0){
        // get orderList.shift first because of await audio play function
        let orderObj = orderList.shift();
        let number = orderObj['number'];
        let utterance =  new SpeechSynthesisUtterance( orderSpeech+ " " + number);
        //Send number and operation first for board page.
        socket.emit("send_number", orderObj);
        await audioPlay();
        // let utterance =  new SpeechSynthesisUtterance(storeName+ "  your number "+number+" is ready");
        utterance.rate = 0.8;
        // let voices = window.speechSynthesis.getVoices();
        // MicroSoft doesn't have Google US English
        utterance.voice = speech_voices.filter(function(voice){ return voice.name == 'Microsoft Zira - English (United States)'; })[0];
        console.log("Speech voice : ",speech_voices.filter(function(voice){ return voice.name == 'Microsoft Zira - English (United States)'; })[0]);
        speechSynthesis.speak(utterance);
        utterance.onend = (e) => {
            socket.emit('send_close_alert',"Test now");
            orderDetect = setInterval(tts, 1000);
        }

    }
}

orderDetect = setInterval(tts,1000);

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


//Full Screen function
let screenElem = document.documentElement;
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
        alertToast("Full Screen!");
        console.log("toggle on FullScreen");
    }else{
        closeFullscreen();
        console.log("toggle off FullScreen");
        alertToast("Please click Full Screen button to make fullscreen");
    }
}

window.onload = function (){
    initialSetUp();
    settingButtonClick();
    keyClick();
    guideModalButton();
    setVoice();
}

