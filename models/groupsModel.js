const mongoose = require("mongoose");

const groupsSchema = mongoose.Schema(
  {
    name: {
       type: String, require: true
    },
    message: {
       type: String,
    },
    from: { 
        type: String,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("grupos", groupsSchema);