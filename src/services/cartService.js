const CartModel = require("../dao/db/models/carts.model")
const ProductModel = require('../dao/db/models/products.model'); 
const crypto = require('crypto');

function generateCartId() {
  return crypto.randomBytes(8).toString('hex');
}

class CartManager {
  constructor() {}

  async addCart() {
    try {
      const cartId = generateCartId();
      const newCart = new CartModel({
        id: cartId,
        products: [],
      });

      await newCart.save();

      return { success: true, cart: newCart };
    } catch (error) {
      throw error;
    }
  }

  async getCart(cartId) {
    try {
      const cart = await CartModel.findOne({ _id: cartId }).populate('products.product');
  
      if (cart) {
        return { success: true, cart: cart.products };
      } else {
        return { success: false, error: 'Carrito no encontrado' };
      }
    } catch (error) {
      throw error;
    }
  }
  

  async addProductToCart(cartId, productId) {
    try {
      const cart = await CartModel.findOne({ _id: cartId });
      const product = await ProductModel.findOne({ _id: productId }); 

      if (!cart) {
        return { success: false, error: 'Carrito no encontrado' };
      }

      if (!product) {
        return { success: false, error: 'Producto no encontrado en la lista de productos' };
      }

      const productInCart = cart.products.find((item) => item.product.toString() === productId);

      if (productInCart) {
        productInCart.quantity++;
      } else {
        cart.products.push({
          product: productId,
          quantity: 1,
        });
      }
  
      await cart.save();

      return { success: true, cart };
    } catch (error) {
      throw error;
    }
  }

  async removeProductFromCart(cartId, productId) {
    try {
      const result = await CartModel.updateOne(
        { _id: cartId, 'products._id': productId }, 
        { $pull: { products: { _id: productId } } }
    );

    if (result.matchedCount === 0) {
      return { success: false, message: `No se encontró el producto con id ${productId} en el carrito.` };
    }  else {
      return { success: true, message: `El producto con id ${productId} se removio correctamente.`, data: result };
    }

    } catch (error) {
        throw error;
    }
}

async updateCart(cartId, updatedProducts) {
  try {
      const result = await CartModel.updateOne(
          { _id: cartId },
          { $set: { products: updatedProducts } }
      );

      if (result.matchedCount === 0) {
          return { success: false, message: 'Carrito no encontrado' };
      }

      return { success: true, message: 'Carrito actualizado correctamente', data: result };
  } catch (error) {
      throw error;
  }
}

async updateProductQuantity(cartId, productId, newQuantity) {
  try {
      const result = await CartModel.updateOne(
          { _id: cartId, 'products.product': productId },
          { $set: { 'products.$.quantity': newQuantity } }
      );

      if (result.matchedCount === 0) {
          return { success: false, message: 'Carrito o producto no encontrado' };
      }

      return { success: true, message: 'Cantidad de producto actualizada correctamente', data: result };
  } catch (error) {
      throw error;
  }
}

async removeAllProducts(cartId) {
  try {
      const result = await CartModel.updateOne(
          { _id: cartId },
          { $set: { products: [] } }
      );

      if (result.matchedCount === 0) {
        return { success: false, message: 'Carrito no encontrado' };
    }

      return { success: true, message: 'Todos los productos del carrito se eliminaron correctamente', data: result };
  } catch (error) {
      throw error;
  }
}

}

module.exports = CartManager;
