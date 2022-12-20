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
const Mensagens = require("./models/messageModel");

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

io.on('connection', async (socket) => {
  console.log(`Chat conectado ${socket.id}`);
  socket.on('disconnect', () => {
    console.log(`${socket.id} disconnected`);
  });

  socket.on('escolhaPessoa', async data => {
    const from = data['users']['from'];
    const to =  data['users']['to'];
    const msgsDatabase = await Mensagens.find({
      users: {
        from: from,
        to: to,
      },
    }).sort({datefield: -1});
    const msgsDatabase2 = await Mensagens.find({
      users: {
        from: to,
        to: from,
      },
    }).sort({datefield: -1});
    
    socket.emit('previousMessageFrom', msgsDatabase);
    socket.emit('previousMessageTo', msgsDatabase2);
  });

  socket.on('sendMessage', async data => {
    try {
      const from = data['users']['from'];
      const to = data['users']['to'];
      const message = data['message'];
      const msgadd = await Mensagens.create({
        message: message ,
        users: {
          from,
          to
        },
      });
      socket.broadcast.emit('receveidMessage', msgadd)
    }catch(err) {
      return err;
    }
  });
});

server.listen(port, (req, res) => {
    console.log(`Servidor rodando em ${port}`);
});