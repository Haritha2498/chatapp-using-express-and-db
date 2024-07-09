const {Schema}= require('mongoose');
const {model}=require('mongoose');

const profileschema=new Schema({
    logeduser: {type: String,required: true,},

    setname: {type: String,required: true,},
    
    about: {type: String,required: true,}


})


const profilemodel=model("profile",profileschema);
module.exports=profilemodel;