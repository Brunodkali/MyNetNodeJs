const mongoose = require("mongoose");

const groupsSchema = mongoose.Schema(
  {
    name: {
       type: String,
    },
    message: {
       type: String, required: true
    },
    from: { 
        type: String,  required: true
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("grupos", groupsSchema);