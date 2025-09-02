var canvas = document.getElementById('backgroundCanvas');
var draw = canvas.getContext('2d');
var backgroundImage = document.createElement('canvas');
var backDraw = backgroundImage.getContext('2d');

function canvasOnLoad() {
        generateBackgroundImage();
        canvasResize();
}

function canvasResize() {
        canvas.width = document.documentElement.clientWidth;
        canvas.height = document.documentElement.clientHeight;
        applyBackgroundImage();
}

function generateBackgroundImage() {

        backgroundImage.width = 100;//window.screen.width;
        backgroundImage.height = 100;//window.screen.height;
        let height = backgroundImage.height;
        let width = backgroundImage.width;
        for (x = 0; x < width; x++) {
                for (y = 0; y < height; y++) {

                        let r = 255 * x / width;

                        let g = 255 * (y) / height;// + (width - x);

                        let b = 150 * (width - x) / width;

                        backDraw.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')';

                        backDraw.fillRect(x, y, 1, 1);
                }
        }
}

function applyBackgroundImage() {
        draw.imageSmoothingEnabled = true;
        draw.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
}
