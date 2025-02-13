export default function handler(req, res) {
    if (req.method === 'POST') {
        const payload = req.body;
        const signature = req.headers['x-signature'];

        // Verify the webhook signature
        if (!verifySignature(signature, payload)) {
            return res.status(401).send('Unauthorized');
        }

        // Process the payment status
        if (payload.status === 'paid') {
            console.log('Payment successful:', payload.invoice_id);
        } else if (payload.status === 'failed') {
            console.log('Payment failed:', payload.invoice_id);
        }

        res.status(200).send('OK');
    } else {
        res.status(405).send('Method Not Allowed');
    }
}

function verifySignature(signature, payload) {
    const secret = 'your_webhook_secret'; // Replace with your Chargily webhook secret
    const hmac = crypto.createHmac('sha256', secret);
    const calculatedSignature = hmac.update(JSON.stringify(payload)).digest('hex');
    return signature === calculatedSignature;
}
