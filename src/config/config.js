const dotenv = require('dotenv');
const { Command } = require('commander');

const program = new Command();

program
    .option('-d', 'Variable para debug', false)
    .option('-p <port>', 'Puerto del servidor', 8080)
    .option('--mode <mode>', 'Modo de trabajo', 'develop');
program.parse();

console.log("Mode Option: ", program.opts().mode);

const environment = program.opts().mode;

dotenv.config({
    path: environment === "production" ? "./src/config/.env.production" : "./src/config/.env.development"
});

module.exports = {
    PORT: process.env.PORT || 9095,
    MONGO_URL: process.env.MONGO_URL || 'mongodb+srv://felipetomas:generic123@fcluster.q0b3m8s.mongodb.net/new-ecommerce',
    SECRET_KEY_SESSION: process.env.SECRET_KEY_SESSION || 'secret',
    NODEMAILER_EMAIL: process.env.NODEMAILER_EMAIL || 'felipetomaslopezrios@gmail.com',
    NODEMAILER_PASSWORD: process.env.NODEMAILER_PASSWORD || '',
    JWT_SECRET: process.env.JWT_SECRET || '',
    GITHUB_CLIENTID: process.env.GITHUB_CLIENTID || '',
    GITHUB_SECRET: process.env.GITHUB_SECRET || '',
    environment: environment
};