class Window {
        constructor() {
                this.ID = windowCounter;
                this.fullscreen = false;
                this.left = 2 * (windowArr.length + 1) - 39 * Math.floor(windowArr.length / 21);
                this.top = 2 * (windowArr.length + 1) - 42 * Math.floor(windowArr.length / 21);
                this.x = document.documentElement.clientWidth * this.left / 100;
                this.y = document.documentElement.clientHeight * this.top / 100;
                this.width = '56%';
                this.height = '56%';
                this.clicked = false;
                this.navBarClicked = false;
                this.window;
                this.navBar;
                this.content;
                this.navBarText = [];
                this.navBarButton = [];
                this.demoLinks = [];
                this.page;
                this.pagePast = [];
                this.pageFuture = [];
                this.lastPage;
                this.iframe;
                this.display = "visible";
                this.roundedEdges = true;
                this.minWidth = 640;
                this.minHeight = 480;
                this.title;
                this.zIndex = windowArr.length;
                this.sizeMode = 0;
                this.pageSpecificResizeFuncs = [];
                this.links = {
                        "projects-perlin": new LinkDef("h4", "projects-perlin" + this.ID, "Perlin Noise", "Rust | July 2023", "assets/perlinThumb.png", false, "Implemented perlin noise on the GPU from scratch. Used a few layers of this noise to generate some basic terrain. Using this to work out some 3D rendering and lighting.", "perlin"),
                        "projects-gol": new LinkDef("h4", "projects-gol" + this.ID, "Game of Life", "Rust | June 2023", "assets/golThumb.png", false, "Conway's Game of Life. Used WebGPU compute shaders for this, runs really well, but requires a browser that supports it(Chrome or Edge rn).", "gol"),
                        "projects-webGPU": new LinkDef("h4", "projects-webGPU" + this.ID, "WebGPU", "Rust | May 2023", "assets/WGPUThumb.png", false, "WebGPU Test, programmed in Rust and compiled to WASM. Can compile this to native as well. Write once, run anywhere, very cool.", "webGPU"),
                        "projects-pLife": new LinkDef("h4", "projects-pLife" + this.ID, "Particle Life", "JS | January 2023", "assets/pLifeThumb.png", false, "Particle Life, inspired by this video: https://www.youtube.com/watch?v=p4YirERTVF0", "pLife"),
                        "projects-webGL": new LinkDef("h4", "projects-webGL" + this.ID, "WebGL", "JS | December 2022", "assets/webGLThumb.png", false, "I'm trying to learn webGL, this is the program I'm using to do that. It will showcase the effects I've come up with.", "webGL"),
                        "projects-oscilloscopevideo": new LinkDef("h4", "projects-oscilloscopevideo" + this.ID, "Oscilloscope Video", "JS | September 2022", "assets/oscilloscopeThumb.png", false, "I use this to provide video input to my CRT oscilloscope.", "oscilloscopeVideo"),
                        "projects-oscilloscope": new LinkDef("h4", "projects-oscilloscope" + this.ID, "CRT Oscilloscope", "Electronics | September 2022", "assets/CRTOscilloscopeThumb.png", true, "Fun electronics project, rewired a portable color CRT into a color X/Y oscilloscope/plotter. Image is controlled by audio(X/Y) and composite(Color).", "oscilloscopeCover"),
                        "projects-wireframe": new LinkDef("h4", "projects-wireframe" + this.ID, "Wireframe", "JS | March 2022", "assets/wireframeThumb.png", false, 'Generates a wireframe triangle, click to add more points to the "model".', "wireframe"),
                        "projects-handheld": new LinkDef("h4", "projects-handheld" + this.ID, "Arduino Handheld", "Electronics/C++ | August 2021", "assets/handheldThumb.png", true, "Arduino based handheld, looks a bit like a DS.", "handheld"),
                        "projects-crt": new LinkDef("h4", "projects-crt" + this.ID, "CRT", "JS | April 2021", "assets/crtThumb.png", false, "This one is pretty cool. You give it an image and after some major lag, it draws it with a shadow mask CRT filter. Looks pretty cool with the right input.", "crt"),
                        "projects-spacegame": new LinkDef("h4", "projects-spacegame" + this.ID, "Spacegame", "Java | June 2021", "assets/spacegameThumb.png", false, "Shoot em'up made in Java. Has a really cool star field effect.", "spacegameCover"),
                        "projects-3d": new LinkDef("h4", "projects-3d" + this.ID, "Minecraft Demo", "JS | Spring 2021", "assets/minecraftDemoThumb.png", true, "A VERY basic Minecraft clone. The result of experimenting with Three.js.", "minecraftDemo"),
                        "projects-morse": new LinkDef("h4", "projects-morse" + this.ID, "Morse Code", "JS | April 2021", "assets/morseThumb.png", false, "English to Morse Code translator. Vertically stacked.", "morse"),
                        "projects-linetest": new LinkDef("h4", "projects-linetest" + this.ID, "Line Test", "JS | April 2021", "assets/lineTestThumb.png", true, "Test of a line drawing algorithm. Pointless, but I made it.", "linetest"),
                        "projects-sound": new LinkDef("h4", "projects-sound" + this.ID, "Synthesizer", "JS | July 2020", "assets/soundThumb.png", true, "This is a simple synthesizer, takes a frequency and wave type. Plays the sound and draws an approximation of the sound wave with math.", "synth"),
                        "projects-snowflake": new LinkDef("h4", "projects-snowflake" + this.ID, "Snowflake Generator", "JS | November 2019", "assets/smallSnowflakeThumb.png", true, "Randomly generates snowflakes. Snowflakes can be animated and modified.", "snowflake"),
                        "projects-platformer": new LinkDef("h4", "projects-platformer" + this.ID, "Platformer", "JS | Summer 2019", "assets/platformerThumb.png", false, "This was my first attempt at a game, It's left unfinished and it's kinda horrible, but I learned a lot from it.", "platformer"),
                        "projects-graph": new LinkDef("h4", "projects-graph" + this.ID, "Graphing Calculator", "JS | Spring 2019", "assets/graphThumb.png", true, "This was my first program. It graphs Cartesian, Polar, and Parametric functions.", "graph"),
                        "projects-keyboard": new LinkDef("h4", "projects-keyboard" + this.ID, "C64 Keyboard Adapter", "C++ | August 2021", "assets/K64Thumb.png", true, "Arduino Leonardo based Commodore 64 keyboard adapter. Allows a Commodore 64 to be used as a USB keyboard.", "notFound"),
                        "projects-gba": new LinkDef("h4", "projects-gba" + this.ID, "GBA Snowflake Generator", "C | February 2021", "assets/gbaThumb.png", true, "Port of my snowflake generator to the Game Boy Advance.", "gbaCover"),
                        "projects-dino": new LinkDef("h4", "projects-dino" + this.ID, "C64 Dino Platformer", "C64 BASIC | September 2020", "assets/dinoThumb.png", false, "C64 platformer. It's really just a sprite that can walk and jump.", "notFound"),
                };

                this.create();
                this.projects();
                buildQS();
                this.setZIndex(windowArr.length);
                this.resizeWindow();
                this.resizeFuncs();
        }

        create() {
                this.window = createElement("div", "window" + this.ID, "window", document.getElementById("desktop"));
                createElement("div", "navBarSpacer" + this.ID, "navBarSpacer", this.window);
                this.navBar = createElement("div", "navBar" + this.ID, "navBar", this.window);
                this.navBarText[0] = createTextElement("h4", "home" + this.ID, "navBarText navBarPageText text link", "Home", this.navBar);
                this.navBarText[1] = createTextElement("h4", null, "navBarText navBarPageText text", "|", this.navBar);
                this.navBarText[2] = createTextElement("h4", "projects" + this.ID, "navBarText navBarPageText text link", "Projects", this.navBar);
                this.navBarText[3] = createTextElement("h4", null, "navBarText navBarPageText text", "|", this.navBar);
                this.navBarText[4] = createTextElement("h4", "resume" + this.ID, "navBarText navBarPageText text link", "Resume", this.navBar);
                // this.navBarText[5] = createTextElement("h4", null, "navBarText navBarPageText text", "|", this.navBar);
                // this.navBarText[6] = createTextElement("h4", "about"+this.ID, "navBarText navBarPageText text link", "About", this.navBar);
                this.navBarButton[0] = createTextElement("button", "xButton" + this.ID, "windowButton xButton text cornerButton", '\u2A2F', this.navBar);
                this.navBarButton[1] = createTextElement("button", "maxButton" + this.ID, "windowButton maxButton text", '\u25A2', this.navBar);
                this.navBarButton[2] = createTextElement("button", "fullButton" + this.ID, "windowButton fullButton text", '\u2922', this.navBar);
                this.navBarButton[3] = createTextElement("button", "refreshButton" + this.ID, "windowButton refreshButton text", '\u27F3', this.navBar);
                this.navBarButton[4] = createTextElement("button", "controlsButton" + this.ID, "windowButton controlsButton text", '\u003F', this.navBar);
                this.navBarButton[5] = createTextElement("button", "minButton" + this.ID, "windowButton minButton text", '\u2212', this.navBar);
                this.content = createElement("div", "content" + this.ID, "contentDiv", this.window);
                this.title = createTextElement("h4", "title" + this.ID, "title text", this.title, this.navBar);
                // this.setTitle("Home");

                this.window.owner = this;
                this.roundEdges();

                this.window.onmousedown = function () {
                        this.owner.focus();
                        if (this.style.cursor != "default") {
                                this.owner.clicked = true;
                        }

                }

                this.window.onmouseup = function (e) {
                        const canvasWidth = document.documentElement.clientWidth;
                        if (e.clientX <= 5 && this.getBoundingClientRect().left < 5) {
                                this.owner.dockLeft();
                                this.owner.focus();
                        } else if (e.clientX >= canvasWidth - 5 && this.getBoundingClientRect().right > canvasWidth - 5) {
                                this.owner.dockRight();
                                this.owner.focus();
                        }
                        if (e.button == 4) this.owner.pageUp();
                        if (e.button == 3) this.owner.pageDown();
                }

                this.window.onmousemove = function (e) {
                        //console.log(this.owner.iframe);
                        if (!this.owner.clicked && this.owner.sizeMode == 0) {
                                if (e.clientX > this.getBoundingClientRect().left - 3 && e.clientX < this.getBoundingClientRect().left + 3) {
                                        this.style.cursor = "w-resize";
                                        this.style.userSelect = "none";
                                        if (this.owner.iframe != null) this.owner.iframe.style.pointerEvents = "all";
                                } else if (e.clientX > this.getBoundingClientRect().right - 3 && e.clientX < this.getBoundingClientRect().right + 3) {
                                        this.style.cursor = "e-resize";
                                        this.style.userSelect = "none";
                                        if (this.owner.iframe != null) this.owner.iframe.style.pointerEvents = "all";
                                } else if (e.clientY > this.getBoundingClientRect().top - 3 && e.clientY < this.getBoundingClientRect().top + 3) {
                                        this.style.cursor = "n-resize";
                                        this.style.userSelect = "none";
                                        if (this.owner.iframe != null) this.owner.iframe.style.pointerEvents = "all";
                                } else if (e.clientY > this.getBoundingClientRect().bottom - 3 && e.clientY < this.getBoundingClientRect().bottom + 3) {
                                        this.style.cursor = "s-resize";
                                        this.style.userSelect = "none";
                                        if (this.owner.iframe != null) this.owner.iframe.style.pointerEvents = "all";
                                } else if (!this.owner.clicked) {
                                        this.style.cursor = "default";
                                        this.style.userSelect = "auto";
                                        //if(this.owner.iframe != null) this.owner.iframe.style.pointerEvents = "none";

                                }

                                if (e.clientX > this.getBoundingClientRect().left - 12 && e.clientX < this.getBoundingClientRect().left + 12 && e.clientY > this.getBoundingClientRect().top - 12 && e.clientY < this.getBoundingClientRect().top + 12) {
                                        this.style.cursor = "nw-resize";
                                        this.style.userSelect = "none";
                                        if (this.owner.iframe != null) this.owner.iframe.style.pointerEvents = "all";
                                } else if (e.clientX > this.getBoundingClientRect().left - 12 && e.clientX < this.getBoundingClientRect().left + 12 && e.clientY > this.getBoundingClientRect().bottom - 12 && e.clientY < this.getBoundingClientRect().bottom + 12) {
                                        this.style.cursor = "sw-resize";
                                        this.style.userSelect = "none";
                                        if (this.owner.iframe != null) this.owner.iframe.style.pointerEvents = "all";
                                } else if (e.clientX > this.getBoundingClientRect().right - 12 && e.clientX < this.getBoundingClientRect().right + 12 && e.clientY > this.getBoundingClientRect().top - 12 && e.clientY < this.getBoundingClientRect().top + 12) {
                                        this.style.cursor = "ne-resize";
                                        this.style.userSelect = "none";
                                        if (this.owner.iframe != null) this.owner.iframe.style.pointerEvents = "all";
                                } else if (e.clientX > this.getBoundingClientRect().right - 12 && e.clientX < this.getBoundingClientRect().right + 12 && e.clientY > this.getBoundingClientRect().bottom - 12 && e.clientY < this.getBoundingClientRect().bottom + 12) {
                                        this.style.cursor = "se-resize";
                                        this.style.userSelect = "none";
                                        if (this.owner.iframe != null) this.owner.iframe.style.pointerEvents = "all";
                                }
                        }
                }

                this.navBarText[0].onclick = function () {
                        this.parentElement.parentElement.owner.home();
                }
                this.navBarText[2].onclick = function () {
                        this.parentElement.parentElement.owner.projects();
                }
                this.navBarText[4].onclick = function () {
                        this.parentElement.parentElement.owner.resume();
                }

                this.navBar.onmousedown = function () {
                        this.parentElement.owner.navBarClicked = true;
                        this.parentElement.owner.unfixPos();
                        if (this.parentElement.owner.iframe != null) {
                                //this.parentElement.owner.iframe.style.pointerEvents = "none";
                        }
                }

                this.navBar.onmouseup = function () {
                        this.parentElement.owner.navBarClicked = false;
                        if (!this.parentElement.owner.fullscreen) {
                                this.parentElement.owner.fixPos();
                                if (this.parentElement.getBoundingClientRect().top < 0) {

                                        this.parentElement.owner.toggleFullscreen();
                                }

                        }
                        if (this.parentElement.owner.iframe != null) {
                                this.parentElement.owner.iframe.style.pointerEvents = "all";
                        }
                }

                this.navBarButton[0].onclick = function () {
                        this.parentElement.parentElement.owner.close();
                }

                this.navBarButton[1].onclick = function () {
                        this.parentElement.parentElement.owner.toggleFullscreen();
                };

                this.navBarButton[2].onclick = function () {
                        let iframe = this.parentElement.parentElement.owner.iframe;
                        if (iframe != null) {
                                // iframe.webkitRequestFullscreen();
                                iframe.requestFullscreen();
                        }
                }

                this.navBarButton[3].onclick = function () {
                        let iframe = this.parentElement.parentElement.owner.iframe;
                        if (iframe != null) {
                                iframe.src = iframe.src;
                        }
                }

                this.navBarButton[4].onclick = function () {
                        this.parentElement.parentElement.owner.help();
                }

                this.navBarButton[5].onclick = function () {
                        this.parentElement.parentElement.owner.minimize();
                }

                this.navBar.ondblclick = function () {
                        this.parentElement.owner.toggleFullscreen();
                }

                this.linkHoverStyling();

                this.initSizing();
                this.setZIndex(this.zIndex);
                buildQS();
        }

        getXPercent() {

                return Math.round(100 * Number(getComputedStyle(this.window).left.replace('px', '').replace("%", '')) / Number(getComputedStyle(document.getElementById("desktop")).width.replace('px', '').replace("%", '')) * 100) / 100 + "%";
        }

        getYPercent() {
                return Math.round(100 * Number(getComputedStyle(this.window).top.replace('px', '').replace("%", '')) / Number(document.getElementById("desktop").clientHeight) * 100) / 100 + "%";
        }

        getWPercent() {
                return Math.round(Number(100 * this.width.replace('px', '').replace("%", ''))) / 100 + "%";
        }

        getHPercent() {
                return Math.round(Number(100 * this.height.replace('px', '').replace("%", ''))) / 100 + "%";
        }

        getRawWPercent() {
                return Number(getComputedStyle(this.window).width.replace('px', '').replace("%", '')) / Number(getComputedStyle(document.getElementById("desktop")).width.replace('px', '').replace("%", '')) * 100 + "%";
        }

        getRawHPercent() {
                return Number(getComputedStyle(this.window).height.replace('px', '').replace("%", '')) / Number(document.getElementById("desktop").clientHeight) * 100 + "%";
        }

        setXPercent(percent) {
                this.x = percent;
        }

        setYPercent(percent) {
                this.y = percent;
        }

        setWPercent(percent) {
                this.width = percent;
        }

        setHPercent(percent) {
                this.height = percent;
        }

        changePage(page) {
                this.pageSpecificResizeFuncs = [];
                currentPage = page;
                if (this.pagePast != null) {
                        this.pagePast.push(page);
                }
                //this.pageFuture = [];
                this.page = page;
                buildQS();
        }

        getStateString() {
                let state = "";
                if (this.iframe != null) {
                        //console.log(this.iframe.clear());
                        // if(typeof(this.iframe.clear()) == "function"){
                        //     state = this.iframe.clear();
                        // }
                }
                let stateString = this.page + "(" + state + "):" + this.zIndex + ":" + this.getXPercent() + ":" + this.getYPercent() + ":" + this.getWPercent() + ":" + this.getHPercent() + ":" + this.sizeMode;
                stateString = stateString.replaceAll('%', '!');
                return stateString;
        }

        dockLeft() {
                this.sizeMode = 2;
                this.window.style = '';
                this.window.classList.add("dockedLeft");
                this.squareEdges();
                this.maintainNavBarText();
                this.maintainContentSize();
                this.resizeFuncs();
        }

        dockRight() {
                this.sizeMode = 3;
                this.window.style = '';
                this.window.classList.add("dockedRight");
                this.squareEdges();
                this.maintainNavBarText();
                this.maintainContentSize();
                this.resizeFuncs();
        }

        clear() {
                this.pageSpecificResizeFuncs = [];
                this.content.innerHTML = "";
                this.iframe = null;
                this.hideDemoButtons();
                if (this.roundedEdges) {
                        this.roundEdges();
                } else {
                        this.squareEdges();
                }

                this.maintainFullscreen();


        }

        home() {
                if (this.page != "home") {
                        this.clear();
                        this.setTitle("Home");
                        this.changePage("home");
                        //createTextElement("h1", "home-header"+this.ID, "text", "Home", this.content);
                        // createTextElement("p", "home-desc"+this.ID, "text", "Welcome to my portfolio. You might view it in fullscreen (F11).", this.content);
                        // createTextElement("p", "home-desc"+this.ID, "text", 'With the minor exception of my "Minecraft Demo"(I used three.js), this website, and all demos/documented projects I'+'\u0027'+'ve done by myself from scratch.', this.content);
                        // createTextElement("h3", "home-desc"+this.ID, "text", "This site is under construction", this.content);
                        // createTextElement("h3", "home-desc"+this.ID, "text", 'If you want the "intended experience", I'+'\u0027'+'m developing on Windows, with Edge/Chrome.', this.content);
                        let container = createElement("div", "", "homeContainer", this.content);
                        let background = createElement("div", "", "homeBackground", container);
                        let logo = createImageElement("assets/landingGraphic.png", "agreenwebLogo" + this.ID, "agreenwebLogo", background);

                        // let introDiv = createElement("div", "homeIntroDiv"+this.ID, "homeIntroDiv", background);
                        // let introText = createTextElement("h1", "", "homeIntroText text", "\
                        // Anthony Green, 19<br>\
                        // CS Major at UW, Senior<br>\n\
                        // Interested in electronics and graphics programming<br>\
                        // I try to do everything from scratch<br>\
                        // Scroll down to start exploring\
                        // ", introDiv);

                        // this.window.owner.pageSpecificResizeFuncs.push(
                        //     function(ID) {
                        //         let imageElement = document.getElementById("agreenwebLogo"+ID);
                        //         let textElement = document.getElementById("homeIntroDiv"+ID);
                        //         console.log(textElement)
                        //         if(textElement.getBoundingClientRect().left < imageElement.getBoundingClientRect().right+30){
                        //             textElement.style.visibility = "hidden";
                        //         } else if(textElement.parentElement.parentElement.parentElement.parentElement.style.visibility != "hidden") {
                        //             textElement.style.visibility = "visible";
                        //         }
                        //     }
                        // );

                        // this.window.owner.pageSpecificResizeFuncs[0](this.ID);
                        //pLife Highlight
                        let pLife = createElement("div", "", "projectHighlightDiv", this.content);
                        pLife.onclick = function () {
                                let windowPointer = this.parentElement.parentElement.owner;
                                windowPointer.pLife();
                        }
                        // let pLifeDesc = createElement("div", "", "projectDescDivLeft", pLife);
                        // createTextElement("h1", "", "projectHighlightTitle text", "Particle Life", pLifeDesc);
                        // createTextElement("p", "", "projectHighlightDesc text", "\
                        // My implementation of Particle Life, inspired by <a href='https://www.youtube.com/watch?v=p4YirERTVF0' class='clickableLink'>this video</a>. <br>\
                        // <br>\
                        // From a few simple rules, partlicle life produces some interesting emergent behavior. <br>\
                        // <p class=''> Particles have a position, velocity, and color. <br><br>\
                        // Particles push and pull on each other based on color and proximity. <br><br>\
                        // Each color has it's own set of rules for how it interacts with each other color. \
                        // Ex: Red might be attracted to green but repulsed by yellow. <br><br>\
                        // Beyond a certain radius, particles don't interact.<br><br>\
                        // Within a certain radius, particles always repel.<br><br></p>\
                        // <br>\
                        // <br>\
                        // Implemented using WebGL. \
                        // Used <a href='https://github.com/tom-mohr/particle-life-app' class='clickableLink'>this repo</a> for reference.<br>\
                        // ", pLifeDesc);
                        let pLifeVid = createElement("div", "", "projectVidDiv", pLife);
                        pLife.style.setProperty('top', "25px");
                        createVideoElement("iframe", "videoHero" + this.ID, "videoHero", "https://www.youtube.com/embed/YzxCYXmIBpA?mute=1&autoplay=1&disablekb=1&color=red&modestbranding=1&controls=0&showinfo=0&playlist=YzxCYXmIBpA&loop=1&vq=hd2160", pLifeVid);
                        createTextElement("h1", "", "projectVidLabel text", "Particle Life", pLife);
                        //WebGL Highlight
                        // let WebGL = createElement("div", "", "projectHighlightDiv", this.content);
                        // WebGL.onclick = function() {
                        //     let windowPointer = this.parentElement.parentElement.owner;
                        //     windowPointer.webGL();
                        // }
                        // let WebGLVid = createElement("div", "", "projectVidDivLeft", WebGL);
                        // let WebGLDesc = createElement("div", "", "projectDescDivRight", WebGL);
                        // createTextElement("h1", "", "projectHighlightTitle text", "WebGL", WebGLDesc);
                        // createTextElement("p", "", "projectHighlightDesc text", "\
                        // desc\
                        // \
                        // ", WebGLDesc);
                        // WebGL.style.setProperty('top', "50px");
                        // createVideoElement("iframe", "videoHero"+this.ID, "videoHero", "https://www.youtube.com/embed/M6iustj7Sok?mute=1&autoplay=1&disablekb=1&color=red&modestbranding=1&controls=0&showinfo=0&playlist=M6iustj7Sok&loop=1&vq=hd1080", WebGLVid);
                        //Handheld Highlight
                        // let handheld = createElement("div", "", "projectHighlightDiv", this.content);
                        // handheld.onclick = function() {
                        //     let windowPointer = this.parentElement.parentElement.owner;
                        //     windowPointer.handheldCover();
                        // }
                        // let handheldDesc = createElement("div", "", "projectDescDivLeft", handheld);
                        // createTextElement("h1", "", "projectHighlightTitle text", "Arduino Handheld", handheldDesc);
                        // createTextElement("p", "", "projectHighlightDesc text", "\
                        // desc\
                        // \
                        // ", handheldDesc);
                        // let handheldVid = createElement("div", "", "projectVidDivRight", handheld);

                        // handheld.style.setProperty('top', "75px");
                        // createVideoElement("iframe", "videoHero"+this.ID, "videoHero", "https://www.youtube.com/embed/M6iustj7Sok?mute=1&autoplay=1&disablekb=1&color=red&modestbranding=1&controls=0&showinfo=0&playlist=M6iustj7Sok&loop=1&vq=hd1080", handheldVid);
                        //Snowflake Highlight
                        let snowflake = createElement("div", "", "projectHighlightDiv", this.content);
                        snowflake.onclick = function () {
                                let windowPointer = this.parentElement.parentElement.owner;
                                windowPointer.snowflake();
                        }
                        let snowflakeVid = createElement("div", "", "projectVidDiv", snowflake);
                        snowflake.style.setProperty('top', "50px");
                        createVideoElement("iframe", "videoHero" + this.ID, "videoHero", "https://www.youtube.com/embed/wNazHtV2qvE?mute=1&autoplay=1&disablekb=1&color=red&modestbranding=1&controls=0&showinfo=0&playlist=wNazHtV2qvE&loop=1&vq=hd2160", snowflakeVid);
                        createTextElement("h1", "", "projectVidLabel text", "Snowflake Generator", snowflake);


                        let handheld = createElement("div", "", "projectHighlightDiv", this.content);
                        handheld.onclick = function () {
                                let windowPointer = this.parentElement.parentElement.owner;
                                windowPointer.handheld();
                        }
                        let handheldVid = createElement("div", "", "projectVidDiv", handheld);
                        handheld.style.setProperty('top', "75px");
                        createVideoElement("iframe", "videoHero" + this.ID, "videoHero", "https://www.youtube.com/embed/dfGmsPzAXeY?mute=1&autoplay=1&disablekb=1&color=red&modestbranding=1&controls=0&showinfo=0&playlist=dfGmsPzAXeY&loop=1&vq=hd2160", handheldVid);
                        createTextElement("h1", "", "projectVidLabel text", "Arduino Handheld", handheld);
                        //WebGL Highlight
                        //Oscilloscope Highlight

                        let oscilloscope = createElement("div", "", "projectHighlightDiv", this.content);
                        oscilloscope.onclick = function () {
                                let windowPointer = this.parentElement.parentElement.owner;
                                windowPointer.oscilloscopeCover();
                        }
                        let oscilloscopeVid = createElement("div", "", "projectVidDiv", oscilloscope);
                        oscilloscope.style.setProperty('top', "100px");
                        createVideoElement("iframe", "videoHero" + this.ID, "videoHero", "https://www.youtube.com/embed/8AeXTpFbZOU?mute=1&autoplay=1&disablekb=1&color=red&modestbranding=1&controls=0&showinfo=0&playlist=8AeXTpFbZOU&loop=1&vq=hd2160", oscilloscopeVid);
                        createTextElement("h1", "", "projectVidLabel text", "CRT Oscilloscope", oscilloscope);

                        //Spacegame Highlight

                        this.window.owner.pageSpecificResizeFuncs.push(
                                function (ID) {
                                        let elements = document.getElementsByClassName("videoHero");
                                        for (i = 0; i < elements.length; i++) {
                                                let viewAspect = elements[i].parentElement.clientWidth / elements[i].parentElement.clientHeight;
                                                let vidAspect = 16 / 9;
                                                let scaleBy = viewAspect / vidAspect;
                                                let imageScale;
                                                if (scaleBy > 1) {
                                                        imageScale = 110 * scaleBy;
                                                } else {
                                                        imageScale = 110 * 1 / scaleBy;
                                                }
                                                let offset = Math.abs((imageScale - 100) / 2);

                                                elements[i].style.width = imageScale + "%";
                                                elements[i].style.height = imageScale + "%";
                                                elements[i].style.left = -offset + "%";
                                                elements[i].style.top = -offset + "%";
                                        }
                                }
                        );

                        this.window.owner.pageSpecificResizeFuncs[0](this.ID);

                        let demos = createElement("div", "", "homeDemosDiv", this.content);
                        demos.style.setProperty('top', "125px");
                        this.content.owner = this.window.owner;

                        createLink(this.links["projects-perlin"], demos);
                        createLink(this.links["projects-gol"], demos);
                        createLink(this.links["projects-webGPU"], demos);
                        createLink(this.links["projects-pLife"], demos);
                        createLink(this.links["projects-webGL"], demos);
                        createLink(this.links["projects-oscilloscopevideo"], demos);
                        createLink(this.links["projects-oscilloscope"], demos);
                        createLink(this.links["projects-wireframe"], demos);
                        createLink(this.links["projects-handheld"], demos);
                        createLink(this.links["projects-crt"], demos);
                        createLink(this.links["projects-spacegame"], demos);
                        createLink(this.links["projects-3d"], demos);
                        createLink(this.links["projects-morse"], demos);
                        createLink(this.links["projects-linetest"], demos);
                        createLink(this.links["projects-sound"], demos);
                        createLink(this.links["projects-snowflake"], demos);
                        createLink(this.links["projects-platformer"], demos);
                        createLink(this.links["projects-graph"], demos);
                }
        }

        todo() {
                if (this.page != "todo") {
                        this.clear();
                        createTextElement("h2", "home-desc" + this.ID, "text", "Undocumented Projects", this.content);
                        createTextElement("p", "home-desc" + this.ID, "text", "GBA Snowflake Port | C", this.content);
                        createTextElement("p", "home-desc" + this.ID, "text", "Spacegame | Java", this.content);
                        createTextElement("p", "home-desc" + this.ID, "text", "3D-Printed Arduino-Based Handheld | C++", this.content);
                        createTextElement("p", "home-desc" + this.ID, "text", "C64 Keyboard Adapter | C++/C64 Basic", this.content);
                        createTextElement("p", "home-desc" + this.ID, "text", "Misc C64 Programs | C64 Basic/C", this.content);
                        createTextElement("p", "home-desc" + this.ID, "text", "Rust-WASM Programs | Rust/JS", this.content);
                        createTextElement("p", "home-desc" + this.ID, "text", "Pixel Shader Image Filter | JS", this.content);
                        createTextElement("p", "home-desc" + this.ID, "text", "A Few More Tiny Projects | JS", this.content);
                        createTextElement("h2", "", "text", "To Do:", this.content);
                        createTextElement("p", "", "text todoItem", "-Make a real home page", this.content);
                        createTextElement("p", "", "text todoItem", "-Make a real demo page", this.content);
                        createTextElement("p", "", "text todoItem", "-Figure out how to detect mobile and simplify the site, drop the windows-style GUI", this.content);
                        createTextElement("p", "", "text todoItem", "-Test on all web platforms, deal with any styling issues that pop up", this.content);
                        createTextElement("p", "", "text todoItem", "-Figure out how to get around Firefox not supporting backdrop-filter: blur (WTF why?! Get on that Mozilla, so dumb.)", this.content);
                        createTextElement("p", "", "text todoItem", "-Remodel projects page, it looks okay on my 4k screen, but tests of 1080p look awful", this.content);
                        createTextElement("p", "", "text todoItem", "-Figure out some alternative to the 'try me' button, it's looks bad", this.content);
                        createTextElement("p", "", "text todoItem", "-Figure out how to do tables, need tables for listing controls && functions supported by graph", this.content);
                        createTextElement("p", "", "text todoItem", "-Figure out why navbar text sometimes gets wiped when restoring from minimize", this.content);
                        createTextElement("p", "", "text todoItem", "-Make windows resizeable", this.content);
                        createTextElement("p", "", "text todoItem", "-Show window when hovering in taskbar", this.content);
                        createTextElement("p", "", "text todoItem", "-Add right-click menu to taskbar", this.content);
                        createTextElement("p", "", "text todoItem", "-Add real icons instead of numbers to taskbar", this.content);
                        createTextElement("p", "", "text todoItem", "-Add right click menu to fullscreen button, will contain buttons for at least left and right dock, probably quadrant docking too", this.content);
                        createTextElement("p", "", "text todoItem", "-User system? Would make it possible to save and/or share a library of things(drawings, graphs, snowflakes, sounds, game saves?, etc.)", this.content);
                        createTextElement("p", "", "text todoItem", "-Graph: Improve description", this.content);
                        createTextElement("p", "", "text todoItem", "-Graph: Make graphs sharable", this.content);
                        createTextElement("p", "", "text todoItem", "-Graph: Restructure code, make function object", this.content);
                        createTextElement("p", "", "text todoItem", "-Graph: Fix/Finish parametric drawing mode", this.content);
                        createTextElement("p", "", "text todoItem", "-Graph: Attach drawing mode(Cart./Pol./Para.) to function object", this.content);
                        createTextElement("p", "", "text todoItem", "-Graph: Restructure interface, give access to function object", this.content);
                        createTextElement("p", "", "text todoItem", "-Graph: Make a parser for function inputs so I don't have to use eval(don't hack me!)", this.content);
                        createTextElement("p", "", "text todoItem", "-Snowflake Generator: Write description", this.content);
                        createTextElement("p", "", "text todoItem", "-Snowflake Generator: Take screenshots, add gallery", this.content);
                        createTextElement("p", "", "text todoItem", "-Snowflake Generator: Take video", this.content);
                        createTextElement("p", "", "text todoItem", "-Snowflake Generator: Fix scaling", this.content);
                        createTextElement("p", "", "text todoItem", "-Snowflake Generator: Make snowflakes shareable", this.content);
                        createTextElement("p", "", "text todoItem", "-Snowflake Generator: Revamp interface, maybe make a focused editing window for induvidual snowflakes", this.content);
                        createTextElement("p", "", "text todoItem", "-GBA: Write description", this.content);
                        createTextElement("p", "", "text todoItem", "-GBA: Take screenshots, add gallery", this.content);
                        createTextElement("p", "", "text todoItem", "-GBA: Take video", this.content);
                        createTextElement("p", "", "text todoItem", "-Synthesizer: Completely remake, this one has barely started", this.content);
                        createTextElement("p", "", "text todoItem", "-Synthesizer: Give access to/control over induvidual sounds", this.content);
                        createTextElement("p", "", "text todoItem", "-Synthesizer: Make sharable", this.content);
                        createTextElement("p", "", "text todoItem", "-Synthesizer: Write description", this.content);
                        createTextElement("p", "", "text todoItem", "-Synthesizer: Take video", this.content);
                        createTextElement("p", "", "text todoItem", "-Minecraft Demo: Write description", this.content);
                        createTextElement("p", "", "text todoItem", "-Minecraft Demo: Take screenshots, add gallery", this.content);
                        createTextElement("p", "", "text todoItem", "-Paint Clone: Write description", this.content);
                        createTextElement("p", "", "text todoItem", "-Paint Clone: Add menu(right side?)", this.content);
                        createTextElement("p", "", "text todoItem", "-Paint Clone: Add colors", this.content);
                        createTextElement("p", "", "text todoItem", "-Paint Clone: Add a fill tool", this.content);
                        createTextElement("p", "", "text todoItem", "-Paint Clone: Strokes are each a seperate vector, maybe add the option to show or hide induvidual strokes", this.content);
                        createTextElement("p", "", "text todoItem", "-Paint Clone: Maybe add a branching history so that strokes aren't lost when undone and drawn again", this.content);
                        createTextElement("p", "", "text todoItem", "-Paint Clone: Take screenshots, add gallery", this.content);
                        createTextElement("p", "", "text todoItem", "-Platformer: Add description/apology for abysmal quality", this.content);
                        createTextElement("p", "", "text todoItem", "-Platformer: Take screenshots, add gallery", this.content);
                        createTextElement("p", "", "text todoItem", "-CRT Filter: Allow users to upload their own files", this.content);
                        createTextElement("p", "", "text todoItem", "-Spacegame: add project page", this.content);
                        createTextElement("p", "", "text todoItem", "-Spacegame: Write description", this.content);
                        createTextElement("p", "", "text todoItem", "-Spacegame: Take screenshots, add gallery", this.content);
                        createTextElement("p", "", "text todoItem", "-Spacegame: Take video", this.content);
                        createTextElement("p", "", "text todoItem", "-C64 Projects: add project page", this.content);
                        createTextElement("p", "", "text todoItem", "-C64 Projects: Fix C64(Replace video chip?)", this.content);
                        createTextElement("p", "", "text todoItem", "-C64 Projects: Write descriptions", this.content);
                        createTextElement("p", "", "text todoItem", "-C64 Projects: Take screenshots, add gallery", this.content);
                        createTextElement("p", "", "text todoItem", "-C64 Projects: Take videos", this.content);
                        createTextElement("p", "", "text todoItem", "-Arduino C64 Keyboard adapter: add project page", this.content);
                        createTextElement("p", "", "text todoItem", "-Arduino C64 Keyboard adapter: Write description", this.content);
                        createTextElement("p", "", "text todoItem", "-Arduino C64 Keyboard adapter: Take screenshots, add gallery", this.content);
                        createTextElement("p", "", "text todoItem", "-Arduino C64 Keyboard adapter: Take video", this.content);
                        createTextElement("p", "", "text todoItem", "-Arduino DS: add project page", this.content);
                        createTextElement("p", "", "text todoItem", "-Arduino DS: Write description", this.content);
                        createTextElement("p", "", "text todoItem", "-Arduino DS: Take screenshots, add gallery", this.content);
                        createTextElement("p", "", "text todoItem", "-Arduino DS: Take video", this.content);
                        createTextElement("p", "", "text todoItem", "-Rust-WASM: add project page", this.content);
                        createTextElement("p", "", "text todoItem", "-Rust-WASM: Write description", this.content);
                        createTextElement("p", "", "text todoItem", "-Rust-WASM: Take screenshots, add gallery", this.content);
                        createTextElement("p", "", "text todoItem", "-Rust-WASM: Take video", this.content);
                        createTextElement("p", "", "text todoItem", "-Rust-WASM: Add demo", this.content);
                        createTextElement("p", "", "text todoItem", "-Image filter demo: add project page", this.content);
                        createTextElement("p", "", "text todoItem", "-Image filter demo: Write description", this.content);
                        createTextElement("p", "", "text todoItem", "-Image filter demo: Take screenshots", this.content);
                        createTextElement("p", "", "text todoItem", "-Image filter demo: Take video", this.content);
                        createTextElement("p", "", "text todoItem", "-Image filter demo: Add demo", this.content);
                        createTextElement("p", "", "text todoItem", "-Possible Future Project: Something involving machine learning, something involving WebGL, maybe a fighting game where the opponent is contolled by a neural net that gets better as you play.", this.content);
                        createElement("br", "", "", this.content);

                        createTextElement("h2", "", "text", "Changelog:", this.content);
                        createTextElement("h3", "", "text changelogDate", "2/16/2022:", this.content);
                        createTextElement("p", "", "text changelogEntry strikethrough", "-Get server to send out font when it serves the page, Safari doesn't support Segoe UI", this.content);
                        createTextElement("p", "", "text changelogEntry strikethrough", "-Paint Clone: Add dark mode", this.content);
                        createTextElement("p", "", "text changelogEntry", "+Paint Clone: Add a fill tool", this.content);
                        createTextElement("h3", "", "text changelogDate", "2/15/2022:", this.content);
                        createTextElement("p", "", "text changelogEntry", "+Make a real home page", this.content);
                        createTextElement("p", "", "text changelogEntry", "+Make a real demo page", this.content);
                        createTextElement("p", "", "text changelogEntry", "+Figure out how to detect mobile and simplify the site, drop the windows-style GUI", this.content);
                        createTextElement("p", "", "text changelogEntry", "+Test on all web platforms, deal with any styling issues that pop up", this.content);
                        createTextElement("p", "", "text changelogEntry", "+Figure out how to get around Firefox not supporting backdrop-filter: blur (WTF why?! Get on that Mozilla, so dumb.)", this.content);
                        createTextElement("p", "", "text changelogEntry", "+Remodel projects page, it looks okay on my 4k screen, but tests of 1080p look awful", this.content);
                        createTextElement("p", "", "text changelogEntry", "+Figure out some alternative to the 'try me' button, it's looks bad", this.content);
                        createTextElement("p", "", "text changelogEntry", "+Figure out how to do tables, need tables for listing controls && functions supported by graph", this.content);
                        createTextElement("p", "", "text changelogEntry", "+Figure out why navbar text sometimes gets wiped when restoring from minimize", this.content);
                        createTextElement("p", "", "text changelogEntry", "+Make windows resizeable", this.content);
                        createTextElement("p", "", "text changelogEntry", "+Show window when hovering in taskbar", this.content);
                        createTextElement("p", "", "text changelogEntry", "+Add right-click menu to taskbar", this.content);
                        createTextElement("p", "", "text changelogEntry", "+Add real icons instead of numbers to taskbar", this.content);
                        createTextElement("p", "", "text changelogEntry", "+Add right click menu to fullscreen button, will contain buttons for at least left and right dock, probably quadrant docking too", this.content);
                        createTextElement("p", "", "text changelogEntry", "+User system? Would make it possible to save and/or share a library of things(drawings, graphs, snowflakes, sounds, game saves?, etc.)", this.content);
                        createTextElement("p", "", "text changelogEntry", "+Graph: Improve description", this.content);
                        createTextElement("p", "", "text changelogEntry", "+Graph: Make graphs sharable", this.content);
                        createTextElement("p", "", "text changelogEntry", "+Graph: Restructure code, make function object", this.content);
                        createTextElement("p", "", "text changelogEntry", "+Graph: Fix/Finish parametric drawing mode", this.content);
                        createTextElement("p", "", "text changelogEntry", "+Graph: Attach drawing mode(Cart./Pol./Para.) to function object", this.content);
                        createTextElement("p", "", "text changelogEntry", "+Graph: Restructure interface, give access to function object", this.content);
                        createTextElement("p", "", "text changelogEntry", "+Graph: Make a parser for function inputs so I don't have to use eval(don't hack me!)", this.content);
                        createTextElement("p", "", "text changelogEntry", "+Snowflake Generator: Write description", this.content);
                        createTextElement("p", "", "text changelogEntry", "+Snowflake Generator: Take screenshots, add gallery", this.content);
                        createTextElement("p", "", "text changelogEntry", "+Snowflake Generator: Take video", this.content);
                        createTextElement("p", "", "text changelogEntry", "+Snowflake Generator: Fix scaling", this.content);
                        createTextElement("p", "", "text changelogEntry", "+Snowflake Generator: Make snowflakes shareable", this.content);
                        createTextElement("p", "", "text changelogEntry", "+Snowflake Generator: Revamp interface, maybe make a focused editing window for induvidual snowflakes", this.content);
                        createTextElement("p", "", "text changelogEntry", "+GBA: Write description", this.content);
                        createTextElement("p", "", "text changelogEntry", "+GBA: Take screenshots, add gallery", this.content);
                        createTextElement("p", "", "text changelogEntry", "+GBA: Take video", this.content);
                        createTextElement("p", "", "text changelogEntry", "+Synthesizer: Completely remake, this one has barely started", this.content);
                        createTextElement("p", "", "text changelogEntry", "+Synthesizer: Give access to/control over induvidual sounds", this.content);
                        createTextElement("p", "", "text changelogEntry", "+Synthesizer: Make sharable", this.content);
                        createTextElement("p", "", "text changelogEntry", "+Synthesizer: Write description", this.content);
                        createTextElement("p", "", "text changelogEntry", "+Synthesizer: Take video", this.content);
                        createTextElement("p", "", "text changelogEntry", "+Minecraft Demo: Write description", this.content);
                        createTextElement("p", "", "text changelogEntry", "+Minecraft Demo: Take screenshots, add gallery", this.content);
                        createTextElement("p", "", "text changelogEntry", "+Paint Clone: Write description", this.content);
                        createTextElement("p", "", "text changelogEntry", "+Paint Clone: Add menu(right side?)", this.content);
                        createTextElement("p", "", "text changelogEntry", "+Paint Clone: Add colors", this.content);
                        createTextElement("p", "", "text changelogEntry", "+Paint Clone: Add a fill tool", this.content);
                        createTextElement("p", "", "text changelogEntry", "+Paint Clone: Strokes are each a seperate vector, maybe add the option to show or hide induvidual strokes", this.content);
                        createTextElement("p", "", "text changelogEntry", "+Paint Clone: Maybe add a branching history so that strokes aren't lost when undone and drawn again", this.content);
                        createTextElement("p", "", "text changelogEntry", "+Paint Clone: Take screenshots, add gallery", this.content);
                        createTextElement("p", "", "text changelogEntry", "+Platformer: Add description/apology for abysmal quality", this.content);
                        createTextElement("p", "", "text changelogEntry", "+Platformer: Take screenshots, add gallery", this.content);
                        createTextElement("p", "", "text changelogEntry", "+CRT Filter: Allow users to upload their own files", this.content);
                        createTextElement("p", "", "text changelogEntry", "+Spacegame: add project page", this.content);
                        createTextElement("p", "", "text changelogEntry", "+Spacegame: Write description", this.content);
                        createTextElement("p", "", "text changelogEntry", "+Spacegame: Take screenshots, add gallery", this.content);
                        createTextElement("p", "", "text changelogEntry", "+Spacegame: Take video", this.content);
                        createTextElement("p", "", "text changelogEntry", "+C64 Projects: add project page", this.content);
                        createTextElement("p", "", "text changelogEntry", "+C64 Projects: Fix C64(Replace video chip?)", this.content);
                        createTextElement("p", "", "text changelogEntry", "+C64 Projects: Write descriptions", this.content);
                        createTextElement("p", "", "text changelogEntry", "+C64 Projects: Take screenshots, add gallery", this.content);
                        createTextElement("p", "", "text changelogEntry", "+C64 Projects: Take videos", this.content);
                        createTextElement("p", "", "text changelogEntry", "+Arduino C64 Keyboard adapter: add project page", this.content);
                        createTextElement("p", "", "text changelogEntry", "+Arduino C64 Keyboard adapter: Write description", this.content);
                        createTextElement("p", "", "text changelogEntry", "+Arduino C64 Keyboard adapter: Take screenshots, add gallery", this.content);
                        createTextElement("p", "", "text changelogEntry", "+Arduino C64 Keyboard adapter: Take video", this.content);
                        createTextElement("p", "", "text changelogEntry", "+Arduino DS: add project page", this.content);
                        createTextElement("p", "", "text changelogEntry", "+Arduino DS: Write description", this.content);
                        createTextElement("p", "", "text changelogEntry", "+Arduino DS: Take screenshots, add gallery", this.content);
                        createTextElement("p", "", "text changelogEntry", "+Arduino DS: Take video", this.content);
                        createTextElement("p", "", "text changelogEntry", "+Rust-WASM: add project page", this.content);
                        createTextElement("p", "", "text changelogEntry", "+Rust-WASM: Write description", this.content);
                        createTextElement("p", "", "text changelogEntry", "+Rust-WASM: Take screenshots, add gallery", this.content);
                        createTextElement("p", "", "text changelogEntry", "+Rust-WASM: Take video", this.content);
                        createTextElement("p", "", "text changelogEntry", "+Rust-WASM: Add demo", this.content);
                        createTextElement("p", "", "text changelogEntry", "+Image filter demo: add project page", this.content);
                        createTextElement("p", "", "text changelogEntry", "+Image filter demo: Write description", this.content);
                        createTextElement("p", "", "text changelogEntry", "+Image filter demo: Take screenshots", this.content);
                        createTextElement("p", "", "text changelogEntry", "+Image filter demo: Take video", this.content);
                        createTextElement("p", "", "text changelogEntry", "+Image filter demo: Add demo", this.content);
                        createTextElement("p", "", "text changelogEntry", "+Possible Future Project: Something involving machine learning, something involving WebGL, maybe a fighting game where the opponent is contolled by a neural net that gets better as you play.", this.content);



                        thisDesc("To Do/Changelog");
                        this.changePage("todo");
                }
        }

        resume() {
                if (this.page != "resume") {
                        this.clear();
                        this.setTitle("Resume");
                        this.changePage("resume");

                        let resume = createElement("iframe", "", "resume", this.content);
                        const pdfUrl = encodeURIComponent(
                                "https://raw.githubusercontent.com/gusjengis/Resume/main/out/resume.pdf"
                        );
                        resume.src = `https://mozilla.github.io/pdf.js/web/viewer.html?file=${pdfUrl}#zoom=page-fit`;
                }
        }

        projects() {
                if (this.page != "projects") {
                        this.clear();
                        let background = createElement("div", "", "projectsBackground", this.content);
                        createLink(this.links["projects-perlin"], background);
                        createLink(this.links["projects-gol"], background);
                        createLink(this.links["projects-webGPU"], background);
                        createLink(this.links["projects-pLife"], background);
                        createLink(this.links["projects-webGL"], background);
                        createLink(this.links["projects-oscilloscopevideo"], background);
                        createLink(this.links["projects-oscilloscope"], background);
                        createLink(this.links["projects-wireframe"], background);
                        createLink(this.links["projects-handheld"], background);
                        createLink(this.links["projects-crt"], background);
                        createLink(this.links["projects-spacegame"], background);
                        createLink(this.links["projects-3d"], background);
                        createLink(this.links["projects-morse"], background);
                        createLink(this.links["projects-linetest"], background);
                        createLink(this.links["projects-sound"], background);
                        createLink(this.links["projects-snowflake"], background);
                        createLink(this.links["projects-platformer"], background);
                        createLink(this.links["projects-graph"], background);

                        //Coming Soon...

                        createTextElement("h2", "projects-desc" + this.ID, "text", "<u> Coming Soon...", background);


                        let temp1 = createLink(this.links["projects-keyboard"], background);
                        let temp2 = createLink(this.links["projects-gba"], background);
                        let temp3 = createLink(this.links["projects-dino"], background);

                        temp1.onclick = "";
                        temp2.onclick = "";
                        temp3.onclick = "";

                        this.setTitle("Projects");
                        this.changePage("projects");
                }
        }

        // HELP

        containsHelp() {
                let childNodes = this.content.childNodes;
                let containsHelp = false;
                for (i = 0; i < childNodes.length; i++) {
                        if (childNodes[i].classList.contains("helpWindow")) {
                                containsHelp = true;
                        }
                }
                return containsHelp;
        }

        basicHelpWindow() {
                let container = createElement("div", "helpWindow" + this.ID, "helpWindow", this.content);
                let bar = createElement("div", "", "helpWindowBar", container);

                createTextElement("h4", "", "text helpWindowTitle", "Help", bar);

                let closeButton = createTextElement("button", "", "windowButton text cornerButton helpCloseButton", '\u2A09', bar);
                closeButton.onclick = function () {
                        this.parentElement.parentElement.remove();
                }

                let content = createElement("div", "helpContent" + this.ID, "helpWindowContent", container);
                createElement("table", "helpTable" + this.ID, "helpTable", content);
                this.helpHeader("Input", "Action", "Description");
                this.window.owner.pageSpecificResizeFuncs.push(
                        function (ID) {
                                let helpTable = document.getElementById("helpTable" + ID);
                                let i, j;
                                for (i = 0; i < helpTable.childNodes.length; i++) {
                                        let max = 0;
                                        for (j = 0; j < 3; j++) {
                                                let height = helpTable.childNodes[i].childNodes[j].childNodes[0].offsetHeight;
                                                if (height > max) {
                                                        max = height;
                                                }
                                        }
                                        helpTable.childNodes[i].childNodes[0].style.height = max + "px";
                                        helpTable.childNodes[i].childNodes[1].style.height = max + "px";
                                        helpTable.childNodes[i].childNodes[2].style.height = max + "px";

                                }
                        }
                );
                this.window.owner.pageSpecificResizeFuncs[this.window.owner.pageSpecificResizeFuncs.length - 1];
                this.window.owner.pageSpecificResizeFuncs.push(
                        function (ID) {
                                let helpContent = document.getElementById("helpContent" + ID);
                                let helpWindow = document.getElementById("helpWindow" + ID);
                                helpContent.style.height = "";
                                var computedStyle = window.getComputedStyle(helpWindow);
                                let height = parseInt(computedStyle.height, 10);
                                helpContent.style.height = height - 30 + "px";
                        }
                );
                this.window.owner.pageSpecificResizeFuncs[this.window.owner.pageSpecificResizeFuncs.length - 1];
                return content;
        }

        helpEntry(input, action, desc) {
                let parent = document.getElementById("helpTable" + this.ID);
                let div = createElement("tr", "", "helpEntry", parent);
                let inputDiv = createElement("td", "", "helpInput", div);
                let actionDiv = createElement("td", "", "helpAction", div);
                let descDiv = createElement("td", "", "helpDesc", div);
                createTextElement("h4", "", "helpText text", input, inputDiv);
                createTextElement("h4", "", "helpText text", action, actionDiv);
                createTextElement("h4", "", "helpText text", desc, descDiv);
                this.resizeFuncs();
                return div;
        }

        helpPlainEntry(text, parent) {

        }

        helpHeader(input, action, desc) {
                let header = this.helpEntry(input, action, desc);
                header.classList.add("bold");
                header.classList.add("helpTableHeader");
                // header.classList.add("underline");
        }

        helpPlainHeader(text, parent) {

        }

        help() {
                if (!this.containsHelp()) {
                        switch (this.page) {
                                case "snowflake":
                                        this.snowflakeHelp();
                                        break;
                                case "pLife":
                                        this.pLifeHelp();
                                        break;
                                case "webGL":
                                        this.webGLHelp();
                                        break;
                                case "minecraftDemo":
                                        this.minecraftDemoHelp();
                                        break;
                                case "wireframe":
                                        this.wireframeHelp();
                                        break;
                                case "paint":
                                        this.paintHelp();
                                        break;
                                case "graph":
                                        this.graphHelp();
                                        break;
                                case "oscilloscopeVideo":
                                        this.oscilloscopeHelp();
                                        break;
                                case "gol":
                                        this.golHelp();
                                        break;
                                case "perlin":
                                        this.perlinHelp();
                                        break;
                                default:
                                        return -1;//this.basicHelpWindow();
                                        break;
                        }
                        this.resizeFuncs();
                }

        }

        snowflakeHelp() {
                this.basicHelpWindow();
                this.helpEntry("R", "Reset", "Restores selected snowflake to it's original state. If nothing's selected, restores all snowlakes.");
                this.helpEntry("Space", "Play/Pause", "Toggles animation on selected snowflake. If nothing's selected, toggles animation on all snowlakes.");
                this.helpEntry("N", "New Batch", "Replaces all snowflakes.");
                this.helpEntry("Left Click", "Select Snowflake", "Selects snowflake for animation and modification, populates the menu.");
        }

        pLifeHelp() {
                this.basicHelpWindow();
                this.helpEntry("M", "Menu", "Toggles menu. Menu contains the table of attractions, settings, and a few buttons.");
                this.helpEntry("R", "Reset/Scramble Particles", "Randomizes all positions and zeroes all velocities.");
                this.helpEntry("N", "New/Randomize", "Randomizes colors, # of colors, and attractions. Creates completely new behavior.");
                this.helpEntry("C", "Toggle Clearing", "Toggles clearing of the draw buffer, creates some really cool visuals.");
                this.helpEntry("Scroll", "Zoom/Adjust Radius", "Increases/decreases the minimum distance at which particles will interact. Hard to control on trackpads, can also be done in the menu.");
        }

        webGLHelp() {
                this.basicHelpWindow();
                this.helpEntry("P", "CRT Filter", "Toggles CRT filter. Be sure to try this.");
                this.helpEntry("W", "Forward", "Moves camera forward.");
                this.helpEntry("A", "Left", "Moves camera left.");
                this.helpEntry("S", "Back", "Moves camera backward.");
                this.helpEntry("D", "Right", "Moves camera right.");
                this.helpEntry("Shift", "Move Faster", "Typical sprint.");
                this.helpEntry("Mouse", "Look", "Rotates camera.");
                this.helpEntry("C", "Descend", "Descend.");
                this.helpEntry("Space", "Ascend", "Ascend.");
                this.helpEntry("K", "Pause/Play", "Toggles the animation of the spheres.");
        }

        minecraftDemoHelp() {
                this.basicHelpWindow();
                this.helpEntry("W", "Forward", "Moves camera forward.");
                this.helpEntry("A", "Left", "Moves camera left.");
                this.helpEntry("S", "Back", "Moves camera backward.");
                this.helpEntry("D", "Right", "Moves camera right.");
                this.helpEntry("Mouse", "Look", "Rotates camera.");
                this.helpEntry("Left Click", "Break Block", "Breaks block.");
                this.helpEntry("C", "Descend", "Descend.");
                this.helpEntry("Space", "Ascend", "Ascend.");
        }

        wireframeHelp() {
                this.basicHelpWindow();
                this.helpEntry("Space", "Reset/Randomize", "Wipes screen, generates new 4-point wireframe.");
                this.helpEntry("Left Click", "Add point", "Adds a new point to wireframe at cursor. All points connect to all other points.");
        }

        paintHelp() {
                this.basicHelpWindow();
                this.helpEntry("Left Click + Mouse Move", "Draw", "Click and drag mouse to leave a trail.");
                this.helpEntry("Z", "Undo", "Undoes last stroke.");
                this.helpEntry("Y", "Redo", "Restores last undone stroke.");
                this.helpEntry("Click Bottom Bar", "Light Mode", "Toggles light mode. Inverts stroke and background color.");
        }

        graphHelp() {
                this.basicHelpWindow();
                this.helpEntry("Scroll", "Zoom", "Zooms in/out on center of screen.");
                this.helpEntry("Left Click + Mouse Move", "Pan", "Click and drag mouse to pan graph.");
                this.helpEntry("polar: f(x)", "Polar Graph", 'Input function with the format "polar: f(x)" to graph a polar function.');
                this.helpEntry("parametric: f(x): f(x)", "Parametric Graph", 'Input function with the format "parametric: f(x): f(x)" to graph a polar function.');
                this.helpEntry("Left Click Function", "Select Function", "Selects function, allows retrieval of specific values. White dot appears at current x-value.");
                this.helpEntry("D", "X Up", "Increases current x-value.");
                this.helpEntry("A", "X Down", "Decreases current x-value.");
                this.helpEntry("I", "Up", "Pans graph up.");
                this.helpEntry("J", "Left", "Pans graph left.");
                this.helpEntry("L", "Down", "Pans graph down.");
                this.helpEntry("K", "Right", "Pans graph right.");
        }

        oscilloscopeHelp() {
                this.basicHelpWindow();
                this.helpEntry("Space", "Clear/Reset", "Clears screen, removes all effect, resets speed.");
                this.helpEntry("=", "Speed Up", "Increases animation speed.");
                this.helpEntry("-", "Speed Down", "Decreases animation speed.");
                this.helpEntry("1", "Effect 1", "Adds effect 1, horizontal RGB bars scrolling vertically.");
                this.helpEntry("2", "Effect 2", "Adds effect 2, vertical RGB bars scrolling horizontally.");
                this.helpEntry("3", "Effect 3", "Adds effect 3, horizontal greyscale bars scrolling vertically.");
                this.helpEntry("4", "Gradient 1", "Adds gradient 1, a red, green, a blue orb glowing and orbiting around center.");
                this.helpEntry("5", "Gradient 2", "Adds gradient 2, inverse of gradient 1.");
        }

        golHelp() {
                this.basicHelpWindow();
                this.helpEntry("Space", "Pause/Play", "Toggles execution, pausing enables editing.");
                this.helpEntry("Left Click", "Draw/Spawn", "When paused, brings cells to life (sets cell to black).");
                this.helpEntry("Right Click", "Erase/Kill", "When pause, kills a cell (erases/sets cell to white).");
                this.helpEntry("Middle Click", "Pan", "Hold and drag to pan.");
                this.helpEntry("Scroll", "Zoom", "Zooms in/out on center of screen.");
                this.helpEntry("D", "Dark Mode", "Toggles dark mode.");
                this.helpEntry("R", "Reset", "Restores default state, pauses.");
                this.helpEntry("C", "Clear", "Clears grid, pauses.");
                this.helpEntry("H", "Home", "Re-centers view.");
                this.helpEntry("M", "Toggle Highlife", "Toggles between highlife and standard game of life rules (B36/S23 vs B3/S23).");
                this.helpEntry("Left/Right Arrow", "Slow Down/Speed Up", "Increase/Decrease the amount of time between generations (increments of 10ms).");
                this.helpEntry("L", "Toggle Vertical Lines", "Toggles the vertical lines, with only horizontal lines you get a CRT effect.");
                this.helpEntry("Up Arrow", "Increase Grid/Scanline Width", "Increases the size of the lines between cells by 1px, stops 1px before pure black.");
                this.helpEntry("Down Arrow", "Decrease Grid/Scanline Width", "Decreases the size of the lines between cells by 1px, stops when lines disapear.");
                this.helpEntry("F3", "Print Stats", "Prints performance/debug stats to console (access w/ F12). Runs at 11k gens/sec on my machine, not bad.");
        }

        perlinHelp() {
                this.basicHelpWindow();
                this.helpEntry("Space", "Pause/Play", "Toggles generation, generates new patches of terrain until paused.");
                // this.helpEntry("Left Click", "Draw/Spawn", "When paused, brings cells to life (sets cell to black).");
                // this.helpEntry("Right Click", "Erase/Kill", "When pause, kills a cell (erases/sets cell to white).");
                this.helpEntry("W/A/S/D", "Move Light", "Moves a point light around the terrain. Lighting is currently just Lambertian diffusion with inverse square falloff. Casting shadows will come later.");
                this.helpEntry("Left/Right Arrow", "Slow Down/Speed Up", "Increase/Decrease the amount of time between generations (increments of 10ms).");
                this.helpEntry("Up/Down Arrow", "Increase/Decrease Terrain Height", "Scales the Y component of the terrain vertices.");
                this.helpEntry("I/K", "Zoom In/Out", "Zooms in/out on the center of the terrain.");
                this.helpEntry("J/L", "Rotate Left/Right", "Rotates terrain about it's center.");
                this.helpEntry("F3", "Print Stats", "Prints framerate (access w/ F12).");
        }


        //End of HELP

        createDemoPage(page, title, src) {

                if (this.page != page) {
                        this.clear();
                        this.iframe = createElement("iframe", "iframe" + this.ID, "demo", this.content);
                        this.iframe.setAttribute('src', src);
                        this.iframe.setAttribute('webkitAllowFullScreen', true);
                        this.iframe.allow = "fullscreen";
                        this.iframe.style.pointerEvents = "none";
                        this.iframe.owner = this;
                        this.setTitle(title);
                        this.showDemoButtons();
                        this.changePage(page);
                        let help = this.help();
                        if (help == -1) {
                                this.navBarButton[4].style.display = "none";
                        }
                        if (this.containsHelp()) {
                                document.getElementById("helpWindow" + this.ID).remove();
                                this.pageSpecificResizeFuncs.length -= 2;
                        }

                }
        }


        createCoverBase(page, title) {
                if (this.page != page) {
                        this.clear();
                        this.setTitle(title);
                        this.changePage(page);
                }
        }

        notFound() {
                this.createDemoPage("404", "404", "404.html");
        }

        graphCover() {
                this.createCoverBase("graphCover", "Graph");
                let body = createElement("div", "graphCoverBody", "coverBody", this.content);
                createTextElement("h1", "", "text", "Graphing Calculator", body);
                createTextElement("h2", "", "text", "Language: JS/HTML/CSS | Platform: Web | Spring 2019", body);
                createTextElement("p", "", "text", "This is the first thing I ever programmed outside of pseudocode. It's a graphing calculator that can graph both cartesian and polar functions.", body);
                let gallery = new Gallery("graphGallery" + this.ID, body, "Screenshots");
                gallery.addImage("", "assets/graphGallery/Screenshot1.png");
                gallery.addImage("", "assets/graphGallery/Screenshot2.png");
                gallery.addImage("", "assets/graphGallery/Screenshot3.png");
                gallery.addImage("", "assets/graphGallery/Screenshot4.png");
                gallery.addImage("", "assets/graphGallery/Screenshot5.png");
                gallery.addImage("", "assets/graphGallery/Screenshot6.png");
                gallery.addImage("", "assets/graphGallery/Screenshot7.png");
                gallery.addImage("", "assets/graphGallery/Screenshot8.png");
                gallery.addImage("", "assets/graphGallery/Screenshot9.png");
                gallery.addImage("", "assets/graphGallery/Screenshot9.5.png");
                gallery.addImage("", "assets/graphGallery/Screenshot10.png");
                gallery.addImage("", "assets/graphGallery/Screenshot11.png");
                gallery.addImage("", "assets/graphGallery/Screenshot12.png");
                gallery.addImage("", "assets/graphGallery/Screenshot13.png");
                gallery.addImage("", "assets/graphGallery/Screenshot14.png");
                gallery.addImage("", "assets/graphGallery/Screenshot15.png");
                gallery.addImage("", "assets/graphGallery/Screenshot16.png");
                gallery.addImage("", "assets/graphGallery/Screenshot17.png");
                createTextElement("h2", "", "text", "Supported Functions", body);
                let functionTable = new Table(body);
                functionTable.addTitles(["Function", "Image"]);
                let tryMe = createElement("div", "graphTryMe", "tryMeButton", body);
                let tryMeText = createTextElement("h1", "graphTryMeText", "tryMeText", "Try Me!", tryMe);
                tryMe.onclick = function () {
                        this.parentElement.parentElement.parentElement.owner.graph();
                }
        }

        graph() {
                this.createDemoPage("graph", "Graph", "Graph/index.html");
        }

        wireframe() {
                this.createDemoPage("wireframe", "Wireframe", "Wireframe/index.html");
        }

        morse() {
                this.createDemoPage("morse", "Morse Code", "Morse_Code/index.html");
        }

        linetest() {
                this.createDemoPage("linetest", "Line Test", "Line_Test/index.html");
        }

        webGL() {
                this.createDemoPage("webGL", "WebGL", "webGL/index.html");
        }

        webGPU() {
                this.createDemoPage("webGPU", "WebGPU", "webGPU/index.html");
        }

        gol() {
                this.createDemoPage("gol", "Game of Life", "GOL/index.html");
        }

        pLife() {
                this.createDemoPage("pLife", "Particle Life", "pLife/index.html");
        }

        perlin() {
                this.createDemoPage("perlin", "Perlin Noise", "Perlin/index.html");
        }

        oscilloscopeVideo() {
                this.createDemoPage("oscilloscopeVideo", "Oscilloscope Video", "Oscilloscope-Video/index.html");
        }

        gbaCover() {
                this.createCoverBase("gbaCover", "GBA");
                let body = createElement("div", "gbaCoverBody", "coverBody", this.content);
                createTextElement("h1", "", "text", "GBA Snowflake Port", body);
                createTextElement("h2", "", "text", "Language: C | Platform: Game Boy Advance | Feb. 2021", body);
                // createTextElement("h2", "", "text", "Supported Functions", body);
                let gbaGallery = new Gallery("gbaGallery", body, "Gallery Demo");

                gbaGallery.addImage("Label", "assets/crtGallery/DSC0007-scaled.jpg");
                gbaGallery.addImage("", "assets/crtGallery/DSC0009-scaled.jpg");
                gbaGallery.addImage("", "assets/crtGallery/DSC0018-scaled.jpg");
                gbaGallery.addImage("", "assets/crtGallery/DSC0021-scaled.jpg");
                gbaGallery.addImage("", "assets/crtGallery/DSC0023-scaled.jpg");
                gbaGallery.addImage("", "assets/crtGallery/DSC0026-scaled.jpg");
                gbaGallery.addImage("", "assets/crtGallery/DSC0028-scaled.jpg");
                gbaGallery.addImage("", "assets/crtGallery/DSC0034-scaled.jpg");
                gbaGallery.addImage("", "assets/crtGallery/DSC0037-scaled.jpg");
                gbaGallery.addImage("", "assets/crtGallery/DJI_0001-scaled.jpg");
                gbaGallery.addImage("", "assets/crtGallery/DJI_0002-scaled.jpg");
                gbaGallery.addImage("", "assets/crtGallery/DJI_0004-scaled.jpg");
                gbaGallery.addImage("", "assets/crtGallery/DJI_0005-scaled.jpg");
                gbaGallery.addImage("", "assets/crtGallery/DJI_0008-scaled.jpg");
                gbaGallery.addImage("", "assets/crtGallery/DJI_0009-scaled.jpg");
                gbaGallery.addImage("", "assets/crtGallery/DJI_0011-scaled.jpg");
                gbaGallery.addImage("", "assets/crtGallery/DJI_0013-scaled.jpg");
                gbaGallery.addImage("", "assets/crtGallery/DJI_0016-scaled.jpg");
                gbaGallery.addImage("", "assets/crtGallery/DJI_0041-scaled.jpg");
                gbaGallery.addImage("", "assets/crtGallery/DJI_0046-scaled.jpg");
                gbaGallery.addImage("", "assets/crtGallery/DJI_0050-scaled.jpg");
                gbaGallery.addImage("", "assets/crtGallery/DJI_0065-scaled.jpg");



                // gbaGallery.addImage("Test of label with max-height image", "https://external-preview.redd.it/GOkP8onbuyjGmN9Rc8Que5mw21CdSw6OuXpAKUuE6-4.jpg?auto=webp&s=2bc0e522d1f2fa887333286d557466b2be00fa5e");
                // gbaGallery.addImage("", "https://media2.giphy.com/media/bG1oRM2Qp2kN3MTZCO/giphy.gif?cid=790b7611414c28b12d0dd912e32a45fef00601ea66708431&rid=giphy.gif&ct=g");
                // gbaGallery.addImage("", "CRT/DOOM.png");


                // gbaGallery.addImage("Line Width: 3, Branches: 5", "assets/gbaThumb.png");
                // gbaGallery.addImage("", "assets/paintGallery1.png");
                // gbaGallery.addImage("", "assets/paintGallery2.png");
                // gbaGallery.addImage("", "assets/crtThumb.png");
                // gbaGallery.addImage("", "assets/graphThumb.png");



                // gbaGallery.addImage("", "assets/snowflakeThumb.png");
                // gbaGallery.addImage("", "assets/soundThumb.png");


        }

        oscilloscopeCover() {
                this.createCoverBase("oscilloscopeCover", "CRT Oscilloscope");
                let body = createElement("div", "oscilloscopeCoverBody", "coverBody", this.content);
                createTextElement("h1", "", "text", "CRT Oscilloscope", body);
                createTextElement("h2", "", "text", "Language: N/A | Platform: Electronics | Sept. 2022", body);
                createTextElement("p", "", "text", '\
        This is a small color CRT (Sony PVM-8020) that I converted to a crude oscilloscope. Inspired by <a href="https://www.youtube.com/watch?v=9oI3UWAR5pY">this video</a>.\
        ', body);
                createTextElement("p", "", "text", "\
        I added two switches that control whether horizontal or vertical deflection is controlled by the original circuitry or an exteral stereo audio signal.<br>\
        This allows me to switch back and forth between the original composite video mode and 3 different new oscilloscope modes.\
        ", body);
                createTextElement("h2", "", "text", "Original Hardware", body);

                let preGallery = new Gallery("", body, "");

                preGallery.addImage("", "assets/oscilloscopeGallery/1.jpg");
                preGallery.addImage("", "assets/oscilloscopeGallery/2.jpg");
                preGallery.addImage("", "assets/oscilloscopeGallery/3.jpg");
                preGallery.addImage("", "assets/oscilloscopeGallery/4.jpg");
                preGallery.addImage("", "assets/oscilloscopeGallery/5.jpg");


                createTextElement("h2", "", "text", "Mid-Operation", body);

                let surgeryGallery = new Gallery("", body, "");

                surgeryGallery.addImage("", "assets/oscilloscopeGallery/6.jpg");
                surgeryGallery.addImage("", "assets/oscilloscopeGallery/7.jpg");
                surgeryGallery.addImage("", "assets/oscilloscopeGallery/8.jpg");
                surgeryGallery.addImage("", "assets/oscilloscopeGallery/9.jpg");
                surgeryGallery.addImage("", "assets/oscilloscopeGallery/10.jpg");
                surgeryGallery.addImage("", "assets/oscilloscopeGallery/11.jpg");
                surgeryGallery.addImage("", "assets/oscilloscopeGallery/12.jpg");
                surgeryGallery.addImage("", "assets/oscilloscopeGallery/13.jpg");
                surgeryGallery.addImage("", "assets/oscilloscopeGallery/14.jpg");


                createTextElement("h2", "", "text", "Completed Hardware", body);

                let gallery = new Gallery("", body, "");


                gallery.addVideo("", "https://www.youtube.com/embed/Qm-TG2FoFEc", "assets/oscilloscopeGallery/15.jpg");
                gallery.addVideo("", "https://www.youtube.com/embed/kP6BBWPgdIo", "assets/oscilloscopeGallery/16.jpg");
                gallery.addVideo("", "https://www.youtube.com/embed/9sJTD16s050", "assets/oscilloscopeGallery/17.jpg");
                gallery.addVideo("", "https://www.youtube.com/embed/BdWLL3OqWNs", "assets/oscilloscopeGallery/18.jpg");
                gallery.addVideo("", "https://www.youtube.com/embed/mblxmIYJu-0", "assets/oscilloscopeGallery/19.jpg");
                gallery.addVideo("", "https://www.youtube.com/embed/3xKF0c1DD8Q", "assets/oscilloscopeGallery/20.jpg");
                gallery.addImage("Short Exposure", "assets/oscilloscopeGallery/34.jpg");
                gallery.addImage("Short Exposure", "assets/oscilloscopeGallery/35.jpg");
                gallery.addImage("Long(er) Exposure", "assets/oscilloscopeGallery/22.jpg");
                gallery.addImage("Long(er) Exposure", "assets/oscilloscopeGallery/23.jpg");
                gallery.addImage("Long(er) Exposure", "assets/oscilloscopeGallery/24.jpg");
                gallery.addImage("Long(er) Exposure", "assets/oscilloscopeGallery/25.jpg");
                gallery.addImage("Long(er) Exposure", "assets/oscilloscopeGallery/26.jpg");
                gallery.addImage("Blurred", "assets/oscilloscopeGallery/28.jpg");
                gallery.addImage("Blurred", "assets/oscilloscopeGallery/29.jpg");
                gallery.addImage("Blurred", "assets/oscilloscopeGallery/30.jpg");
                gallery.addImage("Blurred", "assets/oscilloscopeGallery/31.jpg");
                gallery.addImage("Blurred", "assets/oscilloscopeGallery/32.jpg");
                gallery.addImage("Blurred", "assets/oscilloscopeGallery/33.jpg");

                gallery.addVideo("", "https://www.youtube.com/embed/35s1aIJAzv0", "assets/oscilloscopeGallery/40.jpg");
                gallery.addVideo("", "https://www.youtube.com/embed/HlfCVnHvISU", "assets/oscilloscopeGallery/40.jpg");
                gallery.addVideo("", "https://www.youtube.com/embed/EGb10RuQXZo", "assets/oscilloscopeGallery/40.jpg");
                gallery.addVideo("", "https://www.youtube.com/embed/8AeXTpFbZOU", "assets/oscilloscopeGallery/40.jpg");

                gallery.addImage("Oscilloscope Video", "assets/oscilloscopeGallery/40.jpg");

        }

        handheld() {
                this.createCoverBase("handheld", "Arduino Handheld");
                let body = createElement("div", "handheldCoverBody", "coverBody", this.content);
                createTextElement("h1", "", "text", "Arduino Handheld", body);
                createTextElement("h2", "", "text", "Language: C++ | Platform: Arduino | Aug. 2021", body);
                createTextElement("p", "", "text", "This is an arduino-based handheld that I designed, built, and programmed.", body);
                createTextElement("p", "", "text", "I sat my laptop bag on the handheld, it's currently broken. I'm going to design and print a new body before I continue documentation.", body);
                createTextElement("h2", "", "text", "Hardware", body);
                // createTextElement("p", "", "text", "The hardware has been through many iterations. I started building this at a friends house, so the first version was completely improvised. The body was made of cardboard, the wiring was a mess, and everything was held on by tape. It was powered by an Arduino Uno; it had two buttons, one analog stick, and two 8x8 RGBLED displays that I combined in software.", body);


                let handheldGallery = new Gallery("HandheldGallery", body, "");

                handheldGallery.addImage("", "assets/handheldGallery/6.jpg");
                handheldGallery.addImage("", "assets/handheldGallery/7.jpg");
                handheldGallery.addImage("", "assets/handheldGallery/8.jpg");
                handheldGallery.addImage("", "assets/handheldGallery/14.jpg");
                handheldGallery.addImage("", "assets/handheldGallery/15.jpg");
                handheldGallery.addImage("", "assets/handheldGallery/10.jpg");
                handheldGallery.addImage("", "assets/handheldGallery/11.jpg");
                handheldGallery.addImage("", "assets/handheldGallery/16.jpg");
                handheldGallery.addImage("", "assets/handheldGallery/17.jpg");
                handheldGallery.addImage("", "assets/handheldGallery/18.jpg");
                handheldGallery.addImage("", "assets/handheldGallery/19.jpg");
                handheldGallery.addImage("", "assets/handheldGallery/20.jpg");
                handheldGallery.addImage("", "assets/handheldGallery/21.jpg");
                handheldGallery.addImage("", "assets/handheldGallery/22.jpg");
                handheldGallery.addImage("", "assets/handheldGallery/23.jpg");
                handheldGallery.addImage("", "assets/handheldGallery/4.jpg");
                handheldGallery.addImage("", "assets/handheldGallery/5.jpg");
                handheldGallery.addImage("", "assets/handheldGallery/3.jpg");
                handheldGallery.addImage("", "assets/handheldGallery/24.jpg");
                handheldGallery.addImage("", "assets/handheldGallery/25.jpg");
                handheldGallery.addImage("", "assets/handheldGallery/26.jpg");
                handheldGallery.addImage("", "assets/handheldGallery/27.jpg");
                handheldGallery.addImage("", "assets/handheldGallery/28.jpg");
                handheldGallery.addImage("", "assets/handheldGallery/29.jpg");
                handheldGallery.addImage("", "assets/handheldGallery/30.jpg");
                handheldGallery.addImage("", "assets/handheldGallery/1.jpg");
                handheldGallery.addImage("", "assets/handheldGallery/2.jpg");

                // createTextElement("p", "", "text", "This version had really poor build quality, so I quickly moved on to my first 3D printed body.", body);

                // let flatHandheldGallery = new Gallery("flatHandheldGallery", body, "");


                // createTextElement("p", "", "text", "This version made various improvements. The build quality across the board improved. It had a stiff plastic body, no electrical tape, no alligator clips, and new metal buttons. I didn't just make it sturdier, I added more features. I added a battery, a speaker, and a reset/home button.", body);
                // createTextElement("p", "", "text", "After programming and playing with this version for a while, I wanted to add two more buttons and a second stick, and I wanted to design a more sophisticated body.", body);
                // createTextElement("p", "", "text", "I stayed up all night designing the final body. I went with a two part body. One for the grip, controls and battery. The other for the screen, speakers, and arduino. It was around this time that I was staring to run out of program storage, so I upgraded from an Arduino Uno to an Arduino Mega 2560. I added a pause button, the second stick, and replaced the single speaker on the back with a pair of front facing speakers.", body);


                // let handheldGallery = new Gallery("handheldGallery", body, "");



                createTextElement("h2", "", "text", "Software", body);
                let handheldSoftwareGallery = new Gallery("cardboardHandheldGallery", body, "");
                handheldSoftwareGallery.addVideo("Early Input Diagnostic", "https://www.youtube.com/embed/M6iustj7Sok", "assets/handheldGallery/9.jpg");
                handheldSoftwareGallery.addVideo("Early Input Diagnostic", "https://www.youtube.com/embed/dfGmsPzAXeY", "assets/handheldGallery/31.jpg");

                handheldSoftwareGallery.addImage("", "assets/handheldGallery/12.jpg");
                handheldSoftwareGallery.addImage("Added support for printing to screen!", "assets/handheldGallery/13.jpg");


                // createTextElement("p", "", "text", "I still consider this to be incomplete. The only program that's finished is snake, and I'd like to design a fourth body that conceals the wires. I've had problems with the wiring being disturbed on the underside, which can cause inputs to be disconnected. The grips aren't deep enough to be truly comfortable and the plastic is too thin in places, so if I get around to another version, it would be much thicker.", body);
        }

        paintCover() {
                this.createCoverBase("paintCover", "Paint");
                let body = createElement("div", "graphCoverBody", "coverBody", this.content);
                createTextElement("h1", "", "text", "Paint Clone", body);
                createTextElement("h2", "", "text", "Language: JS/HTML/CSS | Platform: Web | Jan. 2022", body);
                createTextElement("p", "", "text", "This is just a basic paint clone, only does black lines. The cool thing about it is that it has undo and redo. Considering that it was all done from scratch in about 1.5 hours, I'm pretty pleased with it.", body);
                let tryMe = createElement("div", "graphTryMe", "tryMeButton", body);
                let tryMeText = createTextElement("h1", "graphTryMeText", "tryMeText", "Try Me!", tryMe);
                tryMe.onclick = function () {
                        this.parentElement.parentElement.parentElement.owner.paint();
                }
        }

        paint() {
                this.createDemoPage("paint", "Paint", "Paint/Paint.html");
        }

        minecraftDemoCover() {
                this.createCoverBase("minecraftDemoCover", "Minecraft Demo");
                let body = createElement("div", "minecraftDemoCoverBody", "coverBody", this.content);
                createTextElement("h1", "", "text", "Minecraft Demo", body);
                createTextElement("h2", "", "text", "Language: JS/HTML/CSS | Platform: Web | Feb. 2022", body);
                createTextElement("p", "", "text", "In the spring of 2021, I played with three.js for a few days. This is the result.", body);
                let tryMe = createElement("div", "minecraftDemoTryMe", "tryMeButton", body);
                let tryMeText = createTextElement("h1", "minecraftDemoTryMeText", "tryMeText", "Try Me!", tryMe);
                tryMe.onclick = function () {
                        this.parentElement.parentElement.parentElement.owner.minecraftDemo();
                }
        }

        minecraftDemo() {
                this.createDemoPage("minecraftDemo", "Minecraft Demo", "MinecraftDemo/3D.html");
        }

        crtCover() {
                this.createCoverBase("crtCover", "Minecraft Demo");
                let body = createElement("div", "crtCoverBody", "coverBody", this.content);
                createTextElement("h1", "", "text", "CRT Filter", body);
                createTextElement("h2", "", "text", "Language: JS/HTML/CSS | Platform: Web | Dec. 2021", body);
                createTextElement("p", "", "text", "This is a CRT filter I made at the end of 2020. It was based on of the look of my shadow mask Commodore 1702, so it might look weird if you're used to apeture grille displays. I didn't used WebGL, so it can take a while to draw large images, but I think it looks pretty cool so I'm pleased with it.", body);
                let tryMe = createElement("div", "crtTryMe", "tryMeButton", body);
                let tryMeText = createTextElement("h1", "crtTryMeText", "tryMeText", "Try Me!", tryMe);
                tryMe.onclick = function () {
                        this.parentElement.parentElement.parentElement.owner.crt();
                }
        }

        spacegameCover() {
                this.createCoverBase("spacegameCover", "Spacegame");
                let body = createElement("div", "spacegameCoverBody", "coverBody", this.content);
                createTextElement("h1", "", "text", "Spacegame", body);
                createTextElement("h2", "", "text", "Language: Java | Platform: JVM | June 2021", body);
                createTextElement("p", "", "text", "This is a shoot em' up I made in Java using the built-in Graphics class. I never got around to adding enemies or power-ups, but the star field in the background is pretty cool, and the ship can move and shoot.", body);
                let spacgameGallery = new Gallery("spacegameGallery", body, "");

                spacgameGallery.addVideo("4k Star Field", "https://www.youtube.com/embed/syDJRa2Abyo", "assets/spacegameGallery/StarFieldThumb.jpg");
                spacgameGallery.addVideo("1080p Star Field", "https://www.youtube.com/embed/5fqT8ZdTfwg", "assets/spacegameGallery/StarFieldThumb.jpg");
                spacgameGallery.addVideo("Movement Demo", "https://www.youtube.com/embed/Z8R_4Jr8BQA", "assets/spacegameGallery/SpacegameDemoThumb.jpg");


        }

        crt() {
                this.createDemoPage("crt", "CRT Filter", "CRT/CRT.html");
        }

        snowflakeCover() {
                this.createCoverBase("snowflakeCover", "Snowflake");
                let body = createElement("div", "snowflakeCoverBody", "coverBody", this.content);
                createTextElement("h1", "", "text", "Snowflake Generator", body);
                createTextElement("h2", "", "text", "Language: JS/HTML/CSS | Platform: Web | Jan. 2022", body);
                let tryMe = createElement("div", "snowflakeTryMe", "tryMeButton", body);
                let tryMeText = createTextElement("h1", "snowflakeTryMeText", "tryMeText", "Try Me!", tryMe);
                tryMe.onclick = function () {
                        this.parentElement.parentElement.parentElement.owner.snowflake();
                }
        }

        snowflake() {
                this.createDemoPage("snowflake", "Snowflake Generator", "Snowflake/Snowflake.html");
        }

        platformerCover() {
                this.createCoverBase("platformerCover", "Platformer");
                let body = createElement("div", "platformerCoverBody", "coverBody", this.content);
                createTextElement("h1", "", "text", "Platformer", body);
                createTextElement("h2", "", "text", "Language: JS/HTML/CSS | Platform: Web | Summer 2019", body);
                let tryMe = createElement("div", "platformerTryMe", "tryMeButton", body);
                let tryMeText = createTextElement("h1", "platformerTryMeText", "tryMeText", "Try Me!", tryMe);
                tryMe.onclick = function () {
                        this.parentElement.parentElement.parentElement.owner.platformer();
                }
        }

        platformer() {
                this.createDemoPage("platformer", "Platformer", "Platformer/Platformer.html");
        }

        synthCover() {
                this.createCoverBase("synthCover", "Synthesizer");
                let body = createElement("div", "synthCoverBody", "coverBody", this.content);
                createTextElement("h1", "", "text", "Synthesizer", body);
                createTextElement("h2", "", "text", "Language: JS/HTML/CSS | Platform: Web | Jul. 2020", body);
                let tryMe = createElement("div", "synthTryMe", "tryMeButton", body);
                let tryMeText = createTextElement("h1", "synthTryMeText", "tryMeText", "Try Me!", tryMe);
                tryMe.onclick = function () {
                        this.parentElement.parentElement.parentElement.owner.synth();
                }
        }

        synth() {
                this.createDemoPage("synth", "Synthesizer", "Synthesizer/Sound.html");
        }

        gallery(imgArr, index) {
                let background = createElement("div", "gallery" + this.ID, "galleryBackground", this.content);

                document.onkeydown = function (e) {
                        if (getFocusedWindowIndex() != null) {
                                let childArr = windowArr[getFocusedWindowIndex()].content.childNodes;
                                for (i = 0; i < childArr.length; i++) {
                                        if (childArr[i].classList.contains("galleryBackground")) {
                                                if (e.keyCode == 39) {
                                                        right.onclick();
                                                } else if (e.keyCode == 37) {
                                                        left.onclick();
                                                } else if (e.keyCode == 27) {
                                                        background.remove();
                                                }
                                        }
                                }
                        }
                }
                let image = createElement("img", "", "focusedGalleryImg", background);
                image.style.visibility = "hidden";
                let video = createElement("iframe", "", "focusedGalleryVideo", background);
                video.setAttribute('allowFullScreen', '')
                // video.setAttribute('controls', 'controls');
                video.style.visibility = "hidden";
                if (imgArr[index] instanceof VideoAndLabel) {
                        video.src = imgArr[index].src;
                        video.style.visibility = "visible";
                } else {
                        let img = imgArr[index].img;
                        image.src = img.src;
                        image.style.visibility = "visible";
                }
                image.index = index;
                let close = createElement("input", "", "galleryButton galleryCloseButton text", background);
                close.value = "\u2A09";
                close.type = "button";
                close.owner = background;
                close.onclick = function () {
                        this.owner.remove();
                }
                let text = createElement("div", "", "galleryTextBox", background);
                let label = createTextElement("h3", "", "text galleryLabel", imgArr[index].label, text);
                let indexLabel = createTextElement("h3", "", "text galleryIndexLabel", index + 1 + "/" + imgArr.length, text);
                let right = createElement("input", "", "galleryButton galleryRightButton text", background);
                let left = createElement("input", "", "galleryButton galleryLeftButton text", background);
                right.value = ">";
                right.type = "button";
                right.image = image;
                right.video = video;
                right.imgArr = imgArr;
                right.indexLabel = indexLabel;
                right.label = label;
                right.onclick = function () {
                        if (this.image.index + 1 < this.imgArr.length) {
                                if (imgArr[this.image.index] instanceof VideoAndLabel) {
                                        this.video.src = this.imgArr[this.image.index].src;
                                }
                                this.image.index++;
                                if (imgArr[this.image.index] instanceof VideoAndLabel) {
                                        this.video.src = this.imgArr[this.image.index].src;
                                        this.video.style.visibility = "visible";
                                        this.image.style.visibility = "hidden";
                                } else {
                                        this.image.src = this.imgArr[this.image.index].img.src;
                                        this.image.style.visibility = "visible";
                                        this.video.style.visibility = "hidden";
                                }
                                // this.image.src = this.imgArr[this.image.index].img.src;
                                indexLabel.remove();
                                label.remove();
                                label = createTextElement("h3", "", "text galleryLabel", this.imgArr[this.image.index].label, text);
                                indexLabel = createTextElement("h3", "", "text galleryIndexLabel", this.image.index + 1 + "/" + this.imgArr.length, text);
                        }
                }

                left.value = "<";
                left.type = "button";
                left.image = image;
                left.video = video;
                left.imgArr = imgArr;
                left.indexLabel = indexLabel;
                left.label = label;
                left.onclick = function () {
                        if (this.image.index + 1 > 1) {
                                if (imgArr[this.image.index] instanceof VideoAndLabel) {
                                        this.video.src = this.imgArr[this.image.index].src;
                                }
                                this.image.index--;
                                if (imgArr[this.image.index] instanceof VideoAndLabel) {
                                        this.video.src = this.imgArr[this.image.index].src;
                                        this.video.style.visibility = "visible";
                                        this.image.style.visibility = "hidden";
                                } else {
                                        this.image.src = this.imgArr[this.image.index].img.src;
                                        this.image.style.visibility = "visible";
                                        this.video.style.visibility = "hidden";
                                }
                                // this.image.src = this.imgArr[this.image.index].img.src;
                                indexLabel.remove();
                                label.remove();
                                label = createTextElement("h3", "", "text galleryLabel", this.imgArr[this.image.index].label, text);
                                indexLabel = createTextElement("h3", "", "text galleryIndexLabel", this.image.index + 1 + "/" + this.imgArr.length, text);
                        }
                }
        }

        unfixPos() {
                this.x = this.window.getBoundingClientRect().left;
                this.y = this.window.getBoundingClientRect().top;
        }

        fixPos() {
                // this.window.style.left = 100*this.x/document.documentElement.clientWidth+"%";
                // this.window.style.top = 100*this.y/document.documentElement.clientHeight+"%";
                this.left = 100 * this.x / document.documentElement.clientWidth;
                this.top = 100 * this.y / document.documentElement.clientHeight;
                // this.width = this.window.getBoundingClientRect().width+"px";//100*this.window.getBoundingClientRect().width/document.documentElement.clientWidth+"%";
                // this.height = this.window.getBoundingClientRect().height+"px";//100*this.window.getBoundingClientRect().height/document.documentElement.clientHeight+"%";
        }

        fixPos2() {
                // this.window.style.left = 100*this.x/document.documentElement.clientWidth+"%";
                // this.window.style.top = 100*this.y/document.documentElement.clientHeight+"%";\
                this.left = 100 * this.x / document.documentElement.clientWidth;
                this.top = 100 * this.y / document.documentElement.clientHeight;
                this.width = this.window.getBoundingClientRect().width + "px";//100*this.window.getBoundingClientRect().width/document.documentElement.clientWidth+"%";
                this.height = this.window.getBoundingClientRect().height + "px";//100*this.window.getBoundingClientRect().height/document.documentElement.clientHeight+"%";
        }

        maintainDock() {
                if (this.window.classList.value.includes("dockedLeft")) {
                        this.dockLeft();
                } else if (this.window.classList.value.includes("dockedRight")) {
                        this.dockRight();
                }
        }

        pxToPercent(str) {
                let returnVal = str.replace("px", "");
                return 100 * eval(returnVal) / document.documentElement.clientWidth;
        }

        resizeFuncs() {
                let i;
                for (i = 0; i < this.pageSpecificResizeFuncs.length; i++) {
                        this.pageSpecificResizeFuncs[i](this.ID, this.getXPercent(), this.getYPercent());
                }
        }

        resizeWindow() {
                if (!this.fullscreen) {

                        if (this.clicked) {
                                this.window.style.left = this.left;
                                this.window.style.top = this.top;
                        } else {
                                this.window.style.left = this.left + "%";
                                this.window.style.top = this.top + "%";
                        }
                        this.window.style.width = this.width;
                        this.window.style.height = this.height;

                }
                this.minSizeMaintenance();
                this.maintainRoundedEdges();
                this.maintainNavBarText();
                this.sizeWindowButtons();
                this.maintainContentSize();
                this.maintainDock();
                this.window.style.visibility = this.display;
        }

        minSizeMaintenance() {
                if (this.sizeMode < 10) {
                        this.title.style.visibility = "visible";
                        if (this.window.getBoundingClientRect().width < 775) {
                                this.title.style.visibility = "hidden";
                                // if(this.window.getBoundingClientRect().width<this.minWidth){
                                //     this.window.style.width = "640px";
                                //     this.setWPercent(this.getRawWPercent());
                                // }
                        }

                        // if(this.window.getBoundingClientRect().height<this.minHeight){
                        //     this.window.style.height = "480px";
                        //     this.setHPercent(this.getRawHPercent());
                        // }
                }

        }

        showDemoButtons() {
                this.navBarButton[2].style.display = "inline-block";
                this.navBarButton[3].style.display = "inline-block";
                this.navBarButton[4].style.display = "inline-block";
                this.sizeWindowButtons();
        }

        hideDemoButtons() {
                this.navBarButton[2].style.display = "none";
                this.navBarButton[3].style.display = "none";
                this.navBarButton[4].style.display = "none";
        }

        guranteeClickability() {
                if (this.iframe != null) {
                        this.iframe.style.pointerEvents = "auto";
                        let div = createElement("div", "iframeFocusCorrector", "iframeCover", this.content);
                        div.owner = this;
                        div.onclick = function () {
                                div.owner.focus();
                                this.remove();
                        }
                }
        }

        focus() {
                if (this.zIndex != windowArr.length - 1 || this.fullscreen || this.sizeMode == 2 || this.sizeMode == 3) {
                        for (i = this.zIndex + 1; i < windowArr.length; i++) {
                                let index = this.searchForZIndex(i);
                                if (index != -1) {
                                        windowArr[index].setZIndex(windowArr[index].zIndex - 1);
                                }
                        }
                        this.setZIndex(windowArr.length - 1);
                        for (i = 0; i < windowArr.length - 1; i++) {
                                let index = this.searchForZIndex(i);

                                if (index != this.zIndex && index >= 0) {
                                        windowArr[index].guranteeClickability();
                                }
                        }


                        if (this.sizeMode >= 10) {
                                this.sizeMode -= 10;
                        }
                }
                this.display = "visible";
                this.window.style.visibility = "visible";
                currentPage = this.page;
                buildQS();
                buildTaskbar();
        }

        isFocused() {
                if (windowArr.length - 1 == this.zIndex) {
                        return true;
                }
                return false;
        }

        hoverFocus() {
                if (this.zIndex != windowArr.length - 1) {
                        for (i = this.zIndex + 1; i < windowArr.length; i++) {
                                let index = this.searchForZIndex(i);
                                if (index != -1) {
                                        windowArr[index].setZIndex(windowArr[index].zIndex - 1);
                                }
                        }
                        this.setZIndex(windowArr.length - 1);
                        if (this.sizeMode >= 10) {
                                this.sizeMode -= 10;
                        }
                }
                this.display = "visible";
        }

        close() {
                for (i = this.zIndex + 1; i < windowArr.length; i++) {
                        let index = this.searchForZIndex(i);
                        if (index != -1) {
                                windowArr[index].setZIndex(windowArr[index].zIndex - 1);
                        }
                }
                this.window.remove();
                for (i = 0; i < windowArr.length; i++) {
                        if (windowArr[i].ID == this.ID) {
                                windowArr.splice(i, 1);
                        }
                }
                buildQS();
                buildTaskbar();
        }

        minimize() {
                this.display = "hidden";
                this.window.style.visibility = "hidden";
                this.title.style.visibility = "inherit";
                let m;
                for (m = 0; m < windowArr.length; m++) {
                        if (windowArr[m].zIndex == this.zIndex - 1) {
                                windowArr[m].focus();
                                break;
                        }
                }
                this.setZIndex(null);
                if (this.sizeMode < 10) { this.sizeMode += 10; }
                buildTaskbar();
        }

        setZIndex(index) {
                this.zIndex = index;
                this.window.style.zIndex = index;
        }

        searchForZIndex(index) {
                var j;
                for (j = 0; j < windowArr.length; j++) {
                        if (windowArr[j].zIndex == index) {
                                return j;
                        }
                }
                return -1;
        }

        initSizing() {
                this.sizeWindowButtons();
                this.restore();

                //Set intital rounding of corners on body div
                //this.window.style = "border-radius: "+document.documentElement.clientWidth*0.01302083333+"px;";
                //this.navBar.style = "border-radius: "+document.documentElement.clientWidth*0.01142083333+"px "+document.documentElement.clientWidth*0.01142083333+"px 0px 0px;";

                //Set intital size of text in nav bar
                var i;
                for (i = 0; i < this.navBarText.length; i++) {
                        this.navBarText[i].style.clientHeight = this.navBar.clientHeight + "px";
                        this.navBarText[i].style = "font-size:" + this.navBar.clientHeight / 2.3 + "px";

                }

                this.resizeWindow();
        }

        getX() {
                return this.x;
        }

        sizeWindowButtons() {
                for (var i = 0; i < this.navBarButton.length; i++) {
                        this.navBarButton[i].style.width = this.navBarButton[i].clientHeight * 1.1 + "px";
                        this.navBarButton[i].style.fontSize = this.navBar.clientHeight / 2.3 + "px";
                }
                this.navBarButton[0].style.borderRadius = "0px " + document.documentElement.clientWidth * 0.01142083333 + "px 0px 0px;";
                this.navBarButton[0].style.width = this.navBarButton[0].clientHeight * 1.1 + "px";
        }

        setTitle(title) {
                this.title.innerHTML = title;
                this.maintainNavBarText();
        }

        maintainRoundedEdges() {
                if (!this.roundedEdges) {
                        this.squareEdges();
                } else {
                        this.roundEdges();
                }
        }

        maintainFullscreen() {
                if (this.fullscreen) {
                        this.enterFullscreen();
                }
        }

        maintainContentSize() {
                this.content.style.height = this.window.clientHeight - this.navBar.clientHeight + "px";
        }

        maintainNavBarText() {
                //Maintain size of text in nav bar
                var i;
                for (i = 0; i < this.navBarText.length; i++) {
                        this.navBarText[i].style.clientHeight = this.navBar.clientHeight + "px";
                        this.navBarText[i].style.fontSize = this.navBar.clientHeight / 2.3 + "px";
                }
                this.title.style.clientHeight = this.navBar.clientHeight + "px";
                this.title.style.fontSize = this.navBar.clientHeight / 2.3 + "px";
                this.title.style.left = this.navBar.clientWidth / 2 - this.title.clientWidth / 2 + "px";
        }

        toggleFullscreen() {
                if (this.fullscreen) {
                        this.exitFullscreen();
                } else {
                        this.enterFullscreen();
                        this.focus();
                }
                buildQS();

        }

        exitFullscreen() {
                this.sizeMode = 0;
                this.fullscreen = false;
                this.restore();
                this.resizeWindow();
                this.unfixPos();
                this.fixPos();
                this.roundEdges();
                this.resizeFuncs();
        }

        enterFullscreen() {
                this.sizeMode = 1;
                this.fullscreen = true;
                this.window.style = '';
                this.window.classList.add("maximized");
                this.navBarButton[0].style = "width: " + this.navBarButton[1].clientWidth * 1.1 + "px;";
                this.resizeWindow();
                this.squareEdges();
                buildQS();
                this.resizeFuncs();
        }

        navTextHoverStyling() {
                var i;
                for (i = 0; i < this.navBarText.length; i += 2) {
                        this.navBarText[i].onmouseenter = function (e) {
                                console.log("hover");
                                var color = draw.getImageData(e.clientX, e.clientY, 1, 1).data;
                                this.style.color = "rgb(" + color[0] + ", " + color[1] + ", " + color[2] + ")";
                                //this.parentElement.parentElement.owner.maintainNavBarText();
                        }

                        this.navBarText[i].onmouseleave = function () {
                                this.style = "color: rgba(255,255,255,1); font-size:" + this.parentElement.clientHeight / 2.3 + "px;";
                                this.style.clientHeight = this.parentElement.clientHeight + "px";
                                //this.parentElement.parentElement.owner.maintainNavBarText();
                        }
                }
        }

        linkHoverStyling() {
                let linkArr = document.getElementsByClassName("link");
                var i;
                for (i = 0; i < linkArr.length; i++) {
                        linkArr[i].onmouseenter = function (e) {
                                var color = draw.getImageData(e.clientX, e.clientY, 1, 1).data;
                                this.style.color = "rgb(" + color[0] + ", " + color[1] + ", " + color[2] + ")";
                        }

                        linkArr[i].onmouseleave = function () {
                                this.style.color = "rgb(255,255,255)";
                                //this.style.clientHeight = this.parentElement.clientHeight+"px";
                        }
                }
        }

        restore() {
                this.sizeMode = 0;
                this.window.classList.remove("dockedLeft");
                this.window.classList.remove("dockedRight");
                this.window.classList.remove("maximized");
                this.window.style.top = this.x;
                this.window.style.left = this.y;
                this.window.style.width = this.width;
                this.window.style.height = this.height;
                this.window.style.borderRadius = "1% 1% 0% 1%;";
                this.roundEdges();
                this.maintainNavBarText();
                this.maintainContentSize();
        }

        sizeModeSwitch(sizeMode) {
                switch (sizeMode) {
                        case 0:
                        case 10:
                                this.restore();
                                break;
                        case 1:
                        case 11:
                                this.enterFullscreen();
                                this.focus();
                                break;
                        case 2:
                        case 12:
                                this.dockLeft();
                                this.focus();
                                break;
                        case 3:
                        case 13:
                                this.dockRight();
                                this.focus();
                                break;
                }

                if (sizeMode >= 10) { this.minimize(); }
        }

        setPos(x, y) {
                this.x = x;
                this.y = y;
        }

        toggleRoundedEdges() {
                if (this.roundedEdges) {
                        squareEdges();
                } else {
                        roundEdges();
                }
        }

        squareEdges() {
                this.window.classList.remove("rounded");
                this.window.classList.add("squared");
                this.roundedEdges = false;
                // this.window.style.borderRadius = '0px';
                // this.navBar.style.borderRadius = '0px';
                // this.navBarButton[0].style.borderRadius = '0px';
                // this.content.style.borderRadius = '0px';
        }

        roundEdges() {
                this.window.classList.remove("squared");
                this.window.classList.add("rounded");
                this.roundedEdges = true;
                // this.window.style.borderRadius = '25px';
                // this.navBar.style.borderRadius = '19px 19px 0px 0px';
                // this.navBarButton[0].style.borderRadius = '0px 19px 0px 0px';
                // this.content.style.borderRadius = '0px 0px 25px 25px;';

                // this.window.style.borderRadius = document.documentElement.clientWidth*0.01302083333+"px;";
                // this.navBar.style.borderRadius = document.documentElement.clientWidth*0.01142083333 +"px "+document.documentElement.clientWidth*0.01142083333 +"px 0px 0px;";
                // this.navBarButton[0].style.borderRadius = "0px "+document.documentElement.clientWidth*0.01142083333 +"px 0px 0px;";
        }

        pageDown() {

                if (this.pagePast.length > 1) {
                        this.pageFuture.push(this.pagePast.pop());
                        let code = "this." + this.pagePast[this.pagePast.length - 1] + "()";
                        eval(code);
                }
                console.log(this.pagePast);
                console.log(this.pageFuture);
        }

        pageUp() {
                if (this.pageFuture.length != 0) {
                        this.pagePast.push(this.pageFuture.pop());
                        let code = "this." + this.pagePast[this.pagePast.length - 1] + "()";
                        eval(code);
                }
                console.log(this.pagePast);
                console.log(this.pageFuture);
        }
}

function createElement(type, id, classes, parent) {
        element = document.createElement(type);
        if (id != "") {
                element.setAttribute('id', id);
        }
        element.setAttribute('class', classes);
        parent.appendChild(element);
        return element;
}

function createVideoElement(type, id, classes, src, parent) {
        element = document.createElement("iframe");

        if (id != "") {
                element.setAttribute('id', id);
        }
        element.setAttribute('class', classes);
        // console.log(parent);
        // element.setAttribute('src', 'video.html');
        // element.setAttribute('style', "height: 100%; width: 100%;");
        element.setAttribute('srcdoc', '\
    <html>\
        <body style="padding: 0px; margin: 0px;  width: 100vw; height: 100vh; overflow: hidden;">\
            <iframe src='+ src + ' style="width: 100%; height: 100%; border:none; " autoplay muted>\
        </body>\
    </html>\
    ');
        element.setAttribute('allowFullScreen', '');
        parent.appendChild(element);

        return element;
}

function createImageElement(src, id, classes, parent) {
        element = document.createElement("img");
        if (id != "") {
                element.setAttribute('id', id);
        }
        element.setAttribute('class', classes);
        let img = new Image();
        img.src = src;
        element.src = img.src;
        parent.appendChild(element);
        return element;
}

function createTextElement(type, id, classes, text, parent) {
        element = document.createElement(type);
        if (id != "") {
                element.setAttribute('id', id);
        }
        element.setAttribute('class', classes);
        element.innerHTML = text;
        parent.appendChild(element);
        return element;
}

function createLink(linkDef, parent) {
        let container = createElement("div", linkDef.id, "demoDiv", parent);
        // let textDiv = createElement("div", id+"-textDiv", "demoTextDiv", container);
        let titleDiv = createElement("div", linkDef.id + "-title", "demoTitleDiv", container);
        let descDiv = createElement("div", linkDef.id + "-description", "demoDescDiv", container);
        let image;
        if (linkDef.antialiasing) {
                image = createElement("img", linkDef.id + "-thumbnail", "demoThumbImg antialiased", container);
        } else {
                image = createElement("img", linkDef.id + "-thumbnail", "demoThumbImg", container);
        }
        let img = new Image(512, 512);
        img.src = linkDef.thumbnailSrc;
        image.src = img.src;
        let titleText = createTextElement(linkDef.type, linkDef.id, "text link demoTitleText", linkDef.title, titleDiv);
        let dateText = createTextElement(linkDef.type, linkDef.id, "text demoDateText ", linkDef.date, titleDiv);
        let descText = createTextElement(linkDef.type, linkDef.id, "text demoDescText", linkDef.description, descDiv);

        // titleText.onclick = function() {
        //     let windowPointer = this.parentElement.parentElement.parentElement.parentElement.owner;
        //     eval("windowPointer."+page+"()");
        // };

        // image.onclick = function() {
        //     let windowPointer = this.parentElement.parentElement.parentElement.owner;
        //     eval("windowPointer."+page+"()");
        // };

        container.onclick = function () {
                let windowPointer = this.parentElement.parentElement.parentElement.owner;
                eval("windowPointer." + linkDef.page + "()");
        };

        container.onmouseenter = function () {
                this.style.boxShadow = "0 0 0 3.5px rgba(0,0,0,0.4)";
        };

        container.onmouseleave = function () {
                this.style.boxShadow = "";
        };

        // image.onmouseenter = function() {
        //     this.parentElement.style.boxShadow = "0 0 0 3.5px rgba(0,0,0,0.4)";
        // };

        // image.onmouseleave = function() {
        //     this.parentElement.style.boxShadow = "";
        // };

        // titleDiv.onmouseenter = function() {
        //     console.log("enter")
        //     this.parentElement.style.boxShadow = "0 0 0 3.5px rgba(0,0,0,0.4)";
        // };

        // titleDiv.onmouseleave = function() {
        //     this.parentElement.style.boxShadow = "";
        // };
        titleText.parentElement.parentElement.parentElement.parentElement.parentElement.owner.linkHoverStyling();
        return container;
}

function createProjectThumb(imgSrc, id, name, parent) {
        let container = createElement("div", id, "projectThumb", parent);
        let image = createElement("img", "", "projectThumbImg", container);
        let img = new Image(512, 512);
        img.src = imgSrc;
        image.src = img.src;
        createTextElement("h4", "", "projectThumbText text link", name, container);
        return container;
}

class Gallery {
        constructor(id, parent, title) {
                this.container = createElement("div", id, "gallery", parent);
                if (title != null) {
                        this.title = createTextElement("h2", "", "text", title, this.container);
                }
                this.imgArr = [];
        }

        addImage(label, imgSrc) {
                let image = createElement("img", "", "galleryImg", this.container);
                let img = new Image();
                img.src = imgSrc;

                image.src = img.src;
                image.index = this.imgArr.length;
                image.owner = this;
                this.imgArr.push(new ImgAndLabel(img, label));
                image.onclick = function () {
                        this.parentElement.parentElement.parentElement.parentElement.owner.gallery(this.owner.imgArr, this.index);
                }
        }

        addVideo(label, videoSrc, thumbSrc) {
                let img = createElement("img", "", "galleryImg", this.container);
                let image = new Image();
                image.src = thumbSrc;
                img.src = image.src;
                img.index = this.imgArr.length;
                img.owner = this;
                this.imgArr.push(new VideoAndLabel(img, videoSrc, label));
                img.onclick = function () {
                        this.parentElement.parentElement.parentElement.parentElement.owner.gallery(this.owner.imgArr, this.index);
                }
        }
}

class ImgAndLabel {
        constructor(img, label) {
                this.img = img;
                this.label = label;
        }
}

function getFocusedWindowIndex() {
        if (windowArr == []) {
                return null;
        }
        let zIndex = windowArr[0].zIndex;
        let index = 0;
        for (i = 0; i < windowArr.length; i++) {
                if (windowArr[i].zIndex > zIndex) {
                        zIndex = windowArr[i].zIndex;
                        index = i;
                }
        }
        return index;
}

class VideoAndLabel {
        constructor(videoThumb, videoSrc, label) {
                this.videoThumb = videoThumb;
                this.src = videoSrc;
                this.label = label;
        }
}

class Table {
        constructor(parent) {
                this.parent = parent;
                this.tableDiv = createElement("div", "", "tableDiv text", this.parent);
                this.table = [];
        }

        // addRow(entries){
        //     for(c=0; c<entries.length; c++){
        //         let tableEntryDiv = createElement("div", "", "tableEntryDiv", this.parent);
        //         entries[c]
        //     }
        // }
        addTitles(titles) {
                let tableRowDiv = createElement("div", "", "tableRowDiv", this.tableDiv);
                let width = (100 / titles.length);
                let c;
                this.table.push([]);
                for (c = 0; c < titles.length; c++) {
                        let tableEntryDiv = createElement("div", "", "tableEntryDiv", tableRowDiv);
                        tableEntryDiv.style.width = width + "%";
                        tableEntryDiv.style.left = c * width + "%";
                        createTextElement("h3", "", "tableTitle", titles[c], tableEntryDiv);
                        this.table[this.table.length - 1].push(tableEntryDiv);
                }
        }

        addTextAndImage(text, imageSrc) {
                let tableRowDiv = createElement("div", "", "tableRowDiv", this.tableDiv);
                let width = (100 / titles.length);
                let c;
                this.table.push([]);
                let tableEntryDiv = createElement("div", "", "tableEntryDiv", tableRowDiv);
                tableEntryDiv.style.width = 20 + "%";
                tableEntryDiv.style.left = 0 + "%";
                createTextElement("h3", "", "tableTitle", titles[c], tableEntryDiv);
                this.table[this.table.length - 1].push(tableEntryDiv);
                let tableEntryDiv2 = createElement("div", "", "tableEntryDiv", tableRowDiv);
                tableEntryDiv.style.width = 80 + "%";
                tableEntryDiv.style.left = 20 + "%";
                let image = createElement("img", "", "tableImg", tableEntryDiv2);
                let img = new Image();
                img.src = imageSrc;
                this.table[this.table.length - 1].push(tableEntryDiv2);
        }
}

class LinkDef {
        constructor(type, id, title, date, thumbnailSrc, antialiasing, description, page) {
                this.type = type;
                this.id = id;
                this.title = title;
                this.date = date;
                this.thumbnailSrc = thumbnailSrc;
                this.antialiasing = antialiasing;
                this.description = description;
                this.page = page;
        }

}
