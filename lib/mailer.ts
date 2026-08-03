import nodemailer from 'nodemailer';

export function getMailTransport() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  if (!host || !user || !pass) return null;

  const port = Number(process.env.SMTP_PORT ?? 465);
  return nodemailer.createTransport({
    host,
    port,
    secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : port === 465,
    auth: { user, pass },
  });
}

export async function sendAccountEmail(input: { to: string; subject: string; text: string }) {
  const transporter = getMailTransport();
  if (!transporter) throw new Error('Account email delivery is not configured.');
  await transporter.sendMail({
    from: process.env.SMTP_FROM_EMAIL ?? process.env.SMTP_USER,
    to: input.to,
    subject: input.subject,
    text: input.text,
  });
}
