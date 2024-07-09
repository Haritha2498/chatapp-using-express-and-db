const express=require('express');
const app=express();

const port=3010;

const path=require('path');


app.use(express.static(path.join(__dirname,'public')));
app.use(express.json())
app.use(express.urlencoded({extended:false}))


const mongoose=require('mongoose');

mongoose.connect(
    "mongodb://localhost:27017/chatappuser"
)

const database=mongoose.connection;
database.on("error",(error)=>
{
    console.log(error)
});
database.once("connected",()=>
{
    console.log("database connected");
})

const db1=require('/home/haritha/chatapp/models/schema.js')
const db2=require('/home/haritha/chatapp/models/profile.js')
const db3=require('/home/haritha/chatapp/models/chatmsg.js')




app.get('/',(req,res)=>
{
    res.sendFile(path.join(__dirname,'public/static','welcome.html'))
})

app.get('/signup',(req,res)=>
{
    res.sendFile(path.join(__dirname,'public/static','signup.html'))
})


app.get('/login',(req,res)=>
{
    res.sendFile(path.join(__dirname,'public/static','login.html'))
})


app.get('/home',(req,res)=>
{
    res.sendFile(path.join(__dirname,'public/static','home.html'))
})

app.get('/setting',(req,res)=>
{
    res.sendFile(path.join(__dirname,'public/static','setting.html'))
})


app.get('/chat/:friendname',(req,res)=>
{
    res.sendFile(path.join(__dirname,'public/static','chat.html'))
})



app.get('/personcontactinfo/:name',(req,res)=>
{
    res.sendFile(path.join(__dirname,'public/static','personcontactinfo.html'))
})


app.post('/signup',(async(req,res)=>
{
    const {username, useremail, password} = req.body;
    
    const newuserr={username, useremail, password}
    console.log(newuserr)
    try{
        const exist=await db1.findOne({username:username});
        if(exist){
            res.send("User already exists. Click login")
        }
        else{
            const data=await db1.create(newuserr)
            // console.log("data")
            res.redirect('/login')
        }
    }
    catch(error){
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}))
let logeduser="user";

app.post('/login',async(req,res)=>
{
    const { username, password } = req.body;
    
    try{
        const user = await db1.findOne({ username: username });
        if (!user) {
            return res.send("Invalid username or password. Please signup first");
        }
        if (user.password === password) { 
            logeduser=username;
            console.log("loged user inside login")
            console.log(logeduser)
            return res.redirect('/home');
        }
        else {
            return res.send("Invalid username or password. Please signup first");
        }

    }
    catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
      }
})


//change profile

app.post('/changeprofile',async(req,res)=>
{
    try{

    
    const{setname,about}=req.body;
    const update={logeduser,setname,about}
    // console.log(logeduser);
    const exist=await db2.findOne({logeduser:logeduser})
    const options = { new: true };
    if(exist){
        const updateddetails=await db2.findOneAndUpdate({logeduser:logeduser},update,options);
        
    }
    else{
        const data=await db2.create(update)
        

    }}
    catch(error){
        console.log(error);
        res.status(500).json({ message: error.message });
    }
})


app.get('/profile',async(req,res)=>{
    const exist=await db2.findOne({logeduser:logeduser})
    // console.log(logeduser)
    // console.log(exist)
    res.json(exist)
}) 


//function to display friend details in personal info page

app.get('/getpersonalinfo/:name',async(req,res)=>
{
    const usename=req.params.name;
    try{
        const db1data = await db1.findOne({ username: usename });
        console.log("inside getpersonalinfo name")
        console.log(db1data)
        const db2data = await db2.findOne({ logeduser: usename });
        console.log(db2data);
        const email=db1data.useremail;
        const about=db2data.about;
        const data={usename,email,about};
        console.log(data);
        res.json(data);

    }
    catch(error){
        console.log("error in getpersonalinfo js")
    }
   
})



//function to get all users to print on the chat div

app.get('/getfriends',async(req,res)=>
{
    const data=await db2.find();
    // console.log(data)
    res.json(data);
})

//function to post a msg into db

app.post('/sendmsg/:name',async(req,res)=>
{
    try{

    let {msg}=req.body;
    if (typeof msg !== 'string') {
        throw new Error('Message must be a string');
    }

    
    const receiver=req.params.name;
    // console.log("data")
    const time = new Date().toISOString();
    const sender=logeduser
    const data={sender,receiver,msg,time};
    const datamsg=await db3.create(data);
    //console.log(data);
    // res.status(201).send({ message: 'Message sent successfully', data: datamsg });

    // const dbdata = await db3.find({ sender: sender, receiver: receiver });
    // console.log(dbdata);
    // res.json(dbdata);
    res.redirect(`/chat/${receiver}`)
    }
    catch (error) {
    console.error('Error sending message:', error);
    res.status(500).send({ error: 'Failed to send message' });
}
})


//function to display friend messages while loading page;

app.get('/getfriendmsg/:name',async(req,res)=>
{
    const receiver=req.params.name;
    const sender=logeduser
    try{
        const mymsg = await db3.find({ sender: sender, receiver: receiver });
        // console.log(mymsg);

        const friendmsg = await db3.find({ sender: receiver, receiver: sender });
        // console.log(friendmsg);
        const data=[...mymsg,...friendmsg];
        // console.log(data);

//here
        res.json(data)

    }
    catch (error) {
        console.error('Error sending message:', error);
        res.status(500).send({ error: 'Failed to send message' });
    }
}
)

app.listen(port,()=>
{
    console.log("server is running on port : "+port);
})