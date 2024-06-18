const { Router } = require('express');
const upload = require('../middleware/multer')
const {toggleUserRole, uploadDocuments} = require('../controllers/user.controllers')

const router = Router()

router.put('/premium/:uid', toggleUserRole)
router.post('/:uid/documents', upload.fields([
    { name: 'profile', maxCount: 1 },
    { name: 'product', maxCount: 1 },
    { name: 'documents', maxCount: 10 }
  ]), uploadDocuments);

module.exports = router