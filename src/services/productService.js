const ProductModel = require("../dao/db/models/products.model")
const crypto = require("crypto")


class ProductManager{
    constructor() {}

    async getProducts({ limit, page, sort, query }) {
      try {
          let mongoQuery = {};
  
          if (query === "disponibilidad") {
            mongoQuery.status = true;
          } else if (query) {
            mongoQuery.category = query;
          }
  
          const opciones = {
              page: page ? parseInt(page, 10) : 1,
              limit: limit ? parseInt(limit, 10) : 0,
              sort: sort ? { price: sort === 'asc' ? 1 : sort === 'desc' ? -1 : 0 } : {}
          };
  
          const result = await ProductModel.paginate(mongoQuery, opciones);
  
          return {
            success: true,
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? `/api/products?page=${result.prevPage}&limit=${limit}&query=${query ? `${query}` : ''}&sort=${sort ? `${sort}` : 'asc'}` : null,
            nextLink: result.hasNextPage ? `/api/products?page=${result.nextPage}&limit=${limit}&query=${query ? `${query}` : ''}&sort=${sort ? `${sort}` : 'asc'}` : null
        };
      } catch (error) {
          console.log(`Error al leer el archivo: ${error}`);
          return [];
      }
  }

    async getProductById(id) {
        try {
            return await ProductModel.findById(id);
          } catch (error) {
            console.log(`Error al buscar el producto por ID desde MongoDB: ${error}`);
            return null;
          }
    }

    async addProduct({ name, description, price, code, status, stock, category, thumbnail, ownerId }) {
        try {
          if (!(await ProductModel.exists({ code }))) {
            const nuevaId = crypto.randomBytes(16).toString('hex');
            const nuevoProducto = new ProductModel({
              id: nuevaId,
              name,
              description,
              price,
              code,
              status,
              stock,
              category,
              thumbnail,
              owner: ownerId
            });
    
            await nuevoProducto.save();
            return true;
          } else {
            return false;
          }
        } catch (error) {
          console.log(`Error al agregar el producto en MongoDB: ${error}`);
          return false;
        }
      }

      async updateProduct(id, updatedFields) {
        try {
          const producto = await ProductModel.findById(id);
    
          if (producto) {
            Object.assign(producto, updatedFields);
            await producto.save();
            return true;
          } else {
            return false;
          }
        } catch (error) {
          console.log(`Error al actualizar el producto en MongoDB: ${error}`);
          return false;
        }
      }

      async updateProductStock(productId, quantityToSubtract) {
        try {
            const product = await ProductModel.findById(productId);
            
            if (!product) {
                throw new Error(`Producto con ID ${productId} no encontrado`);
            }
    
            product.stock -= quantityToSubtract;
    
            await product.save();
    
            return true;
        } catch (error) {
            console.error(`Error al actualizar el stock del producto: ${error}`);
            return false;
        }
    }
    
    
      async deleteProduct(id) {
        try {
          const resultado = await ProductModel.findByIdAndDelete(id);
          return resultado !== null;
        } catch (error) {
          console.log(`Error al eliminar el producto en MongoDB: ${error}`);
          return false;
        }
      }
    }

const product = new ProductManager();

try {
  product.addProduct({
    name: 'Samsung Galaxy A54',
    description: 'Celular 5g',
    price: 90,
    code: 'ABC123',
    status: false,
    stock: 20,
    category: 'Category 1',
    thumbnail: 'https://multipoint.com.ar/Image/0/750_750-3107.jpg',
  });

  product.addProduct({
    name: 'Airpods Pro 2 Gen',
    description: 'Auriculares inalambricos APPLE',
    price: 100,
    code: 'DEF456',
    status: false,
    stock: 15,
    category: 'Category 2',
    thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwfczJSRz2Afkr5t7l8wNjjIJ0xlBHDFHuUA&s',
  });

  product.addProduct({
    name: 'HyperX Alloy FPS Pro',
    description: 'Teclado mecanico gamer',
    price: 110,
    code: 'GHI789',
    status: false,
    stock: 10,
    category: 'Category 1',
    thumbnail: 'https://http2.mlstatic.com/D_NQ_NP_945713-MLU72572022194_112023-O.webp',
  });

  product.addProduct({
    name: 'Mouse logitech G502',
    description: 'Mouse gamer',
    price: 120,
    code: 'JKL012',
    status: true,
    stock: 18,
    category: 'Category 3',
    thumbnail: 'https://www.soscomputacion.com.ar/16806-thickbox_default/mouse-logitech-g502-gaming-hero-11-botones-play-advanced-hasta-16000dpi.jpg',
  });

  product.addProduct({
    name: 'Ryzen 5 1600AF',
    description: 'Procesador AMD Gama media',
    price: 130,
    code: 'MNO345',
    status: true,
    stock: 22,
    category: 'Category 2',
    thumbnail: 'https://http2.mlstatic.com/D_NQ_NP_696653-MLU70045243622_062023-O.webp',
  });

} catch (error) {
  console.error(error.message);
}

module.exports = ProductManager;
