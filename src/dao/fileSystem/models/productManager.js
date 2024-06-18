const fs = require('fs');
const crypto = require("crypto")


class ProductManager{
    constructor(filePath) {
        this.path = filePath;

        if (!fs.existsSync(this.path)) {
          fs.writeFileSync(this.path, '[]', { encoding: 'utf-8' });
        }
    }

    getProducts() {
      try {
        const fileData = fs.readFileSync(this.path, { encoding: 'utf-8' });
        return JSON.parse(fileData);
      } catch (error) {
        console.log(`Error al leer el archivo: ${error}`)
        return [];
      }
    }

    getProductById(id) {
      let products = this.getProducts();
        const existeLaId = products.find((product) => product.id === id)
        if (existeLaId) {
          return existeLaId
        } else {
          return false;
        }
    }

    addProduct({title, description, price, code, status, stock, category, thumbnail}) {
      let products = this.getProducts();

        if(!products.some((product) => product.code === code)) {
          const nuevaId = crypto.randomBytes(16).toString('hex');
          const nuevoProducto = { id: nuevaId, title, description, price, code, status, stock, category, thumbnail: thumbnail }

          products.push(nuevoProducto);
          this.saveProduct(products);
      
          return true;
        } else {
          return false
        }
    }

    saveProduct(products) {
      fs.writeFileSync(this.path, JSON.stringify(products, null, 2), {encoding: 'utf-8'});
    }

    updateProduct(id, updatedFields) {
      let products = this.getProducts();
      const product = products.findIndex((product) => product.id === id);

      if (product !== -1) {
        products[product] = { ...products[product], ...updatedFields };
        this.saveProduct(products);
        return true;
      } else {
        return false
      }
    }
    
    deleteProduct(id) {
      let products = this.getProducts();
      const prod = products.find((producto) => producto.id === id)
    
      if (prod) {
        products = products.filter((producto) => producto.id !== id)
        this.saveProduct(products);
        return true
      } else {
        return false
      }
    }
}

const product = new ProductManager('../json/products.json');

try {
  product.addProduct({
    title: 'Producto 1',
    description: 'Descripción del producto 1',
    price: 100,
    code: 'ABC123',
    status: true,
    stock: 20,
    category: 'Category 1',
    thumbnail: 'https://www.pngarts.com/files/8/Apple-iPhone-11-Download-PNG-Image.png',
  });

  product.addProduct({
    title: 'Producto 2',
    description: 'Descripción del producto 2',
    price: 150,
    code: 'DEF456',
    status: true,
    stock: 15,
    category: 'Category 2',
    thumbnail: 'https://imgur.com/Fn9kZve.png',
  });

  product.addProduct({
    title: 'Producto 3',
    description: 'Descripción del producto 3',
    price: 120,
    code: 'GHI789',
    status: true,
    stock: 10,
    category: 'Category 1',
    thumbnail: 'https://imgur.com/u6wclcF.png',
  });

  product.addProduct({
    title: 'Producto 4',
    description: 'Descripción del producto 4',
    price: 180,
    code: 'JKL012',
    status: true,
    stock: 18,
    category: 'Category 3',
    thumbnail: 'https://imgur.com/csvQT5F.png',
  });

  product.addProduct({
    title: 'Producto 5',
    description: 'Descripción del producto 5',
    price: 90,
    code: 'MNO345',
    status: true,
    stock: 22,
    category: 'Category 2',
    thumbnail: 'https://imgur.com/DrC8wiB.png',
  });

  product.addProduct({
    title: 'Producto 6',
    description: 'Descripción del producto 6',
    price: 200,
    code: 'PQR678',
    status: true,
    stock: 12,
    category: 'Category 1',
    thumbnail: 'https://imgur.com/Ms0uVyZ.png',
  });

} catch (error) {
  console.error(error.message);
}

module.exports = ProductManager;
