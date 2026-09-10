import axios from 'axios';

export const sendPasswordResetOtp = async (phone, otp) => {
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM } = process.env;
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_WHATSAPP_FROM) {
    throw new Error('WhatsApp configuration is incomplete');
  }

  const internationalPhone = phone.startsWith('+')
    ? phone
    : `${process.env.WHATSAPP_COUNTRY_CODE || ''}${phone}`;
  if (!internationalPhone.startsWith('+')) {
    throw new Error('WHATSAPP_COUNTRY_CODE is required for local phone numbers');
  }

  const body = new URLSearchParams({
    From: TWILIO_WHATSAPP_FROM,
    To: `whatsapp:${internationalPhone}`,
    Body: `Your Bloodly password reset code is ${otp}. It expires in 10 minutes and can only be used once.`,
  });

  await axios.post(
    `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
    body.toString(),
    {
      auth: { username: TWILIO_ACCOUNT_SID, password: TWILIO_AUTH_TOKEN },
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    }
  );
};

export default { sendPasswordResetOtp };