const userSchema = require('../model/userModel');
const bcrypt = require('bcrypt');
const saltround = 10;

const userSignup = async (req,res)=>{
    try{
        const {email, password, username} = req.body;

        const user = await userSchema.findOne({email});

        if(user) {
            console.log("User already exists");
            return res.render('user/uSignup',{message:"User already exists", error: "User already exists"});
        }

        const hashedPassword = await bcrypt.hash(password, saltround);

        const newUser = new userSchema({
            email,
            password: hashedPassword,
            username
        });

        await newUser.save();

       res.render('user/ulogin',{message:'User created successfully', error: null});
    }catch(error){
        console.error("Signup failed check", error);
        return res.render('user/uSignup', { message: null, error: "Signup failed, please try again." });
    }
}

const login = async (req,res)=>{
    try {
        const {email, password} = req.body;

        const user = await userSchema.findOne({email});

        if(!user) {
            console.log("User does not exist");
            return res.render('user/ulogin',{ error: 'User does not exist'});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) {
            console.log("Incorrect password");
            return res.render('user/ulogin',{ error: 'Incorrect Password'});
        }

        req.session.user = true;
        req.session.username = user.username;

        res.render('user/uHome',{message:'Login Successful', username: user.username, error: null});

    } catch (error) {
        console.error("Login failed check", error);
        return res.render('user/ulogin',{ error: 'Something went wrong, please try again.'});
    }
}

const logout = async (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error("Logout error:", err);
            return res.redirect('/user/home');
        }
        res.redirect('/user/login');
    });
}

const loadSignup = (req,res)=>{
    res.render('user/uSignup',{error:null});
}
const loadLogin = (req,res)=>{
    res.render('user/uLogin',{error:null});
}

const loadHome = (req, res) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    res.render('user/uHome', { username: req.session.username });
}


module.exports={
    userSignup,
    loadSignup,
    loadLogin,
    login,
    loadHome,
    logout

};