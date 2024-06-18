const express = require('express')
const {Router} = express
const { LoginView, RegisterView, Profile, RequestResetPassword, ResetPassword } = require('../controllers/auth.views.controllers')


const router = Router()

router.get('/', LoginView)
router.get('/register', RegisterView)
router.get('/profile', Profile)
router.get('/password/reset/request', RequestResetPassword)
router.get('/password/reset', ResetPassword)


module.exports = router

