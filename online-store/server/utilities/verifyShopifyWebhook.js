import crypto from 'crypto';

const SHOPIFY_API_SECRET = process.env.SHOPIFY_API_SECRET


const verifyShopifyWebhook = (req) => {
    const hmacHeader = req.headers['x-shopify-hmac-sha256'];
    const body = JSON.stringify(req.body);
    const generatedHmac = crypto
        .createHmac('sha256', SHOPIFY_API_SECRET)
        .update(body, 'utf8')
        .digest('base64');
    return crypto.timingSafeEqual(Buffer.from(hmacHeader), Buffer.from(generatedHmac));
};


export default verifyShopifyWebhook;
