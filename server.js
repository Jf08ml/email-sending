const express = require('express');
const morgan = require('morgan');
const { sendEmail } = require('./mailer');
require('dotenv').config(); // Carga las variables de entorno desde el archivo .env

const app = express();
const port = process.env.PORT || 3000;

app.use(morgan('combined'));
app.use(express.json());

app.post('/send-email', async (req, res) => {
  const { to, subject, htmlContent, fromName } = req.body;

  if (!to || !subject || !htmlContent) {
    return res.status(400).send('Missing required fields');
  }

  try {
    await sendEmail(to, subject, htmlContent, fromName);
    res.status(200).send('Email sent successfully');
  } catch (error) {
    res.status(500).send('Error sending email');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
