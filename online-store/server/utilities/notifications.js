import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});


export async function sendLowStockAlert(product) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'alexander.attoh22@gmail.com',
        subject: `Low stock Alert for product ${product.product_id}`,
        text: `The product with SKU ${product.sku} is low on stock. Only ${product.available} remaining.`
    };

    return transporter.sendMail(mailOptions);
};
