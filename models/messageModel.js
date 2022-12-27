const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
  {
    message: {
       type: String, required: true
    },
    users: { 
        from: { type: String, required: true },
        to: { type: String, required: true }
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("mensagens", messageSchema);