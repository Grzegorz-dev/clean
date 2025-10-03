// lib/mailer.ts
import nodemailer from 'nodemailer';

export function getTransport() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error('Brak konfiguracji SMTP (SMTP_HOST / SMTP_USER / SMTP_PASS) w .env');
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // 465 = SSL, 587/2525 = STARTTLS
    auth: { user, pass },
  });
}

export async function sendVerificationCode(to: string, code: string) {
  const from = process.env.SMTP_FROM || 'Cleanly <no-reply@cleanly.local>';
  const transport = getTransport();

  const html = `
    <div style="font-family:system-ui">
      <h2>Twój kod weryfikacyjny</h2>
      <p>Użyj tego kodu, aby potwierdzić rejestrację:</p>
      <div style="font-size:28px;font-weight:700;letter-spacing:4px">${code}</div>
      <p>Kod wygaśnie za 10 minut.</p>
    </div>
  `;

  await transport.sendMail({ from, to, subject: 'Kod weryfikacyjny', html });
}

