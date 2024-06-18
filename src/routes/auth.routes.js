const express = require('express')
const {Router} = express
const { Login, Register, Logout, RequestPasswordReset, ResetPassword } = require('../controllers/auth.controllers')
const ErrorMiddleware = require('../middleware/errors');

const router = Router()

router.post("/login", Login);
router.post("/register", Register)
router.get("/logout", Logout)
router.post("/password/reset/request", RequestPasswordReset);
router.post("/password/reset/", ResetPassword);
router.use(ErrorMiddleware)

module.exports = router

