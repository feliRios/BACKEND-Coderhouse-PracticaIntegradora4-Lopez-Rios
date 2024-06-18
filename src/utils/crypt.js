const bcrypt = require('bcrypt');

const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

const isValidatePass = (password, passwordHashed) => {
   let compare = bcrypt.compareSync(password, passwordHashed);
   return compare
}

module.exports  ={
    createHash,
    isValidatePass
};