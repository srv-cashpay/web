import { midtransClient } from 'midtrans-client';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const snap = await midtransClient.createTransaction({
      transaction_details: {
        order_id: 'YOUR_ORDER_ID',
        gross_amount: 10000, // amount in Rupiah
      },
      credit_card: {
        secure: true,
      },
    });

    res.status(200).json({ snap });
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
