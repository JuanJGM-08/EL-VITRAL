require('dotenv').config();

const crypto = require('crypto');
const nodemailer = require('nodemailer');

function createPasswordResetToken() {
  return crypto.randomBytes(24).toString('hex');
}

function buildResetPasswordLink(token, frontendUrl = 'http://localhost:3000') {
  return `${frontendUrl.replace(/\/$/, '')}/reset-password/${token}`;
}

async function sendEmail({ transporter, to, subject, text, html }) {
  if (!transporter || !to || !subject || !text) {
    throw new Error('Faltan datos para enviar el correo');
  }

  return transporter.sendMail({
    from: 'EL VITRAL <no-reply@elvitral.com>',
    to,
    subject,
    text,
    html,
  });
}

async function sendPasswordResetEmail({ to, token, frontendUrl }) {
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpUser || !smtpPass) {
    throw new Error('Faltan credenciales SMTP. Revisa SMTP_USER y SMTP_PASS en backend/.env');
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  const resetLink = buildResetPasswordLink(token, frontendUrl);
  const subject = 'Recupera tu contraseña en EL VITRAL';
  const text = `Hola,\n\nRecibimos una solicitud para recuperar tu contraseña.\nHaz clic en el siguiente enlace para restablecerla:\n${resetLink}\n\nSi no solicitaste este cambio, puedes ignorar este correo.`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px;">
      <h2 style="color: #0f172a;">Recupera tu contraseña</h2>
      <p>Hola,</p>
      <p>Recibimos una solicitud para recuperar tu contraseña. Haz clic en el botón de abajo para crear una nueva:</p>
      <p style="margin: 24px 0;"><a href="${resetLink}" style="background: #2563eb; color: white; padding: 12px 18px; border-radius: 8px; text-decoration: none;">Restablecer contraseña</a></p>
      <p>Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
      <p style="word-break: break-all; color: #4b5563;">${resetLink}</p>
      <p style="margin-top: 20px; color: #6b7280;">Si no solicitaste este cambio, puedes ignorar este correo.</p>
    </div>
  `;

  return sendEmail({ transporter, to, subject, text, html });
}

module.exports = {
  createPasswordResetToken,
  buildResetPasswordLink,
  sendEmail,
  sendPasswordResetEmail,
};
