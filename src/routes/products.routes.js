const { Router } = require("express");
const {getProducts, getProductById, addProduct, updateProduct, deleteProduct} = require("../controllers/products.controllers")

const routerProd = Router();

routerProd.get('/', getProducts);
routerProd.get('/:id', getProductById);
routerProd.post('/', addProduct);
routerProd.put('/:id', updateProduct);
routerProd.delete('/:id', deleteProduct);

module.exports = routerProd;
