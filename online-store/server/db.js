import pkg from 'pg';
const { Pool } = pkg;


// Create a connection pool using environment variables
const pool = new Pool({
    connectionString: `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});


// Query functions to interact with the DB
export async function query(text, params) {
    const start = Date.now();
    try {
        const res = await pool.query(text, params);
        const duration = Date.now() - start;
        console.log('executed query', { text, duration, rows: res.rowCount });
        return res;
    } catch (error) {
        console.error('Error executing query', { text, err });
        throw error;
    };
};


// Function to insert an inventory update
export async function insertInventoryUpdate({ productId, sku, available }) {
    const text = `
    INSERT INTO inventory_updates (product_id, sku, available)
    VALUES ($1, $2, $3)
    RETURNING *
    `;
    const values = [productId, sku, available];
    const result = await query(text, values);
    return result.rows[0];
};


// Function to fetch inventory updates
export async function getInventoryUpdates(limit = 10) {
    const text = `
        SELECT * FROM inventory_updates
        ORDER BY created_at DESC
        LIMIT $1
    `;
    const result = await query(text, [limit]);
    return result.rows;
};


// Function to check low inventory
export async function checkLowInventory(limit) {
    const text = `
        SELECT * FROM inventory_updates
        WHERE available < $1
    `;
    const result = await query(text, [limit]);
    return result.rows;
};
