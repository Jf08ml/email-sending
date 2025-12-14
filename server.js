const express = require('express');
const morgan = require('morgan');
const { sendEmail, getAvailableAccounts } = require('./mailer');
require('dotenv').config(); // Carga las variables de entorno desde el archivo .env

const app = express();
const port = process.env.PORT || 3000;

app.use(morgan('combined'));
app.use(express.json());

// Endpoint para enviar email con selección de cuenta
app.post('/send-email', async (req, res) => {
  const { to, subject, htmlContent, fromName, accountKey } = req.body;

  if (!to || !subject || !htmlContent) {
    return res.status(400).send('Missing required fields: to, subject, htmlContent');
  }

  try {
    await sendEmail(to, subject, htmlContent, fromName, accountKey || 'default');
    res.status(200).json({ 
      message: 'Email sent successfully',
      account: accountKey || 'default'
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Error sending email',
      message: error.message
    });
  }
});

// Endpoint para obtener las cuentas disponibles
app.get('/accounts', (req, res) => {
  const accounts = getAvailableAccounts();
  res.status(200).json({ 
    accounts,
    total: accounts.length
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
