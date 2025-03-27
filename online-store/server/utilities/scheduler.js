import cron from 'node-cron';
import { sendLowStockAlert } from './notifications.js';
import { checkLowInventory } from '../db.js';


// Schedule the job to run every hour
export function startScheduler() {
    cron.schedule('0 * * * *', async () => {
        console.log('Running scheduled inventory check...');
        try {
            const lowStockProducts = await checkLowInventory(5);  // Query DB for products below threshold
            for (const product of lowStockProducts) {
                await sendLowStockAlert(product);
            };
        } catch (error) {
            console.error('Error during scheduled inventory check:', error);
        };
    });

    console.log('Scheduler initiated successfully.');
};
