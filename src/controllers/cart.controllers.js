const CartService = require('../services/cartService');
const ProductService = require('../services/productService');

const CustomError = require("../services/errors/CustomError")
const EnumError = require("../services/errors/ErrorEnum")
const { cartError, cartNotFound, productFields } = require("../services/errors/MessagesError")

const cartService = new CartService();
const productService = new ProductService();


async function addCart(req, res) {
    try {
        const cart = await cartService.addCart();
    
        if (cart.success) {
          res.status(201).json({ data: cart.cart });
        } else {
            const error = CustomError.createError({
                name: "Cart error",
                cause: cartError(),
                message: "Error al agregar el carrito",
                code: EnumError.DATABASE_ERROR
              });
      
              return res.status(500).json({ error });
        }
      } catch (error) {
        req.logger.error(`Error addCart: ${error}`);
        res.status(500).json({ message: 'Error interno del servidor' });
      }
}

async function getCart(req, res) {
    try {
        const cid = req.params.cid;
        const cart = await cartService.getCart(cid);
    
        if (cart.success) {
          res.status(200).json(cart.cart);
        } else {
            const error = CustomError.createError({
                name: "Cart error",
                cause: cartNotFound(cart.cart),
                message: "Carrito no encontrado",
                code: EnumError.DATABASE_ERROR
              });
      
              return res.status(500).json({ error });
        }
      } catch (error) {
        req.logger.error(`Error getCart: ${error}`);
        res.status(500).json({ message: 'Error interno del servidor' });
      }
}

async function addProductToCart(req, res) {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;

        const userId = req.session.user._id;
        const userRole = req.session.user.role

        const isPremium = userRole.toLowerCase() === 'premium';

        const product = await productService.getProductById(pid);
        const productOwner = product.owner;

        if (isPremium && productOwner === userId) {
            return res.status(403).json({ message: 'No esta permitido agregar un producto el cual eres el owner a su carrito.' });
        }
    
        const result = await cartService.addProductToCart(cid, pid);
    
        res.status(200).json(result);
      } catch (error) {
        req.logger.error(`Error addProductToCart: ${error}`);
        res.status(500).json({ message: error.error || 'Error interno del servidor' });
      }
}

async function removeProductFromCart(req, res) {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
  
        const result = await cartService.removeProductFromCart(cid, pid);
  
        if (result.success) {
            res.status(200).send(result);
        } else {
            const error = CustomError.createError({
                name: "Cart error",
                cause: cartError(result.message),
                message: result.message,
                code: EnumError.DATABASE_ERROR
              });
      
              return res.status(404).json({ error });
        }
    } catch (error) {
        req.logger.error(`Error removeProductFromCart: ${error}`);
        res.status(500).send({ message: 'Error interno del servidor', error: error });
    }
}

async function updateCart(req, res) {
    try {
        const cid = req.params.cid;
        const data = req.body.products;
  
        const result = await cartService.updateCart(cid, data);
  
        if (result.success) {
            res.status(200).send(result);
        } else {
            const error = CustomError.createError({
                name: "Cart error",
                cause: cartError(result.message),
                message: result.message,
                code: EnumError.DATABASE_ERROR
              });
      
              return res.status(404).json({ error });
        }
    } catch (error) {
        req.logger.error(`Error updateCart: ${error}`);
        res.status(500).send({ message: 'Error interno del servidor', error: error });
    }
}

async function updateProductQuantity(req, res) {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const quantity = req.body.quantity;
  
        const result = await cartService.updateProductQuantity(cid, pid, quantity);
  
        if (result.success) {
            res.status(200).send(result);
        } else {
            const error = CustomError.createError({
                name: "Cart error",
                cause: cartError(result.message),
                message: result.message,
                code: EnumError.DATABASE_ERROR
              });
      
              return res.status(404).json({ error });
        }
    } catch (error) {
        req.logger.error(`Error updateProductQuantity: ${error}`);
        res.status(500).send({ message: 'Error interno del servidor', error: error });
    }
}

async function removeAllProducts(req, res) {
    try {
        const cid = req.params.cid;
  
        const result = await cartService.removeAllProducts(cid);
  
        if (result.success) {
            res.status(200).send(result);
        } else {
            const error = CustomError.createError({
                name: "Cart error",
                cause: cartError(result.message),
                message: result.message,
                code: EnumError.DATABASE_ERROR
              });
      
              return res.status(404).json({ error });
        }
    } catch (error) {
        req.logger.error(`Error removeAllProducts: ${error}`);
        res.status(500).send({ message: 'Error interno del servidor', error: error });
    }
}

module.exports = {addCart, getCart, addProductToCart, removeProductFromCart, updateCart, updateProductQuantity, removeAllProducts}