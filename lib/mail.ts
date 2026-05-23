import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

export async function sendUserOTP(toEmail: string, otpCode: string, fullName: string) {
  const safeName = fullName || 'Quý khách'
  const html = `
  <div style="font-family: Arial, sans-serif; background:#0b0f16; color:#ffffff; padding:24px; border-radius:12px;">
    <h2 style="color:#00e5ff;">QuocBank - Mã xác thực đăng nhập</h2>
    <p>Xin chào <strong>${safeName}</strong>,</p>
    <p>Mã xác thực 6 số của bạn:</p>
    <div style="font-size:28px; letter-spacing:6px; font-weight:bold; background:#111827; padding:12px 16px; border-radius:8px; display:inline-block;">${otpCode}</div>
    <p style="margin-top:16px; color:#fbbf24;">Vui lòng không chia sẻ mã này cho bất kỳ ai.</p>
    <p style="color:#9ca3af;">Mã có hiệu lực trong 5 phút.</p>
  </div>
  `

  try {
    const info = await transporter.sendMail({
      from: `QuocBank Security <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: 'QuocBank OTP Verification',
      html,
    })

    if (process.env.NODE_ENV !== 'production') {
      // Helpful debug output during development
      // eslint-disable-next-line no-console
      console.log('OTP email sent:', { to: toEmail, messageId: info?.messageId })
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to send OTP email:', err)

    // In development, fallback to printing the OTP so testing can continue
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.log(`DEV FALLBACK - OTP for ${toEmail}: ${otpCode}`)
      return
    }

    throw err
  }
}
