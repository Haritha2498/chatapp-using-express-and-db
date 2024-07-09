const {Schema}= require('mongoose');
const {model}=require('mongoose');


const chatmsgschema=new Schema({
    sender: {type: String,required: true,},
    
    receiver: {type: String,required: true,},
    
    msg: {type:String,required: true},

    time:{type: String,required: true}

})


const chatmsgmodel=model("chats",chatmsgschema);
module.exports=chatmsgmodel;