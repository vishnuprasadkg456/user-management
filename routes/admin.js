const express = require('express');
const router = express.Router()
const adminController = require('../controller/admincontroller');
const adminAuth = require('../middleware/adminAuth');


router.get('/login', adminAuth.isLogin,adminController.loadLogin);

router.post('/login',adminController.login);

router.get('/dashboard',adminAuth.checkSession,adminController.loadDashboard)
router.get('/dashboard/search', adminController.searchUsers);

// Route for creating a user
router.post('/users/create',adminAuth.checkSession, adminController.createUser);

// Route for deleting a user
router.post('/users/:id/delete', adminAuth.checkSession,adminController.deleteUser);

// Route for editing a user
router.post('/users/:id/edit', adminAuth.checkSession ,adminController.editUser);

// Route for admin logout
router.get('/logout', adminAuth.checkSession, adminController.logout);
router.post('/logout', adminAuth.checkSession, adminController.logout);


module.exports = router;