const express = require('express');
const catalyst = require('zcatalyst-sdk-node');
const app = express();

app.use(express.json());

// Production Data Access Layer
app.all('/', async (req, res) => {
    // 1. Initialize SDK
    const catalystApp = catalyst.initialize(req);

    // 2. CORS Headers (Allow frontend access)
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(200).send();
        return;
    }

    try {
        // 3. Handle Data Import (POST)
        if (req.method === 'POST') {
            const { action, data } = req.body;

            if (action === 'import' && Array.isArray(data)) {
                // Bulk Insert into 'Assets' table
                const table = catalystApp.datastore().table('Assets');
                const insertPromises = data.map(item => table.insertRow(item));
                await Promise.all(insertPromises);

                res.status(200).json({ status: "success", message: `Successfully imported ${data.length} assets.` });
                return;
            }
        }

        // 4. Handle Data Fetch (GET) - Default
        // Use ZCQL to query the 'Assets' table
        const zcql = catalystApp.zcql();
        const query = "SELECT * FROM Assets";
        const queryResult = await zcql.executeZCQLQuery(query);

        // Transform result (ZCQL returns rows with table prefix usually, or direct objects)
        const assets = queryResult.map(row => row.Assets || row);

        res.status(200).json({
            status: "success",
            source: "catalyst_cloud_db",
            records: assets
        });

    } catch (error) {
        console.error("Backend Error:", error);
        // Fallback to empty array if DB fails/is empty, to prevent frontend crash
        res.status(500).json({
            status: "error",
            message: error.message,
            records: []
        });
    }
});

module.exports = app;
