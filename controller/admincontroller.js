const adminSchema = require('../model/adminModel');
const userSchema = require('../model/userModel');
const bcrypt = require('bcrypt');

const loadLogin = async (req, res) => {
    res.render('admin/alogin');
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await adminSchema.findOne({ email });

        if (!admin) {
            return res.render('admin/alogin', { error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.render('admin/alogin', { error: 'Incorrect Password' });
        }

        req.session.admin = true;
        return res.redirect('/admin/dashboard');
    } catch (error) {
        return res.render('admin/alogin', { error: 'Something went wrong, please try again.' });
    }
};

const loadDashboard = async (req, res) => {
    try {
        const admin = req.session.admin;
        if (!admin) return res.redirect('/admin/alogin');

        const users = await userSchema.find({});
        res.render('admin/dashboard', { users: users || [] });
    } catch (error) {
        res.render('admin/dashboard', { users: [] });
    }
};

const searchUsers = async (req, res) => {
    try {
        const { username } = req.query;
        const users = await userSchema.find({ username: { $regex: username, $options: 'i' } });
        res.render('admin/dashboard', { users: users || [] });
    } catch (error) {
        res.render('admin/dashboard', { users: [] });
    }
};

const createUser = async (req, res) => {
   
    try {
        const { username, email, password, confirmPassword } = req.body;

        // Check if passwords match
        if (password !== confirmPassword) {
            return res.render('admin/dashboard', { users: [], error: 'Passwords do not match' });
        }

        // Check if user already exists
        const existingUser = await userSchema.findOne({ email });
        if (existingUser) {
            return res.render('admin/dashboard', { users: [], error: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new userSchema({ username, email, password: hashedPassword });
        await newUser.save();

        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error("Error creating user:", error);
        res.render('admin/dashboard', { users: [], error: 'Error creating user' });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await userSchema.findByIdAndDelete(id);
        res.redirect('/admin/dashboard');
    } catch (error) {
        res.render('admin/dashboard', { users: [], error: 'Error deleting user' });
    }
};

const editUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email } = req.body;
        await userSchema.findByIdAndUpdate(id, { username, email });
        res.redirect('/admin/dashboard');
    } catch (error) {
        res.render('admin/dashboard', { users: [], error: 'Error updating user' });
    }
};



const logout = async (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error("Logout error:", err);
            return res.redirect('/admin/login');
        }
        res.redirect('/admin/dashboard');
    });
}

module.exports = {
    loadLogin,
    login,
    loadDashboard,
    searchUsers,
    createUser,
    deleteUser,
    editUser,
    logout
};