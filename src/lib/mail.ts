import "server-only";
import nodemailer from "nodemailer";

function isConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD);
}

function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: Number(process.env.SMTP_PORT ?? 587) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
}

/**
 * Verschickt eine Benachrichtigungs-Mail, falls SMTP in der .env konfiguriert ist.
 * Ist nichts konfiguriert, wird die Mail übersprungen (Daten sind bereits in der DB gespeichert).
 */
export async function sendNotificationMail(opts: {
  subject: string;
  text: string;
  to?: string;
}) {
  if (!isConfigured()) return { sent: false as const };

  const to = opts.to ?? process.env.CONTACT_NOTIFICATION_EMAIL;
  if (!to) return { sent: false as const };

  try {
    const transporter = getTransporter();
    await transporter.sendMail({
      from: process.env.SMTP_FROM ?? process.env.SMTP_USER,
      to,
      subject: opts.subject,
      text: opts.text,
    });
    return { sent: true as const };
  } catch (error) {
    console.error("Mailversand fehlgeschlagen:", error);
    return { sent: false as const };
  }
}
