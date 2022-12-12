const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const database = require('./models/database.js');
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res)=>{
    io.on('connection', async socket => {
        console.log(`Socket conectado ${socket.id}`);
        let emailAtual = req.body.email;
        console.log(emailAtual)
        let msgsDatabase = await database.collection('mensagens').find({ "email": 'duartebruno581@gmail.com'}).toArray();
    
        socket.emit('previousMessage', msgsDatabase);
        socket.on('sendMessage', data => {
            let doc = { email: 'duartebruno581@gmail.com', msg: data }
            let insert = database.collection('mensagens').insertOne(doc);
            socket.broadcast.emit('receivedMessage', data);
        });
    });
});