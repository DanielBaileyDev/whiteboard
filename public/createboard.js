document.getElementById('newBoard').addEventListener('click', createBoard);

function createBoard(){
    let room = Math.floor(Math.random() * 10000);
    window.location = `/whiteboard/${room}`;
}