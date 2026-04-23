import crypto from 'crypto';

export const initializePayment = async (email, amountInKobo, reference, metadata) => {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  const response = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secret}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email,
      amount: amountInKobo,
      reference,
      metadata,
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/verify`
    })
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Payment initialization failed');
  }
  
  return response.json();
};

export const verifyTransaction = async (reference) => {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${secret}`
    }
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Payment verification failed');
  }
  
  return response.json();
};
