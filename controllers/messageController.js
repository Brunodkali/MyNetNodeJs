const Mensagens = require("../models/messageModel");

module.exports.getMessages = async (req, res, next) => {
  try {
    const from = req.body.username;
    const to = req.body.to;
    const emailUsuario = req.body.email;
    const auth = req.body.auth;

    res.render('menu', { 
      usuario: from, 
      email: emailUsuario, 
      auth: auth, 
      listaUsuarios: 'listaUsuarios',
    });
    
    const msgsDatabase = await Mensagens.find({
      users: {
        from: from,
        to: to,
      },
    });
    req.msgsDatabase = msgsDatabase
    next();
 }catch(err) {
    return err;
  }
};

module.exports.addMessage = async (req, res, next) => {
  try {
    const from = req.body.from;
    const to = req.body.para;
    const message = req.body.message
    const msgadd = await Mensagens.create({
      message: message ,
      users: [from, to],
    });
    req.msgadd = msgadd
    next();
  }catch(err) {
    return err;
  }
};