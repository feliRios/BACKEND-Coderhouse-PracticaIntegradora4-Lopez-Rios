function generateUserErrorMessage(user) {
    return `Se detectaron uno o más problemas al procesar los datos del usuario.
    Lista de propiedades requeridas:
        -> Nombre: tipo String, valor recibido: ${user.first_name}
        -> Correo electrónico: tipo String, valor recibido: ${user.email}
    `;
}

function existingUser(user) {
    return `Se detectó que uno o más de los datos enviados ya existen en nuestro sistema. Correo electrónico: ${user.email}
    `;
}

function userLoginError(error) {
    return `Hubo un problema al iniciar sesión. Detalles del error: ${error}`;
}

function productNotFound(producto) {
    return `No se ha encontrado el producto. Producto no encontrado: ${producto}`;
}

function productExist(producto) {
    return `El producto ya existe. Producto existente: ${producto}`;
}

function productFields(producto) {
    return `Se detectaron uno o más problemas al procesar un producto.
    Lista de propiedades requeridas:
        -> Name: valor recibido: ${producto.name}
        -> Description: valor recibido: ${producto.description}
        -> Price: valor recibido: ${producto.price}
        -> Code: valor recibido: ${producto.code}
        -> Status: valor recibido: ${producto.status}
        -> Stock:valor recibido: ${producto.stock}
        -> Category: valor recibido: ${JSON.stringify(producto.category)}
    `;
}

function cartError(error) {
    return `Se produjo un error con el carrito. Error: ${error}`;
}

function cartNotFound(cart) {
    return `Este carrito no se encontro. Carrito: ${cart}`;
}

module.exports = {generateUserErrorMessage, existingUser, userLoginError, productNotFound, productExist, productFields, cartError, cartNotFound};