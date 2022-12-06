const express = require('express');
const app = express();
const PORT = 8800;


app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
});