const fs = require('fs');
const crypto = require("crypto")

function idRandom() {
    return crypto.randomBytes(8).toString('hex');
  }

class CartManager{
    constructor() {
        this.path = __dirname + "../../../json/carts.json";

        if (!fs.existsSync(this.path)) {
          fs.writeFileSync(this.path, '[]', { encoding: 'utf-8' });
        }
    }

    addCart() {
        try {
            const cartId = idRandom()
            const newCart = ({
                id: cartId,
                products: []
            })
    
            const carts = JSON.parse(fs.readFileSync("../json/carts.json", { encoding: 'utf-8' }));
            carts.push(newCart);
            fs.writeFileSync("../json/carts.json", JSON.stringify(carts, null, 2), {encoding: 'utf-8'});
    
            return { success: true, cart: newCart }
        } catch (error) {
            console.log(`Error al agregar el carro de compras ${error}`);
        }
    }

    getCart(cid) {
        const carts = JSON.parse(fs.readFileSync("../json/carts.json", { encoding: 'utf-8' }));
        const cart = carts.find(cart => cart.id === cid);
    
        if (cart) {
            return { success: true, cart: cart.products }
        } else {
            return false
        }
    }

    addProductToCart(cid, pid) {
        const quantity = 1
    
        const carts = JSON.parse(fs.readFileSync("../json/carts.json", { encoding: 'utf-8' }))
    
        const cart = carts.find(cart => cart.id === cid)
    
        if (!cart) {
            return { success: false, error: "Carrito no encontrado" }
        }
    
        const products = JSON.parse(fs.readFileSync("../json/products.json", { encoding: 'utf-8' }))
    
        const productExiste = products.find(product => product.id === pid)
    
        if (!productExiste) {
            return { success: false, error: "Producto no encontrado en la lista de productos" }
        }
    
        const productInCart = cart.products.find(product => product.id === pid)
    
        if (productInCart) {
            productInCart.quantity++;
        } else {
            cart.products.push({
                id: pid,
                quantity: quantity
            })
        }
    
        fs.writeFileSync("../json/carts.json", JSON.stringify(carts, null, 2), {encoding: 'utf-8'});
    
        return { success: true, cart: cart };
    }
}

module.exports = CartManager;