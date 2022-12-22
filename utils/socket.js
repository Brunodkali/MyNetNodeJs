function socket(server) {
    const io = require('socket.io')(server);
    const Mensagens = require("../models/messageModel");
    
    io.on('connection', async (socket) => {
        console.log(`Chat conectado ${socket.id}`);
        socket.on('disconnect', () => {
          console.log(`${socket.id} disconnected`);
        });
      
        socket.on('escolhaPessoa', async data => {
          const from = data['users']['from'];
          const to =  data['users']['to'];
          const msgsDatabase = await Mensagens.find({ users: {from: from, to: to }}).sort({datefield: -1});
          console.log(msgsDatabase);
          const msgsDatabaseTo = await Mensagens.find({ users: {from: to, to: from }}).sort({datefield: -1});
          console.log(msgsDatabaseTo);
          socket.emit('previousMessage', msgsDatabase);
          socket.emit('previousMessageTo', msgsDatabaseTo);
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
}

module.exports = socket;