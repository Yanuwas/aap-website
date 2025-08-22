// api/contact.js
import { Resend } from 'resend';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method Not Allowed' });

  try {
    const { name, email, phone, message, consent } = req.body || {};
    if (!name || !email || !message || consent !== true) {
      return res.status(400).json({ ok: false, error: 'Missing required fields' });
    }

    // Achtung, Domain prüfen: in deiner Angabe steht "activeadviory.ch"
    const recipients = [
      'bartolotta@activeadvisory.ch',
      'praktikant@activeadviory.ch'
    ];

    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: 'webform@activeadvisory.ch',
      to: recipients,
      reply_to: email,
      subject: `Neue Anfrage von ${name}`,
      text: [
        `Name: ${name}`,
        `E-Mail: ${email}`,
        `Telefon: ${phone || ''}`,
        `Nachricht:`,
        message
      ].join('\n')
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: 'Email send failed' });
  }
}
