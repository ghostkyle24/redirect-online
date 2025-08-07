import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, name } = req.body;

  try {
    await resend.emails.send({
      from: 'SignalCheck <noreply@signalcheckapp.store>',
      to: email,
      subject: 'Access to SignalCheck',
      html: `<p>Hello ${name},<br>Your payment was approved! Here is your access: <a href="https://redirect-online.vercel.app/">Access SignalCheck</a></p>`
    });
    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
}