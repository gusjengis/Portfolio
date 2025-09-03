var windowArr = [];
var windowCounter = 0;
var shortcutArr = [];
var queryString = "";
var currentPage;

window.onload = function () {
        createShortcuts();
        windowArr.push(new Window());
        windowArr[windowArr.length - 1].home();
        windowCounter++;
        windowArr[windowArr.length - 1].setWPercent("96%");
        windowArr[windowArr.length - 1].setHPercent("96%");
        resize();
        canvasOnLoad();
        if (typeof loadPage == "function") {
                loadPage();
        }
        buildTaskbar();
        buildQS();
        resize();
}
window.addEventListener('resize', resize);

function resize() {
        canvasResize();
        for (i = 0; i < windowArr.length; i++) {
                windowArr[i].resizeWindow();
                windowArr[i].resizeFuncs();
        }
}

document.onclick = function () {

        for (i = 0; i < windowArr.length; i++) {
                if (windowArr[i].navBarClicked) {
                        windowArr[i].navBarClicked = false;
                        windowArr[i].fixPos();
                        if (windowArr[i].iframe != null)
                                windowArr[i].iframe.style.pointerEvents = "all";
                }
        }
        // console.log("You're fired");
        // console.log(e.clientX);
        buildQS();
}

let prevClientX;
let prevClientY;
document.onmousemove = function (e) {
        let movementX = e.clientX - prevClientX;
        let movementY = e.clientY - prevClientY;
        prevClientX = e.clientX;
        prevClientY = e.clientY;
        for (i = 0; i < windowArr.length; i++) {
                var windowPointer = windowArr[i];
                if (windowPointer.clicked && windowPointer.window.style.cursor != "default" && windowPointer.window.style.cursor != "") {
                        switch (windowPointer.window.style.cursor) {
                                case "e-resize":
                                        windowPointer.window.style.width = windowPointer.window.getBoundingClientRect().width + movementX + "px";
                                        break;
                                case "w-resize":
                                        windowPointer.window.style.width = windowPointer.window.getBoundingClientRect().width - movementX + "px";
                                        windowPointer.window.style.left = windowPointer.window.getBoundingClientRect().left + movementX + "px";
                                        break;
                                case "s-resize":
                                        windowPointer.window.style.height = windowPointer.window.getBoundingClientRect().height + movementY + "px";
                                        break;
                                case "n-resize":
                                        windowPointer.window.style.height = windowPointer.window.getBoundingClientRect().height - movementY + "px";
                                        windowPointer.window.style.top = windowPointer.window.getBoundingClientRect().top + movementY + "px";
                                        break;
                                case "nw-resize":
                                        windowPointer.window.style.height = windowPointer.window.getBoundingClientRect().height - movementY + "px";
                                        windowPointer.window.style.width = windowPointer.window.getBoundingClientRect().width - movementX + "px";
                                        windowPointer.window.style.left = windowPointer.window.getBoundingClientRect().left + movementX + "px";
                                        windowPointer.window.style.top = windowPointer.window.getBoundingClientRect().top + movementY + "px";
                                        break;
                                case "sw-resize":
                                        windowPointer.window.style.height = windowPointer.window.getBoundingClientRect().height + movementY + "px";
                                        windowPointer.window.style.width = windowPointer.window.getBoundingClientRect().width - movementX + "px";
                                        windowPointer.window.style.left = windowPointer.window.getBoundingClientRect().left + movementX + "px";
                                        break;
                                case "ne-resize":
                                        windowPointer.window.style.height = windowPointer.window.getBoundingClientRect().height - movementY + "px";
                                        windowPointer.window.style.width = windowPointer.window.getBoundingClientRect().width + movementX + "px";
                                        windowPointer.window.style.top = windowPointer.window.getBoundingClientRect().top + movementY + "px";
                                        break;
                                case "se-resize":
                                        windowPointer.window.style.height = windowPointer.window.getBoundingClientRect().height + movementY + "px";
                                        windowPointer.window.style.width = windowPointer.window.getBoundingClientRect().width + movementX + "px";
                                        break;
                        }
                        windowPointer.fixPos2();
                        windowPointer.restore();
                        windowPointer.resizeFuncs();
                        windowPointer.resizeWindow();

                } else if (windowPointer.navBarClicked && ((windowPointer.sizeMode == 0) || (windowPointer.sizeMode != 0 && (e.movementX > 1 || e.movementY > 1)))) {// e.movementX > 1 || e.movementY > 1)){
                        windowPointer.restore();
                        if (windowPointer.fullscreen) {
                                windowPointer.exitFullscreen();
                                windowPointer.x = 0.02 * document.documentElement.clientWidth;
                                windowPointer.y = 0;
                                windowPointer.fixPos();
                        }

                        windowPointer.window.style.left = windowPointer.window.getBoundingClientRect().left + movementX + "px";
                        windowPointer.window.style.top = windowPointer.window.getBoundingClientRect().top + movementY + "px";
                        windowPointer.x += movementX;
                        windowPointer.y += movementY;
                }
        }
}

document.onmousedown = function () {
        for (i = 0; i < windowArr.length; i++) {
                var windowPointer = windowArr[i];
                if (windowPointer.iframe != null) { windowPointer.iframe.style.pointerEvents = "none"; }
        }
}

document.onmouseup = function () {
        for (i = 0; i < windowArr.length; i++) {
                var windowPointer = windowArr[i];
                if (windowPointer.iframe != null) { windowPointer.iframe.style.pointerEvents = "auto"; }
                windowPointer.clicked = false;
                if (windowPointer.sizeMode == 0) {
                        windowPointer.setWPercent(windowPointer.getRawWPercent());
                        windowPointer.setHPercent(windowPointer.getRawHPercent());
                }
        }
}

function clearAllWindows() {
        for (i = 0; i < windowArr.length; i++) {
                windowArr[i].close();
        }
        windowArr = [];
}

/// Query String

function resetQS() {
        queryString = "?";
}

function buildQS() {
        resetQS();
        for (i = 0; i < windowArr.length; i++) {
                queryString += "w" + i + "=" + windowArr[i].getStateString() + "";
                if (i < windowArr.length - 1) {
                        queryString += "+";
                }
        }
        if (windowArr.length == 0) queryString = "";
        window.history.pushState({}, "", currentPage + queryString);
}

// function decimalToBinary(input){
//     if(Math.floor(input/2) == 0){
//         return ""+input%2;
//     }
//     return decimalToBinary(Math.floor(input/2)) + "" + input%2;
// }
