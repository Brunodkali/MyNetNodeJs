function socket(server) {
    const io = require('socket.io')(server);
    const Mensagens = require("../models/messageModel");
    const Grupos = require("../models/groupsModel.js");
    
    io.on('connection', async (socket) => {
        console.log(`Chat conectado ${socket.id}`);
        socket.on('disconnect', () => {
          console.log(`${socket.id} disconnected`);
        });
      
        socket.on('escolhaPessoa', async data => {
          const from = data['users']['from'];
          const to =  data['users']['to'];
          const msgFrom =  await Mensagens.find( { users: {  from: from, to: to } });
          const msgTo =  await Mensagens.find( { users: { from: to, to: from } });
          var arrayMsg = msgFrom.concat(msgTo);
          const orderedArray = arrayMsg.sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
          socket.emit('previousMessage', orderedArray);
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
              }
            });
            io.sockets.emit('receveidMessage', msgadd)
          }catch(err) {
            return err;
          }
        });

        socket.on('escolhaGrupo', async data => {
          const from = data['users']['from'];
          const to =  data['users']['to'];
          const msgFrom =  await Grupos.find( { users: {  from: from, to: to } });
          const msgTo =  await Grupos.find( { users: { from: to, to: from } });
          var arrayMsg = msgFrom.concat(msgTo);
          const orderedArray = arrayMsg.sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
          socket.emit('previousMessageGrups', orderedArray);
        });
    });
}

module.exports = socket;