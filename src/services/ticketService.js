const nodemailer = require('nodemailer');
const crypto = require("crypto");
const config = require("../config/config")
const TicketModel = require('../dao/db/models/ticket.model'); 

class TicketService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: config.NODEMAILER_EMAIL,
                pass: config.NODEMAILER_PASSWORD
            }
        });
    }

    async createTicket(ticketData, cartProducts) {
        try {
            const ticket = new TicketModel({
                ...ticketData,
                code: generateTicketCode(),
            })

            await ticket.save();

            await this.sendPurchaseEmail(ticketData, cartProducts);

            return ticket;
        } catch (error) {
            console.error(`Error al crear el ticket: ${error}`);
            throw error;
        }
    }

    async sendPurchaseEmail(ticketData, cartProducts) {
        try {
            let productsText = '';
            cartProducts.forEach(cartProduct => {
                productsText += `x${cartProduct.quantity} ${cartProduct.product.name}\n`;
            });

            const mailOptions = {
                from: config.NODEMAILER_EMAIL,
                to: ticketData.purchaser,
                subject: 'Detalles de tu compra',
                html: `<p>Gracias por tu compra ${ticketData.first_name} ${ticketData.last_name}. Aquí están los detalles:</p>
                   <p>Total: ${ticketData.amount}</p>
                   <p>Productos:</p>
                   <pre>${productsText}</pre>` 
        };

            await this.transporter.sendMail(mailOptions);
            console.log('Correo electrónico enviado con los detalles de la compra');
        } catch (error) {
            console.error(`Error al enviar el correo electrónico: ${error}`);
            throw error;
        }
    }
}

function generateTicketCode() {
    return crypto.randomBytes(16).toString('hex');
}

module.exports = TicketService;
