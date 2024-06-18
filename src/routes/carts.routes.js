const { Router } = require("express");
const {getCart, PurchaseCart} = require( "../controllers/carts.controllers")

const cartsRouter = Router();

cartsRouter.get('/:cid', getCart);
cartsRouter.get('/:cid/purchase', PurchaseCart);

module.exports = cartsRouter;
