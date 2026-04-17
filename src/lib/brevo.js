export const sendEmail = async ({ to, subject, htmlContent }) => {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  const senderName = process.env.BREVO_SENDER_NAME;

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      sender: { name: senderName, email: senderEmail },
      to: typeof to === 'string' ? [{ email: to }] : to,
      subject,
      htmlContent
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Brevo Email Error:', errorData);
    throw new Error(errorData.message || 'Failed to send email');
  }

  return response.json();
};
