import FormData from "form-data";
import Mailgun from "mailgun.js";
import cron from "node-cron";
import { exec } from "child_process";
import fs from "fs/promises";
import { v4 as uuidv4 } from "uuid";

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
      html: `<h1>Welcome to Solvend!</h1>
             <p>Hi there,</p>
             <p>Thanks for signing up! You’ll now receive AI-processed cryptocurrency updates, tailored just for you, delivered straight to your inbox.</p>
             <p>— The Solvend Team</p>`,
    });

    // Function to send crypto update email
    const sendCryptoEmail = async () => {
    const filename = `crypto_update_${uuidv4()}.html`;
    try {
      // Call the Python script with --filename argument
      await new Promise((resolve, reject) => {
        exec(`python generate.py.py --filename ${filename} --items JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN 0x514910771af9ca656af840dff83e8264ecf986ca`, (error, stdout, stderr) => {
          if (error) {
            reject(error);
          } else {
            resolve(stdout);
          }
        });
      });

      // Wait 3 seconds to ensure the file is fully written
      await new Promise((resolve) => setTimeout(resolve, 3000));
 
      // Read the file contents
      const htmlContent = await fs.readFile(filename, "utf-8");

      // Send the email with file contents as HTML
      await mg.messages.create(domain, {
        from: fromEmail,
        to: [email],
        subject: "📈 Your Daily Crypto Update from Solvend!",
        html: htmlContent,
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
