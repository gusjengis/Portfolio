class desktopShortcut {
    constructor(name, text, imgSrc, onclick){
        this.name = name;
        this.text = text;
        this.imgSrc = imgSrc;
        this.onclick = onclick;
        this.body;
        this.create();

    }

    create() {
        this.body = createElement("div", this.name, "desktopShortcut", document.getElementById("newWindowMenu"));
        let image = createElement("img", this.name+"Image", "shortcutIcon", this.body);
        createTextElement("p", this.name+"Text", "shortcutText text", this.text, this.body);

        let img = new Image(32,32);
        img.src = this.imgSrc;
        image.src = img.src;

        this.body.onclick = this.onclick;
    }
}

function createWindow() {
    windowArr.push(new Window());
    windowArr[windowArr.length-1].focus();
    windowCounter++;
    buildQS();
    buildTaskbar();
    for(i=0; i<windowArr.length-1; i++){
        windowArr[i].guranteeClickability();
    }

}

function createInitWindow(page, zIndex, xPercent, yPercent, wPercent, hPercent, sizeMode) {
    windowArr.push(new Window());
    windowArr[windowArr.length-1].focus();
    windowCounter++;
    eval("windowArr[windowArr.length-1]."+page);
    windowArr[windowArr.length-1].setZIndex(zIndex);
    windowArr[windowArr.length-1].setXPercent(yPercent);
    windowArr[windowArr.length-1].setYPercent(xPercent);
    windowArr[windowArr.length-1].setWPercent(wPercent);
    windowArr[windowArr.length-1].setHPercent(hPercent);
    windowArr[windowArr.length-1].sizeModeSwitch(Number(sizeMode));
    windowArr[windowArr.length-1].unfixPos();
    windowArr[windowArr.length-1].fixPos();
    buildQS();
    buildTaskbar();
}

const newWindow = function(){
    createWindow();
}

const graph = function(){
    createWindow();
    windowArr[windowArr.length-1].graph();
}

const paint = function(){
    createWindow();
    windowArr[windowArr.length-1].paint();
}
function createShortcuts() {
    // newWindowButton = new desktopShortcut("newWindow", "New Window", "assets/homeIcon.png", newWindow);

    // graphButton = new desktopShortcut("newGraph", "Graph", "assets/graphIcon.png", graph);

    // paintButton = new desktopShortcut("newGraph", "Paint", "assets/graphIcon.png", paint);
}

function buildTaskbar(){
    clearTaskbar();
    let addButton = createElement("div", "newWindowButton", "newWindowButton", document.getElementById("taskbar"));
    createTextElement("h1", "newWindowIcon", "taskbarIconText", "+", addButton);
    addButton.onclick = function(){
        if(windowArr.length<21){
            createWindow();
        }
    }
    for(z=0; z<windowArr.length; z++){
        createTaskbarIcon(windowArr[z], z);
    }
    let clearButton = createElement("div", "clearButton", "clearButton", document.getElementById("taskbar"));
    clearButton.onclick = function(){
        for(m=0; m<windowArr.length; m++){
            windowArr[m].minimize();
        }
    }
}

function createTaskbarIcon(window, index){
    
    let icon = createElement("div", "taskbarIcon"+window.ID, "taskbarIcon", document.getElementById("taskbar"));
    icon.window = window;
    let label = createTextElement("h1", "", "text taskbarIconText", index+1, icon);
    if(window.display == "hidden"){
        icon.classList.add("iconIsMinimized");
        label.classList.add("iconIsMinimized");
    } else if(window.isFocused()){
        icon.classList.add("iconIsFocused");
    }
    
    icon.onclick = function(){
        if(this.window.isFocused()){
            this.window.minimize();
            this.window.window.style.visibility = "hidden";
        } else {
            this.window.focus();
        }
    }   
    icon.addEventListener("mouseenter",function(e){
        for(i=0; i<windowArr.length; i++){
            windowArr[i].window.style.backgroundColor = "rgba(0,0,0,0)";
            windowArr[i].navBar.style.visibility = "hidden";
            windowArr[i].content.style.visibility = "hidden";
            if(windowArr[i].sizeMode < 10){
                windowArr[i].title.style.visibility = "visible";
            }
        }
        this.window.window.style.visibility = "visible";
        this.window.window.style.backgroundColor = "rgba(0,0,0,0.4)";
        this.window.navBar.style.visibility = "inherit";
        this.window.content.style.visibility = "inherit";
        this.window.window.style.zIndex=windowArr.length+1;
    });
    icon.addEventListener("mouseleave", function(){
        for(i=0; i<windowArr.length; i++){
            windowArr[i].window.style.backgroundColor = "rgba(0,0,0,0.4)";
            windowArr[i].navBar.style.visibility = "inherit";
            windowArr[i].content.style.visibility = "inherit";
            windowArr[i].window.style.visibility = windowArr[i].display;
            windowArr[i].setZIndex(windowArr[i].zIndex);
            if(windowArr[i].display == "none"){
                windowArr[i].minimize();
            }
            windowArr[i].minSizeMaintenance();
        }
    });
}

function clearTaskbar(){
    document.getElementById("taskbar").innerHTML = "";
}