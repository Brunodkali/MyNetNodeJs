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
    const { from, to, message } = req.body;
    const data = await Mensagens.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });

    if (data) return res.json({ msg: "Message added successfully." });
    else return res.json({ msg: "Failed to add message to the database" });
  }catch(err) {
    return err;
  }
};