const WIDTH = 1200;
const HEIGHT = 800;

let socket = io();

const canvas = document.getElementById('whiteboard');
const ctx = canvas.getContext('2d');
canvas.width = WIDTH;
canvas.height = HEIGHT;

const whiteboard = new Whiteboard();

document.addEventListener('mousedown', mouseOn);
canvas.addEventListener('mousemove', drawSend);
document.addEventListener('mouseup', mouseOff);

function mouseOn(mouse){
    let curr = [mouse.offsetX, mouse.offsetY];
    if(whiteboard.mouseOn(mouse))
        socket.emit('canvas', {
            previous: [], 
            current: curr
        });
}

function mouseOff(mouse){
    whiteboard.mouseOff(mouse);
}

function drawSend(mouse){
    let prev = whiteboard.prevMouseLocation;
    let curr = [mouse.offsetX, mouse.offsetY];
    if(whiteboard.canDraw(mouse))
        socket.emit('canvas', {
            previous: prev, 
            current: curr
        });
}

socket.on('canvas', lines => {
    lines.forEach(line=>whiteboard.draw(line.previous, line.current));
});