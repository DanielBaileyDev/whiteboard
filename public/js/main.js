const WIDTH = 1200;
const HEIGHT = 800;

let socket = io();

const whiteboard = new Whiteboard(WIDTH, HEIGHT);

whiteboard.canvas.addEventListener('contextmenu', evt => { 
        evt.preventDefault();
});

document.addEventListener('mousedown', mouseOn);
whiteboard.canvas.addEventListener('mousemove', drawSend);
document.addEventListener('mouseup', mouseOff);

function mouseOn(mouse) {
    let curr = [mouse.offsetX, mouse.offsetY];
    if (setTool(mouse.which) && whiteboard.mouseOn(mouse)) {
        sendLine([], curr);
    }
}

function mouseOff() {
    whiteboard.mouseOff();
}

function drawSend(mouse) {
    let prev = whiteboard.prevMouseLocation;
    let curr = [mouse.offsetX, mouse.offsetY];
    if (whiteboard.canDraw(mouse)) {
        sendLine(prev, curr);
    }
}

function setTool(mouseButton){
    if (mouseButton === 1) {
        whiteboard.tool = 'pencil';
    } else if (mouseButton === 3) {
        whiteboard.tool = 'eraser';
    } else{
        return false;
    }
    return true;
}

function sendLine(prev, curr){
    let boardName = window.location.href.split('/').at(-1);
        socket.emit('board', {
            name: boardName,
            line: {
                tool: whiteboard.tool,
                previous: prev,
                current: curr
            }
        });
}

socket.on('board', lines => {
    lines.forEach(line => {
        whiteboard.tool = line.tool;
        whiteboard.draw(line.previous, line.current);
    });
});