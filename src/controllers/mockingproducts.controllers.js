const { faker } = require('@faker-js/faker/locale/es');

function generateProduct() {
    return {
        id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        stock: faker.number.int({min: 0, max: 20}),
        code: faker.string.alphanumeric(8),
    }   
}

function generate100Products(req, res) {
    const products =  [];
    for (let i = 0; i < 100; i++) {
        products.push(generateProduct());
    };
    res.send({status: "success", payload: products});
}

module.exports = {generate100Products}