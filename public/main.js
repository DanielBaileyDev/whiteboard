const WIDTH = 1200;
const HEIGHT = 800;

let socket = io();

const canvas = document.getElementById('whiteboard');
const ctx = canvas.getContext('2d');
canvas.width = WIDTH;
canvas.height = HEIGHT;

let isDrawing = false;
let prevMouseLocation = [];

document.addEventListener('mousedown', turnOn);
canvas.addEventListener('mousemove', draw);
document.addEventListener('mouseup', turnOff);

// Draws circles from previous mouse location to current mouse location to prevent skipping
// fix problem: skipping when going from canvas to body
function draw(mouse){
    if(isDrawing && (prevMouseLocation.length === 0 || (prevMouseLocation[0] !== mouse.offsetX || prevMouseLocation[1] !== mouse.offsetY))){
        ctx.beginPath();
        if(prevMouseLocation.length > 0){
            let differenceX = prevMouseLocation[0] - mouse.offsetX;
            let differenceY = prevMouseLocation[1] - mouse.offsetY;
            let xMultiplier = 1;
            let yMultiplier = 1;
    
            if(differenceX < 0){
                xMultiplier = -1;
            }
            if(differenceY < 0){
                yMultiplier = -1;
            }
    
            differenceX = Math.abs(differenceX);
            differenceY = Math.abs(differenceY);
    
            if(differenceX >= differenceY){
                let ratio = differenceY / differenceX;
                for(let i = 0; i <= differenceX; i++){
                    ctx.arc(mouse.offsetX + i * xMultiplier, mouse.offsetY + i * yMultiplier * ratio, 5, 0, Math.PI*2, true);
                }
            }else{
                let ratio = differenceX / differenceY;
                for(let i = 0; i <= differenceY; i++){
                    ctx.arc(mouse.offsetX + i * xMultiplier * ratio, mouse.offsetY + i * yMultiplier, 5, 0, Math.PI*2, true);
                }
            }
        }else{
            ctx.arc(mouse.offsetX, mouse.offsetY, 5, 0, Math.PI*2, true);
        }
        ctx.fill();
        prevMouseLocation = [mouse.offsetX, mouse.offsetY];
        socket.emit('canvas', makeSmall());
    }
}

function makeSmall(){
    let canvasContents = canvas.toDataURL();
    let data = { image: canvasContents, date: Date.now() };
    let string = JSON.stringify(data);
    return string;
}

function makeBig(newCanvas){
    var data = JSON.parse(newCanvas);
    var image = new Image();
    image.onload = function () {
        ctx.drawImage(image, 0, 0);
    }
    image.src = data.image;
}

socket.on('canvas', newCanvas => {
    makeBig(newCanvas);
});

function turnOn(mouse){
    isDrawing = true;
    if(mouse.srcElement.id === 'whiteboard'){
        draw(mouse);
    }
}

function turnOff(){
    isDrawing = false;
    prevMouseLocation = [];
}