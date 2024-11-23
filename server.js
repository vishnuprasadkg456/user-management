const express = require('express');
const app = express();
const userRoutes = require('./routes/user');
const adminRoutes= require('./routes/admin');
const path = require('path');
const connectDataBase = require('./db/connectDB');
const session = require('express-session');
const nocache = require('nocache');


app.use(nocache());
app.use(session({secret:'mysecretkey',
    resave:false,
    saveUninitialized:true,
    cookie:{
        maxAge:1000*60*60*24
    }
}));



//static assets

app.use('/bootstrap',express.static(path.join(__dirname,'./node_modules/bootstrap/dist')));
app.use(express.static(path.join(__dirname, 'public')));


//view engine setup

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))



app.use(express.urlencoded({extended:true}));
app.use(express.json());


app.use('/user',userRoutes);
app.use('/admin',adminRoutes);

connectDataBase()

app.listen(3000,()=>{
    console.log("server  http://localhost:3000/user/login");
})