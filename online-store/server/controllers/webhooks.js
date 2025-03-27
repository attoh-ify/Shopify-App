import express from 'express';
import verifyShopifyWebhook from '../utilities/verifyShopifyWebhook.js';
import { insertInventoryUpdate, getInventoryUpdates } from '../db.js';

const router = express.Router();


router.post('/webhooks/inventory-update', async (req, res) => {
    if (!verifyShopifyWebhook(req)) {
        return res.status(401).send('Unauthorized');
    };

    try {
        // process webhook payload below
        const { product_id, sku, available } = req.body;
        
        const inventoryData = {
            productId: product_id,
            sku,
            available,
        };
        await insertInventoryUpdate(inventoryData);
        console.log('Received inventory update:', inventoryData);
        return res.status(200).send('Inventory update received, webhook processed.');
    } catch (error) {
        console.log('Error processing inventory update:', error);
        return res.status(500).send('Internal server error');
    };
});


router.get('/api/inventory-history', async (req, res) => {
    try {
        const updates = await getInventoryUpdates();
        return res.status(200).json({ data: updates });
    } catch (error) {
        return res.status(500).json({ error: 'Unable to fetch data' });
    };
});


export default router;
