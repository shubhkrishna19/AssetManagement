const express = require('express');
const catalyst = require('zcatalyst-sdk-node');
const app = express();
app.use(express.json());

app.all('/', async (req, res) => {
    const catalystApp = catalyst.initialize(req);
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') { res.status(200).send(); return; }

    try {
        if (req.method === 'POST') {
            const { action, data, asset_id, updates, table_name } = req.body;

            // 1. Generic Bulk Import
            if (action === 'import' && Array.isArray(data)) {
                const targetTable = table_name || 'Assets';
                const table = catalystApp.datastore().table(targetTable);
                const insertPromises = data.map(item => table.insertRow(item));
                await Promise.all(insertPromises);
                res.status(200).json({ status: "success", message: `Imported ${data.length} records into ${targetTable}` });
                return;
            }

            // 2. Update Single Record
            if (action === 'update' && asset_id && updates) {
                const zcql = catalystApp.zcql();
                const setClause = Object.entries(updates)
                    .map(([key, value]) => `${key} = '${String(value).replace(/'/g, "''")}'`)
                    .join(', ');
                if (!setClause) { res.status(200).json({ status: "success" }); return; }
                const query = `UPDATE Assets SET ${setClause} WHERE Asset_ID = '${asset_id}'`;
                await zcql.executeZCQLQuery(query);
                res.status(200).json({ status: "success", message: `Updated ${asset_id}` });
                return;
            }

            // 3. Reset All Data (Danger Zone)
            if (action === 'reset_all') {
                const zcql = catalystApp.zcql();
                const tables = ['Assets', 'Contracts', 'Employees', 'Maintenance', 'Vendors'];

                // Note: ZCQL DELETE without WHERE deletes all rows. 
                // We execute sequentially to avoid concurrency limits.
                for (const table of tables) {
                    try {
                        // We check if table exists by trying to delete. 
                        // If 0 rows, it's fine.
                        await zcql.executeZCQLQuery(`DELETE FROM ${table}`);
                    } catch (e) {
                        console.log(`Skipping delete for ${table}: ${e.message}`);
                    }
                }
                res.status(200).json({ status: "success", message: "All tables cleared." });
                return;
            }

            // 4. Generic Delete (New)
            if (action === 'delete' && Array.isArray(data) && data.length > 0) {
                const targetTable = table_name || 'Assets';
                // Default to Asset_ID for Assets, but allow override (e.g. ROWID or Contract_No)
                const targetCol = req.body.key_column || 'Asset_ID';

                const zcql = catalystApp.zcql();

                // Construct IN clause: WHERE Col IN ('val1', 'val2')
                const idsList = data.map(id => `'${String(id).replace(/'/g, "''")}'`).join(', ');
                const query = `DELETE FROM ${targetTable} WHERE ${targetCol} IN (${idsList})`;

                await zcql.executeZCQLQuery(query);
                res.status(200).json({ status: "success", message: `Deleted ${data.length} records from ${targetTable}` });
                return;
            }
        }

        const zcql = catalystApp.zcql();

        // Count Mode (Lightweight verification)
        if (req.query.mode === 'count') {
            const countQuery = await zcql.executeZCQLQuery("SELECT COUNT(ROWID) FROM Assets");
            res.status(200).json({ status: "success", count: countQuery[0].Assets.ROWID, source: "catalyst_cloud_db" });
            return;
        }

        const queryResult = await zcql.executeZCQLQuery("SELECT * FROM Assets");
        const assets = queryResult.map(row => row.Assets || row);
        res.status(200).json({ status: "success", source: "catalyst_cloud_db", records: assets });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: error.message, records: [] });
    }
});
module.exports = app;;
