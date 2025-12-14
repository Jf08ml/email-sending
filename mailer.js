// mailer.js
const nodemailer = require('nodemailer');
require('dotenv').config(); // Carga las variables de entorno desde el archivo .env

// Configuración de múltiples cuentas de correo
const emailAccounts = {
  default: {
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  },
  account2: {
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER_2,
      pass: process.env.SMTP_PASS_2,
    },
  },
  account3: {
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER_3,
      pass: process.env.SMTP_PASS_3,
    },
  },
  // Puedes agregar más cuentas aquí
};

// Crear transporters para cada cuenta
const transporters = {};
Object.keys(emailAccounts).forEach((accountKey) => {
  const config = emailAccounts[accountKey];
  if (config.auth.user && config.auth.pass) {
    transporters[accountKey] = nodemailer.createTransport(config);
  }
});

const sendEmail = async (to, subject, htmlContent, fromName, accountKey = 'default') => {
  // Validar que la cuenta existe
  if (!transporters[accountKey]) {
    throw new Error(`Email account "${accountKey}" not configured or missing credentials`);
  }

  const transporter = transporters[accountKey];
  const accountConfig = emailAccounts[accountKey];
  const fromAddress = fromName 
    ? `"${fromName}" <${accountConfig.auth.user}>` 
    : accountConfig.auth.user;
  
  const mailOptions = {
    from: fromAddress,
    to,
    subject,
    html: htmlContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent from ${accountKey}: ${info.response}`);
    return info;
  } catch (error) {
    console.error('Error sending email: ', error);
    throw error;
  }
};

// Función para obtener las cuentas disponibles
const getAvailableAccounts = () => {
  return Object.keys(transporters);
};

module.exports = { sendEmail, getAvailableAccounts };
