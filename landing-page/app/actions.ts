"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactEmail(formData: {
  name: string;
  email: string;
  company?: string;
  message: string;
  subject?: string;
}) {
  const { name, email, company, message, subject } = formData;

  try {
    const data = await resend.emails.send({
      from: "Untainted Lead <hello@untainted.io>", // Default Resend testing domain
      to: ["hello@untainted.io"],
      replyTo: email, // Set reply-to as the submitter's email
      subject: `New Contact Submission: ${subject || "General Inquiry"}`,
      html: `
        <h1>New Contact Form Submission</h1>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company || "N/A"}</p>
        <p><strong>Subject:</strong> ${subject || "General Inquiry"}</p>
        <hr />
        <h3>Message:</h3>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
    });

    if (data.error) {
      console.error("Resend API Error:", data.error);
      return { success: false, error: data.error };
    }

    console.log("Email sent successfully:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Resend Unexpected Error:", error);
    return { success: false, error };
  }
}
