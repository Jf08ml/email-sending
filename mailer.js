// mailer.js
const nodemailer = require('nodemailer');
require('dotenv').config(); // Carga las variables de entorno desde el archivo .env

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendEmail = async (to, subject, htmlContent, fromName) => {
  const fromAddress = fromName ? `"${fromName}" <${process.env.SMTP_USER}>` : process.env.SMTP_USER;
  const mailOptions = {
    from: fromAddress,
    to,
    subject,
    html: htmlContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending email: ', error);
  }
};

module.exports = { sendEmail };
