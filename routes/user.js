const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const auth = require('../middleware/auth');

router.get('/login',auth.isLogin,userController.loadLogin);
router.post('/login',userController.login);


router.get('/signup',auth.isLogin,userController.loadSignup);

router.post('/signup',userController.userSignup);



router.get('/home', auth.checkSession, userController.loadHome);


router.get('/logout',auth.checkSession,userController.logout);

module.exports=router;