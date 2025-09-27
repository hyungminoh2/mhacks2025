import FormData from "form-data";
import Mailgun from "mailgun.js";
import cron from "node-cron";
import axios from "axios";

export async function POST(req) {
  try {
    const { email } = await req.json();
    if (!email)
      return new Response(
        JSON.stringify({ success: false, error: "Email is required" }),
        { status: 400 }
      );

    const mailgun = new Mailgun(FormData);
    const mg = mailgun.client({
      username: "api",
      key: process.env.MAILGUN_API_KEY,
    });

    const domain = process.env.MAILGUN_DOMAIN;
    const fromEmail = `Solvend <postmaster@${domain}>`;

    // 1) Send immediate welcome email
    await mg.messages.create(domain, {
      from: fromEmail,
      to: [email],
      subject: "🚀 Welcome to Solvend!",
      text: "Thanks for signing up! You'll now receive AI-powered cryptocurrency updates every week!",
      html: `<h1>Welcome to Solvend – Mhacks 2025!</h1>
             <p>Hi there,</p>
             <p>Thanks for signing up! You’ll now receive AI-processed cryptocurrency updates, tailored just for you, delivered straight to your inbox.</p>
             <p>— The Solvend Team</p>`,
    });

    // Function to send crypto update email
    const sendCryptoEmail = async () => {
      try {
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/coins/markets",
          {
            params: {
              vs_currency: "usd",
              order: "market_cap_desc",
              per_page: 5,
              page: 1,
              price_change_percentage: "7d",
            },
          }
        );

        const topCoins = response.data
          .map(
            (coin) =>
              `${coin.name} (${coin.symbol.toUpperCase()}): $${
                coin.current_price
              } (7d change: ${coin.price_change_percentage_7d_in_currency.toFixed(
                2
              )}%)`
          )
          .join("<br>");

        await mg.messages.create(domain, {
          from: fromEmail,
          to: [email],
          subject: "📈 Your Weekly Crypto Update from Solvend!",
          text: topCoins.replace(/<br>/g, "\n"),
          html: `<h1>Weekly Crypto Update</h1><p>${topCoins}</p>`,
        });

        console.log(`✅ Crypto email sent to ${email}`);
      } catch (err) {
        console.error(`Error sending crypto email to ${email}:`, err);
      }
    };

    // 2) Send first crypto email immediately
    await sendCryptoEmail();

    // 3) Schedule weekly crypto emails (every Sunday at 9 AM)
    cron.schedule("0 9 * * 0", sendCryptoEmail);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}
