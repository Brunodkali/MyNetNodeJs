const Mensagens = require("../models/messageModel");

module.exports.getMessages = async (req, res) => {
  try {
    const from = req.body.username;
    const to = req.body.to;
    console.log(from, to);
    const messages = await Mensagens.find({
      users: {
       from: from,
       to: to,
      },
    }).sort({ updatedAt: 1 });
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