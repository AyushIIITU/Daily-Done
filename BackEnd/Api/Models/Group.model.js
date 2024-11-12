const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema(
  {
    connectionID: String,
    member:[ {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],
    name: String,
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    description: {
      type: String,
    },
    type:{
        type:String,
        require:true,
        enum:["Public","Private"]
    },
    password:{
        type:String,
    },
    avatar:{
        type:String,
        default:'/GroupIcon/Ant.svg'
    },
    removeMember:{
        type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }

  },
  {
    timestamps: true,
  }
);

const Group = new mongoose.model("Group", GroupSchema);

module.exports = Group;
