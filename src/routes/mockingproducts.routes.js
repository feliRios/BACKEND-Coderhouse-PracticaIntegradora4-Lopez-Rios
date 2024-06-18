const { Router } = require('express');
const { generate100Products } = require("../controllers/mockingproducts.controllers")

const router = Router()

router.get('/', generate100Products)

module.exports = router