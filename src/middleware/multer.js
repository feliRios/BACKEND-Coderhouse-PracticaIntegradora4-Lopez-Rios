const multer = require('multer');
const fs = require('fs').promises;
const crypto = require("crypto")

const createDirectory = async (directoryPath) => {
  try {
    await fs.mkdir(directoryPath, { recursive: true });
  } catch (error) {
    console.error(`Error al crear el directorio ${directoryPath}: ${error}`);
    throw error;
  }
};

const getDestinationFolder = (fieldname, userId) => {
  switch (fieldname) {
    case 'profile':
      return `uploads/${userId}/profile`;
    case 'product':
      return `uploads/${userId}/product`;
    default:
      return `uploads/${userId}/documents`;
  }
};

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const userId = req.params.uid;
    const destinationFolder = getDestinationFolder(file.fieldname, userId);
    await createDirectory(destinationFolder);
    cb(null, destinationFolder);
  },
  filename: (req, file, cb) => {
    const idRandom = crypto.randomBytes(16).toString('hex');
    cb(null, `${idRandom}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

module.exports = upload;
