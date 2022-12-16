const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema(
  {
    message: {
       type: String, required: true
    },
    users: { 
        from: { type: String },
        to: { type: String }
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("mensagens", MessageSchema);