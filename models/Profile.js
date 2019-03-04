const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const profileSchema = new Schema({
    type:{
        type:String
    },
    description:{
        type:String
    },
    income:{
        type:String,
        required:true
    },
    expense:{
        type:String,
        required:true
    },
    cash:{
        type:String,
        required:true
    },
    remark:{
        type:String
    },
    identity:{
        type:String,
        require:true
    },
    date:{
        type:Date,
        default:Date.now
    }
});

module.exports = Profile = mongoose.model("profile",profileSchema);