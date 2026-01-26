const nodemailer = require('nodemailer');

const sendDriverCredentials = async (email, password) => {
    if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
        console.warn('SMTP credentials missing. Skipping email send.');
        console.log(`[MOCK EMAIL] To: ${email}, Password: ${password}`);
        return;
    }

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.SMTP_EMAIL,
            to: email,
            subject: 'Your Driver Account Credentials',
            html: `
                <h3>Welcome to Cargo Shipment Tracker</h3>
                <p>Your driver account has been created.</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Temporary Password:</strong> ${password}</p>
                <p>Please login and change your password immediately.</p>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Credentials sent to ${email}`);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Email could not be sent');
    }
};

module.exports = {
    sendDriverCredentials,
};
