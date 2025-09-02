const https = require('https');
const http = require('http');
const fs = require('fs');
// const express = require('express');
const path = require('path');
let local = true;
let port = 443;
let httpPort = 80;
if (local) {
    httpPort = 8080;
}
var errorPage;

fs.readFile('portfolio/404.html', function(error, content) {

    errorPage = content;
});

function isURL(ext) {
    switch (ext) {
        case '.js':
        case '.css':
        case '.json':
        case '.png':
        case '.jpg':
        case '.ico':
        case '.wav':
        case '.wasm':
        case ".html":
            return false;
        case "":
            return true;
        default:
            return true;
    }
}



const httpServer = http.createServer(function(req, res) {
    if (local) {
        res.writeHead(301, { Location: "https://localhost" + req.url });
    } else {
        res.writeHead(301, { Location: "https://por:tfolio.agreenweb.com" + req.url });
    }
    res.end();
}).listen(httpPort, function(error) {
    if (error) {
        console.log("Something went wrong", error);
    } else {
        console.log("Server is listening on port " + httpPort);
    }
});

const cert = fs.readFileSync('ssl/cert.pem');
const ca = fs.readFileSync('ssl/chain.pem');
const key = fs.readFileSync('ssl/privkey.pem');

const server = https.createServer({ cert, ca, key }, function(req, res) {

    var filePath = '.' + req.url;
    if (filePath == './')
        filePath = './index.html';

    var extname = path.extname(filePath);
    var contentType = 'text/html';
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
            contentType = 'image/jpg';
            break;
        case '.wav':
            contentType = 'audio/wav';
            break;
        case '.wasm':
            contentType = 'application/wasm';
            break;
    }

    if (extname.includes("}")) {
        extname = "";
    }

    res.writeHead(200, { 'Content-Type': contentType });
    if (isURL(extname)) {//extname = "" || filePath.includes("?")){
        try {
            parseUrl(filePath, res, req);
        } catch (e) {
            res.write(modIndex("notFound"));
            res.end();
            console.log("Error: " + e);

        }
    } else {
        fs.readFile('portfolio/' + filePath, function(error, data) {
            if (error) {

                res.write(errorPage);//"<h1>404: File not found.</h1>");
                console.log("404: File not found. " + filePath + "   (" + req.socket.remoteAddress + ")");
            } else {
                res.write(data);
                console.log("(" + req.socket.remoteAddress + ") Files served." + filePath);
            }
            res.end();
        });
    }
});

server.listen(port, function(error) {
    if (error) {
        console.log("Something went wrong", error);
    } else {
        console.log("Server is listening on port " + port);
    }
});

function modIndex(fn) {
    let injectedFunction = "windowArr[0]." + fn + "();buildQS();";
    return "<!DOCTYPE html><html><head><title>Home</title><link rel='stylesheet' href='style.css'></head><body><canvas id='backgroundCanvas'></canvas><div id='taskbar'></div><div id='desktop'></div><script>function loadPage(){" + injectedFunction + "}</script><script src='canvas.js'></script><script src='desktopShortcut.js'></script><script src='window.js'></script><script src='main.js'></script></body></html>";
}

function createInitWindows(windowArr) {
    let injectedFunction = "clearAllWindows();";

    for (i = 0; i < windowArr.length; i++) {
        injectedFunction += "createInitWindow('" + windowArr[i][0] + "'," + windowArr[i][1] + ",'" + windowArr[i][2] + "','" + windowArr[i][3] + "','" + windowArr[i][4] + "','" + windowArr[i][5] + "','" + windowArr[i][6] + "');";
    }
    return "<!DOCTYPE html><html><head><title>Home</title><link rel='stylesheet' href='style.css'></head><body><canvas id='backgroundCanvas'></canvas><div id='taskbar'></div><div id='desktop'></div><script>function loadPage(){" + injectedFunction + "}</script><script src='canvas.js'></script><script src='desktopShortcut.js'></script><script src='window.js'></script><script src='main.js'></script></body></html>";
}

function parseUrl(filePath, res, req) {
    let fn = filePath.replace("./", '');
    if (!String(fn).includes("?")) {
        processCleanUrl(fn, res, req);
    } else {
        let stateArr = String(fn).split("?");
        let currentPage = stateArr[0];
        let queryString = stateArr[1];
        let windowArr = processQS(queryString);
        for (i = 0; i < windowArr.length; i++) {
            if (!urlSwitch(String(windowArr[i][0]).replace('()', ''))) {
                console.log("405: File not found. " + fn + "   (" + req.socket.remoteAddress + ")");
                res.write(modIndex("notFound"));
                res.end();
                return;
            }
        }
        res.write(createInitWindows(windowArr));
    }

    res.end();
}

function processCleanUrl(fn, res, req) {
    if (urlSwitch(fn)) {
        res.write(modIndex(fn));
    } else {
        console.log("406: File not found. " + fn + "   (" + req.socket.remoteAddress + ")");
        res.write(modIndex("notFound"));
    }
}

function processQS(qs) {
    qs = qs.replace(/!/g, '%');
    let splitQS = qs.split("+");
    let windowArr = [];
    for (i = 0; i < splitQS.length; i++) {
        let temp = splitQS[i].split("=");
        temp[1] = temp[1].replace('{', '');
        temp[1] = temp[1].replace('}', '');
        windowArr.push(temp[1]);
    }
    for (i = 0; i < windowArr.length; i++) {
        windowArr[i] = windowArr[i].split(':');
    }
    return windowArr;

}

function replaceAll(s, s1, s2) {
    let temp = s;
    for (i = 0; i < splitQS.length; i++) {
        temp = temp.replace('{', '');
    }
}

function urlSwitch(fn) {
    switch (fn) {
        case 'home':
        case 'todo':
        case 'projects':
        case 'resume':
        case 'graph':
        case 'graphCover':
        case 'gbaCover':
        case 'synth':
        case 'synthCover':
        case 'snowflake':
        case 'snowflakeCover':
        case 'platformer':
        case 'platformerCover':
        case 'paint':
        case 'paintCover':
        case 'minecraftDemo':
        case 'minecraftDemoCover':
        case 'crt':
        case 'crtCover':
        case 'wireframe':
        case 'morse':
        case 'linetest':
        case 'handheld':
        case 'oscilloscopeCover':
        case 'oscilloscopeVideo':
        case 'webGL':
        case 'webGPU':
        case 'gol':
        case 'pLife':
        case 'spacegameCover':
        case 'perlin':
            return true;
            break;
    }
    return false;
}
