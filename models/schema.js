const {Schema}= require('mongoose');
const {model}=require('mongoose');



const chatappupschema=new Schema({
    username: {type: String,required: true,},
    
    useremail: {type: String,required: true,unique: true},
    
    password: {type: String,required: true}

})


const chatappupmodel=model("chatappuser_password",chatappupschema);
module.exports=chatappupmodel;