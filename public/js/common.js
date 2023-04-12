export const screenElem = document.documentElement;
export function openFullscreen() {
    if (screenElem.requestFullscreen) {
        screenElem.requestFullscreen();
    } else if (screenElem.webkitRequestFullscreen) { /* Safari */
        screenElem.webkitRequestFullscreen();
    } else if (screenElem.msRequestFullscreen) { /* IE11 */
        screenElem.msRequestFullscreen();
    }
}

/* Close fullscreen */
export function closeFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { /* Safari */
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE11 */
        document.msExitFullscreen();
    }
}
// full screen toggle function
export function toggleFullScreen(){
    console.log("toggle FullScreen");
    if(!document.fullscreenElement){
        openFullscreen();
        console.log("toggle on FullScreen");
    }else{
        closeFullscreen();
        console.log("toggle off FullScreen");
    }
}