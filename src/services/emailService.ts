import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendAdminRegistrationNotification(userEmail: string): Promise<void> {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    console.warn('ADMIN_EMAIL not configured, skipping admin notification');
    return;
  }

  await transporter.sendMail({
    from: `"Wine Encyclopedia" <${process.env.SMTP_USER}>`,
    to: adminEmail,
    subject: 'Nuova registrazione utente',
    html: `
      <h2>Nuova registrazione</h2>
      <p>Un nuovo utente si è registrato su Wine Encyclopedia:</p>
      <p><strong>Email:</strong> ${userEmail}</p>
      <p><strong>Data:</strong> ${new Date().toLocaleString('it-IT')}</p>
      <p>L'utente ha ricevuto un'email di verifica. Se non dovesse verificarla,
      puoi attivare manualmente il suo account dalla console Firebase.</p>
    `,
  });
}
