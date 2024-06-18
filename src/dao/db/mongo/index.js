const mongoose = require("mongoose")
const config = require("../../../config/config")

module.exports = {
    connection: null,
    connect: () => {
        return mongoose.connect(config.MONGO_URL)
        .then(() => {
            console.log('Conexión a la base de datos exitosa')
        })
        .catch((err) =>{
            console.error(`Error al conectar a la base de datos: ${err}`)
        });
    }
}