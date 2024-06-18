const mongoose = require('mongoose')
const mongoosepaginate = require('mongoose-paginate-v2');
const {esUsuarioPremium} = require("../../../utils/validationPremium")

const ProductSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        unique: true
    },
    description: { 
        type: String, 
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: Boolean,
        default: true
    },
    stock: {
        type: Number,
        default: 5
    },
    category: {
        type: String,
        required: true,
        enum:  ['Category 1', 'Category 2', 'Category 3']
    },
    thumbnail: {
        type: String,
    },
    owner: {
        type: mongoose.Schema.Types.Mixed, 
        ref: 'User', 
        default: 'admin', 
        validate: {
            validator: async function(value) {
                try {
                    if (value === 'admin') return true;
                    const esPremium = await esUsuarioPremium(value);
                    return esPremium;
                } catch (error) {
                    console.error('Error al validar premium:', error);
                    return false;
                }
            },
            message: 'El owner debe ser un usuario premium'
        }
    }
});

ProductSchema.plugin(mongoosepaginate);

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product