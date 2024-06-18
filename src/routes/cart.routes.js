const { Router } = require('express');
const CartManager = require('../services/cartService');
const {addCart, getCart, addProductToCart, removeProductFromCart, updateCart, updateProductQuantity, removeAllProducts} = require('../controllers/cart.controllers')

const cartManager = new CartManager();

const routerCart = Router();

routerCart.post('/', addCart);
routerCart.get('/:cid',getCart);
routerCart.post('/:cid/product/:pid', addProductToCart);
routerCart.delete('/:cid/product/:pid', removeProductFromCart);
routerCart.put('/:cid', updateCart);
routerCart.put('/:cid/product/:pid', updateProductQuantity);
routerCart.delete('/:cid', removeAllProducts);


module.exports = routerCart;
