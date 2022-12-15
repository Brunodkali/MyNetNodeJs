const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.port || 3000;
const path = require('path');
const bodyParser = require("body-parser");
const cors = require('cors');
const userRouteGoogle = require('./routes/googleAuth.js');
const authRoutes = require("./routes/userRouter.js");
const { getMessages } = require("./controllers/messageController");
const { axios } = require('axios');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use('/public', express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use('/', authRoutes, userRouteGoogle);

app.get('/', (req, res) => {
    res.render('index');
});

app.post("/getmsg", getMessages, async (req, res)=> {
    var mensagem = req.msgsDatabase;
    console.log(mensagem);
});

io.on('connection', (socket) => {
    var json = [
        {
          message: 'Olá',
          users: {
            from:  'Bruno',
            to: 'Bruno Duarte',
          }
        }
    ]
    console.log(`Chat conectado ${socket.id}`);
    socket.on('disconnect', () => {
      console.log(`${socket.id} disconnected`);
    });

    socket.emit('previousMessage', json);

    socket.on('sendMessage', data => {
        axios.get('http://localhost/addmsg').then(resp => {
        console.log(resp.data);
        });
    });
});

server.listen(port, (req, res) => {
    console.log(`Servidor rodando em ${port}`);
});