const express = require('express');
const catalyst = require('zcatalyst-sdk-node');
const app = express();
app.use(express.json());

app.all('/', async (req, res) => {
    const catalystApp = catalyst.initialize(req);
    // CORS setup
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') { res.status(200).send(); return; }

    try {
        if (req.method === 'POST') {
            const { action, data, asset_id, updates, table_name } = req.body;

            // 1. Generic Bulk Import (Supports Assets, Contracts, etc.)
            if (action === 'import' && Array.isArray(data)) {
                const targetTable = table_name || 'Assets'; // Default to Assets if not specified
                console.log(`Importing ${data.length} records into ${targetTable}`);

                const table = catalystApp.datastore().table(targetTable);
                // Insert in parallel
                const insertPromises = data.map(item => table.insertRow(item));
                await Promise.all(insertPromises);

                res.status(200).json({ status: "success", message: `Imported ${data.length} records into ${targetTable}` });
                return;
            }

            // 2. Update Single Record
            if (action === 'update' && asset_id && updates) {
                const zcql = catalystApp.zcql();
                const setClause = Object.entries(updates)
                    .map(([key, value]) => {
                        const safeValue = String(value).replace(/'/g, "''");
                        return `${key} = '${safeValue}'`;
                    })
                    .join(', ');

                if (!setClause) { res.status(200).json({ status: "success" }); return; }

                // Note: Only updates 'Assets' table for now. 
                // To support others, we'd need table_name here too, but UI primarily updates Assets.
                const query = `UPDATE Assets SET ${setClause} WHERE Asset_ID = '${asset_id}'`;
                await zcql.executeZCQLQuery(query);
                res.status(200).json({ status: "success", message: `Updated ${asset_id}` });
                return;
            }
        }

        // 3. Fetch All (Default GET - Assets Only)
        // Ideally we should allow fetching other tables too via query param, but for now App only fetches Assets main list.
        const zcql = catalystApp.zcql();
        const queryResult = await zcql.executeZCQLQuery("SELECT * FROM Assets");
        const assets = queryResult.map(row => row.Assets || row);
        res.status(200).json({ status: "success", source: "catalyst_cloud_db", records: assets });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: error.message, records: [] });
    }
});
module.exports = app;
