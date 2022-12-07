document.getElementById('newBoard').addEventListener('click', createBoard);

async function createBoard(){
    let res = await fetch('/createboard', {method: 'GET'});
    window.location = `/whiteboard/${await res.json()}`;
}