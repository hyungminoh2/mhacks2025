import FormData from "form-data";
import Mailgun from "mailgun.js";

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ success: false, error: "Email is required" }),
        { status: 400 }
      );
    }

    const mailgun = new Mailgun(FormData);
    const mg = mailgun.client({
      username: "api",
      key: process.env.MAILGUN_API_KEY, // set in your .env.local
      // url: "https://api.eu.mailgun.net" // if using EU domain
    });

    const domain = process.env.MAILGUN_DOMAIN; // e.g., "sandbox53367a59b5234dd886bd6ec58fea4206.mailgun.org"

    const data = await mg.messages.create(domain, {
      from: `Solvend <postmaster@${domain}>`,
      to: [email],
      subject: "🚀 Welcome to Solvend!",
      text: "Thanks for signing up! You’ll now receive AI-powered crypto updates straight to your inbox 🚀",
      html: `
        <h1>Welcome to Solvend – Mhacks 2025!</h1>
        <p>Hi there,</p>
        <p>Thanks for signing up! You’ll now receive AI-processed cryptocurrency updates, tailored just for you, delivered straight to your inbox.</p>
        <p>Stay ahead of the crypto trends and make smarter decisions with personalized insights from Solvend.</p>
        <p>— The Solvend Team</p>
      `,
    });

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}
