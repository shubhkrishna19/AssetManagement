const express = require('express');
const catalyst = require('zcatalyst-sdk-node');
const app = express();
app.use(express.json());

app.all('/', async (req, res) => {
    const catalystApp = catalyst.initialize(req);

    // CORS Setup
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(200).send();
        return;
    }

    try {
        if (req.method === 'POST') {
            const { action, data, asset_id, updates, table_name, key_column } = req.body;
            console.log(`[bridgex] Action: ${action}, Table: ${table_name || 'Assets'}`);

            // 1. Generic Bulk Import
            if (action === 'import' && Array.isArray(data)) {
                const targetTable = table_name || 'Assets';
                const table = catalystApp.datastore().table(targetTable);

                // Insert rows one by one to avoid batch failures
                let successCount = 0;
                let errors = [];

                for (const item of data) {
                    try {
                        await table.insertRow(item);
                        successCount++;
                    } catch (err) {
                        errors.push({ item: item.Asset_ID || item.ID, error: err.message });
                    }
                }

                res.status(200).json({
                    status: "success",
                    message: `Imported ${successCount}/${data.length} records into ${targetTable}`,
                    errors: errors.length > 0 ? errors : undefined
                });
                return;
            }

            // 2. Delete Records
            if (action === 'delete' && Array.isArray(data)) {
                const targetTable = table_name || 'Assets';
                const keyCol = key_column || 'Asset_ID';
                const zcql = catalystApp.zcql();

                let deleteCount = 0;
                for (const id of data) {
                    try {
                        const query = `DELETE FROM ${targetTable} WHERE ${keyCol} = '${id}'`;
                        await zcql.executeZCQLQuery(query);
                        deleteCount++;
                    } catch (err) {
                        console.error(`Delete error for ${id}:`, err.message);
                    }
                }

                res.status(200).json({
                    status: "success",
                    message: `Deleted ${deleteCount}/${data.length} records from ${targetTable}`
                });
                return;
            }

            // 3. Update Single Record
            if (action === 'update' && asset_id && updates) {
                const zcql = catalystApp.zcql();
                const setClause = Object.entries(updates)
                    .map(([key, value]) => `${key} = '${String(value).replace(/'/g, "''")}'`)
                    .join(', ');
                if (!setClause) {
                    res.status(200).json({ status: "success" });
                    return;
                }
                const query = `UPDATE Assets SET ${setClause} WHERE Asset_ID = '${asset_id}'`;
                await zcql.executeZCQLQuery(query);
                res.status(200).json({ status: "success", message: `Updated ${asset_id}` });
                return;
            }

            // 4. Reset All (Delete all from table)
            if (action === 'reset_all') {
                const targetTable = table_name || 'Assets';
                const zcql = catalystApp.zcql();
                // Get all ROWIDs first
                const rows = await zcql.executeZCQLQuery(`SELECT ROWID FROM ${targetTable}`);
                const table = catalystApp.datastore().table(targetTable);

                for (const row of rows) {
                    const rowId = row[targetTable]?.ROWID || row.ROWID;
                    if (rowId) {
                        await table.deleteRow(rowId);
                    }
                }

                res.status(200).json({ status: "success", message: `Cleared all records from ${targetTable}` });
                return;
            }
        }

        // Default: Fetch All Assets with pagination (ZCQL limit is 300 per query)
        const zcql = catalystApp.zcql();
        const PAGE_SIZE = 300;
        let allAssets = [];
        let offset = 0;
        let hasMore = true;

        while (hasMore) {
            const query = `SELECT * FROM Assets LIMIT ${PAGE_SIZE} OFFSET ${offset}`;
            const queryResult = await zcql.executeZCQLQuery(query);
            const pageAssets = queryResult.map(row => row.Assets || row);
            allAssets = allAssets.concat(pageAssets);

            if (pageAssets.length < PAGE_SIZE) {
                hasMore = false;
            } else {
                offset += PAGE_SIZE;
            }
        }

        console.log(`[bridgex] Fetched ${allAssets.length} total assets`);
        res.status(200).json({ status: "success", source: "catalyst_cloud_db", records: allAssets, total: allAssets.length });

    } catch (error) {
        console.error('[bridgex] Error:', error);
        res.status(500).json({ status: "error", message: error.message, records: [] });
    }
});

module.exports = app;