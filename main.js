const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.port || 3000;
const path = require('path');
const bodyParser = require("body-parser");
const userRouteGoogle = require('./routes/googleAuth.js');
const authRoutes = require("./routes/userRouter.js");
const messageRoutes = require("./routes/messageRouter.js");

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use('/public', express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/', authRoutes, userRouteGoogle, messageRoutes);

app.get('/', (req, res) => {
    res.render('index');
});

io.on('connection', async (socket, req, res) => {
    console.log(`Chat conectado ${socket.id}`);
});

io.on("disconnect", () => {
    console.log('Chat desconectado');
    socket.emit("disconnect");
    io.connect();
});
 
server.listen(port, (req, res) => {
    console.log(`Servidor rodando em ${port}`);
});