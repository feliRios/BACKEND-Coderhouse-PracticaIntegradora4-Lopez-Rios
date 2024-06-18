const PasswordResetToken = require('../dao/db/models/passwordreset.model');

async function LoginView(req, res) {
    res.render('login')
}

async function RegisterView(req, res) {
    res.render('register')
}

async function RequestResetPassword(req, res) {
    res.render("requestresetpassword")
}

async function ResetPassword(req, res) {
    const { token } = req.query;

    try {
        const resetToken = await PasswordResetToken.findOne({ token: token });

        if (!resetToken || resetToken.expires < Date.now()) {
            return res.render('tokenerror', { 
                title: "Token Expired",
                message: "The token provided for password reset is either invalid or has expired." 
            });
        }

        if (resetToken.used) {
            return res.render('tokenerror', { 
                title: "Token Already Used",
                message: "The token provided for password reset has already been used." 
            });
        }

        res.render('resetpassword', { token });
    } catch (error) {
        console.error(`Error: ${error}`);
    }
}


async function Profile(req, res) {
    if (!req.session.user) return res.redirect('/')
    
    const userData = {
        first_name: req.session.user.first_name,
        last_name: req.session.user.last_name,
        age: req.session.user.age,
        email: req.session.user.email,
        role: req.session.user.role,
    };
    
    res.render("profile", { userData: userData });  
}

module.exports = { LoginView, RegisterView, Profile, RequestResetPassword, ResetPassword };