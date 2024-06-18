const { Router } = require("express")
const {realTimeProducts} = require("../controllers/realtimeproducts.controllers")

const realTimeProductsRouter = Router()

realTimeProductsRouter.get('/', realTimeProducts)

module.exports = realTimeProductsRouter
