const ProductService = require("../services/productService");
const CustomError = require("../services/errors/CustomError")
const EnumError = require("../services/errors/ErrorEnum")
const { productNotFound, productExist, productFields } = require("../services/errors/MessagesError")

const productService = new ProductService();

async function getProducts(req, res) {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;
        const prods = await productService.getProducts({ limit, page, sort, query });
        res.status(200).send(prods);
    } catch (error) {
        req.logger.error(`Error getProducts: ${error}`);
        res.status(500).send({ message: 'Error interno del servidor', error: error });
    }
}

async function getProductById(req, res) {
    try {
        const { id } = req.params;
        const prod = await productService.getProductById(id);

        if (prod) {
            res.status(200).send(prod);
        } else {
            const error = CustomError.createError({
                name: "Product error",
                cause: productNotFound(prod),
                message: "Producto no encontrado",
                code: EnumError.DATABASE_ERROR
              });
      
              return res.status(404).json({ error });
        }
    } catch (error) {
        req.logger.error(`Error getProductById: ${error}`);
        res.status(500).send({ message: 'Error interno del servidor', error: error });
    }
}

async function addProduct(req, res) {
    try {
        if (!req.session.user || !req.session.user._id) {
            return res.status(401).json({ message: "Debes iniciar sesion para agregar un producto" });
        }

        const ownerId = req.session.user._id;

        const { name, description, price, code, status, stock, category, thumbnail } = req.body;

        if (!name || !description || !price || !code || !status || !stock || !category) {
            const error = CustomError.createError({
                name: "Product error",
                cause: productFields({name, description ,price, code, status, stock, category}),
                message: "Faltan datos por completar",
                code: EnumError.DATABASE_ERROR
              });
      
              return res.status(400).json({ error });
        }

        const productData = {
            name,
            description,
            price,
            code,
            status,
            stock,
            category,
            thumbnail,
            ownerId
        };
        
        const conf = await productService.addProduct(productData);

        if (conf) {
            res.status(201).send("Producto creado");
        } else {
            const error = CustomError.createError({
                name: "Product error",
                cause: productExist(prod),
                message: "Producto ya existente",
                code: EnumError.DATABASE_ERROR
              });
      
              return res.status(400).json({ error });
        }
    } catch (error) {
        req.logger.error(`Error addProduct: ${error}`);
        res.status(500).send({ message: 'Error interno del servidor', error: error });
    }
}

async function updateProduct(req, res) {
    try {
        const { id } = req.params;

        if ('id' in req.body) {
            res.status(400).send('No se puede cambiar la ID del producto.');
            return false;
        }

        const conf = await productService.updateProduct(id, req.body);

        if (conf) {
            res.status(200).send("Producto actualizado correctamente");
        } else {
            const error = CustomError.createError({
                name: "Product error",
                cause: productNotFound(prod),
                message: "Producto no encontrado",
                code: EnumError.DATABASE_ERROR
              });
      
              return res.status(404).json({ error });
        }
    } catch (error) {
        req.logger.error(`Error updateProduct: ${error}`);
        res.status(500).send({ message: 'Error interno del servidor', error: error });
    }
}

async function deleteProduct(req, res) {
    try {
        const { id } = req.params;

        if (!req.session.user) {
            return res.status(401).json({ message: "Debes iniciar sesion para eliminar un producto" });
        }

        const userRole = req.session.user.role;

        if (userRole.toLowerCase() === 'admin') {
        const deletedProduct = await productService.deleteProduct(id);
            if (deletedProduct) {
                return res.status(200).json({ message: "Producto eliminado correctamente" });
            } else {
                const error = CustomError.createError({
                    name: "Product error",
                    cause: productNotFound(prod),
                    message: "Producto no encontrado",
                    code: EnumError.DATABASE_ERROR
                  });
          
                  return res.status(404).json({ error });
            }
        }

        const ownerId = req.session.user._id;
        const product = await productService.getProductById(id);
        if (product && product.owner.toString() === ownerId) {
            const deletedProduct = await productService.deleteProduct(id);
            if (deletedProduct) {
                return res.status(200).json({ message: "Producto eliminado correctamente" });
            } else {
                const error = CustomError.createError({
                    name: "Product error",
                    cause: productNotFound(prod),
                    message: "Producto no encontrado",
                    code: EnumError.DATABASE_ERROR
                  });
          
                  return res.status(404).json({ error });
            }
        } else {
            return res.status(403).json({ message: "No tienes permiso para eliminar este producto" });
        }
    } catch (error) {
        req.logger.error(`Error deleteProduct: ${error}`);
        res.status(500).send({ message: 'Error interno del servidor', error: error });
    }
}

module.exports = {getProducts, getProductById, addProduct, updateProduct, deleteProduct}