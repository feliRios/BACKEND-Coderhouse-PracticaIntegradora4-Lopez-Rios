const express = require('express')
const passport = require('passport')
const { Router } = express

const router = Router()

router.get('/github', passport.authenticate('github', {})) 

router.get('/callback', passport.authenticate('github', { failureRedirect: '/' }), (req, res) =>{
    req.session.user = req.user

    return res.redirect('/products');
})  

router.get('/current', (req, res) => {
    if (req.session && req.session.user) {
        res.status(200).json({ user: req.session.user });
    } else {
        res.status(401).json({ message: 'No hay sesion activa' });
    }
});

module.exports = router