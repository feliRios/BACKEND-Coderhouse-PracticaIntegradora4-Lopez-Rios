const { Router } = require("express")
const {HomeView} = require("../controllers/home.controllers")

const homeProductsRouter = Router()

homeProductsRouter.get('/', HomeView);

module.exports = homeProductsRouter

