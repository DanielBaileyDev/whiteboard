# whiteboard
Full Stack web app that allows users to create whiteboards and collaborate with others. Boards are deleted 24 hours after being created.

**Link to project:** https://whiteboardcollabs.onrender.com/

## How It's Made:

**Tech used:** HTML, CSS, JavaScript, Node, Express, Socket.io, MongoDB

The user first clicks the create board button which sends a get request to the server that creates a new board in the database and returns the unique id to the user for the url. When the page is loaded the user connects to socket.io and is put into a group with the unique id and is sent the data needed to recreate the canvas of that group. When the user draws a line it gets the mouse coordinates and puts a dot there, this results in gaps when drawing a line, to fix this I stored the previous mouse coordinates with the current and use a for loop to fill in the line. The line is then sent to the server which will store the line in the database and send it to all other users in the same group.

## Lessons Learned:

Data being passed between the user and server should be kept small. At first I sent the image data of the canvas but this resulted in slow speeds. I later swapped it to only send the information needed to draw each line then redraw it on the client side, this resulted in much faster speeds.
