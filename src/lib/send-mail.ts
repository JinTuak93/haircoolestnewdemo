"use server";

import { emailTemplate } from "./template-mail";
import nodemailer from "nodemailer";
import data from "@/common/data";

export async function bookingEmail(
  email: string,
  name: string,
  phone: string,
  message: string
): Promise<void> {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    // to: "jintuak93@gmail.com",
    to: data.social_media.email,
    subject: "Booking Order",
    html: emailTemplate(email, name, phone, message),
  };
  try {
    await transporter.sendMail(mailOptions);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    throw new Error("Failed to send verification email");
  }
}
