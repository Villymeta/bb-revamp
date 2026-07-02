import nodemailer from "nodemailer";

export async function GET() {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Beanies On Business" <${process.env.SMTP_EMAIL}>`,
    to: "villymeta@gmail.com",
    subject: "🧢 Test Email from Beanies On Business",
    html: "<h2>It works!</h2><p>This email was sent through your Supabase SMTP config.</p>",
  });

  return Response.json({ message: "Test email sent successfully!" });
}