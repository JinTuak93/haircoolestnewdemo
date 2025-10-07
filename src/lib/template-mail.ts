import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";

export function emailTemplate(
  email: string,
  name: string,
  phone: string,
  message: string
): string {
  const timeZone = "Asia/Bangkok"; // GMT+7
  const now = new Date();
  const zonedDate = toZonedTime(now, timeZone);
  const formattedDate = format(zonedDate, "yyyy-MM-dd HH:mm:ss");

  return `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #fff; border-radius: 8px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); }
          h2 { color: #007bff; text-align: center; }
          .details { background: #f9f9f9; padding: 15px; border-radius: 5px; }
          p { margin: 8px 0; }
          .footer { margin-top: 20px; font-size: 12px; color: #777; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>📩 Booking Order</h2>
          <p>Ada orderan booking pada tanggal <strong>${formattedDate} (GMT+7)</strong>:</p>
          <div class="details">
            <p><strong>Nama:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>No HP:</strong> ${phone}</p>
            <p><strong>Pesan:</strong> ${message}</p>
          </div>
          <p class="footer">Pesan ini dikirim otomatis. Mohon segera hubungi customer Anda melalui email atau nomor HP yang terlampir.</p>
        </div>
      </body>
    </html>
  `;
}
