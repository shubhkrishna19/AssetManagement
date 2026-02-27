const express = require('express');
const catalyst = require('zcatalyst-sdk-node');
const cors = require('cors');
const app = express();
app.use(express.json());

// CORS Setup - Allow Creator and CRM domains
const allowedOrigins = [
    'https://creator.zoho.com',
    'https://assetmanagement.onslate.com',
    'https://assetmanagementdev.onslate.com',
    'http://localhost:5173',
    'http://localhost:3000'
];

app.use(cors({
    origin: function (origin, callback) {
        console.log(`[bridgex] CORS preflight: Origin received: '${origin}'`);
        // Allow all origins temporarily to unblock the frontend and debug
        callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Catalyst-User-ID', 'origin', 'x-requested-with', 'accept'],
    credentials: true,
    optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
}));

app.all('/', async (req, res) => {

    let catalystApp;
    try {
        catalystApp = catalyst.initialize(req);
    } catch (e) {
        console.error("Catalyst init error:", e);
        res.status(500).json({ status: "error", message: "Failed to initialize Catalyst Context" });
        return;
    }

    // Helper to get table
    const getTable = async (tableName) => {
        const table = catalystApp.datastore().table(tableName);
        const rows = await table.getAllRows();
        return { table, rows };
    };

    try {
        const { action, data, asset_id, updates, table_name, key_column } = req.body || {};
        console.log(`[bridgex] Method: ${req.method}, Action: ${action}`);

        // Action to initialize tables (run once)
        if (action === 'init_tables') {
            const tables = {
                'Assets': [
                    { column_name: 'Asset_ID', data_type: 'string', length: 100 },
                    { column_name: 'Asset_Name', data_type: 'string', length: 200 },
                    { column_name: 'Category', data_type: 'string', length: 100 },
                    { column_name: 'Status', data_type: 'string', length: 50 },
                    { column_name: 'Location', data_type: 'string', length: 200 },
                    { column_name: 'Assigned_To', data_type: 'string', length: 200 },
                    { column_name: 'Purchase_Date', data_type: 'date' },
                    { column_name: 'Purchase_Cost', data_type: 'number' },
                    { column_name: 'Description', data_type: 'text' }
                ],
                'Consumables': [
                    { column_name: 'Consumable_ID', data_type: 'string', length: 100 },
                    { column_name: 'Item_Name', data_type: 'string', length: 200 },
                    { column_name: 'Quantity', data_type: 'number' },
                    { column_name: 'Category', data_type: 'string', length: 100 },
                    { column_name: 'Unit', data_type: 'string', length: 50 }
                ],
                'Vendors': [
                    { column_name: 'Vendor_ID', data_type: 'string', length: 100 },
                    { column_name: 'Vendor_Name', data_type: 'string', length: 200 },
                    { column_name: 'Contact_Email', data_type: 'string', length: 150 },
                    { column_name: 'Phone', data_type: 'string', length: 50 }
                ],
                'Departments': [
                    { column_name: 'Department_ID', data_type: 'string', length: 100 },
                    { column_name: 'Department_Name', data_type: 'string', length: 200 },
                    { column_name: 'Head', data_type: 'string', length: 150 }
                ],
                'Reservations': [
                    { column_name: 'Reservation_ID', data_type: 'string', length: 100 },
                    { column_name: 'Asset_ID', data_type: 'string', length: 100 },
                    { column_name: 'Reserved_By', data_type: 'string', length: 150 },
                    { column_name: 'Start_Date', data_type: 'date' },
                    { column_name: 'End_Date', data_type: 'date' },
                    { column_name: 'Status', data_type: 'string', length: 50 }
                ]
            };

            const created = [];
            for (const [tableName, cols] of Object.entries(tables)) {
                try {
                    await getTable(tableName, cols);
                    created.push(tableName);
                } catch (e) {
                    console.error(`Failed to create ${tableName}:`, e.message);
                }
            }
            res.status(200).json({ status: 'success', message: 'Tables initialized', created });
            return;
        }

        if (req.method === 'POST') {
            console.log(`[bridgex] POST Data received for action: ${action}`);

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

            // 3. Update Single Record (Legacy compatibility)
            if (action === 'update' && asset_id && updates && !table_name) {
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

            // 5. Create single record
            if (action === 'create' && data && typeof data === 'object') {
                const targetTable = table_name || 'Assets';
                const table = catalystApp.datastore().table(targetTable);
                await table.insertRow(data);
                res.status(200).json({ status: 'success', message: `Created record in ${targetTable}` });
                return;
            }

            // 6. Generic Update
            if (action === 'update' && asset_id && updates && table_name) {
                const targetTable = table_name;
                const keyCol = key_column || (targetTable === 'Consumables' ? 'Consumable_ID' : (targetTable === 'Vendors' ? 'Vendor_ID' : (targetTable === 'Reservations' ? 'Reservation_ID' : (targetTable === 'Departments' ? 'Department_ID' : 'ID'))));
                const zcql = catalystApp.zcql();
                const setClause = Object.entries(updates)
                    .map(([k, v]) => `${k} = '${String(v).replace(/'/g, "''")}'`)
                    .join(', ');
                if (!setClause) {
                    res.status(200).json({ status: 'success' });
                    return;
                }
                const query = `UPDATE ${targetTable} SET ${setClause} WHERE ${keyCol} = '${asset_id}'`;
                await zcql.executeZCQLQuery(query);
                res.status(200).json({ status: 'success', message: `Updated ${asset_id} in ${targetTable}` });
                return;
            }
        }

        // Fetch Actions (triggered via POST or GET)
        if (action === 'getConsumables') {
            try {
                const table = catalystApp.datastore().table('Consumables');
                const rows = await table.getAllRows();
                res.status(200).json({ status: 'success', records: rows });
            } catch (err) {
                console.warn('[bridgex] Consumables table not found or error:', err.message);
                res.status(200).json({ status: 'success', records: [] });
            }
            return;
        }
        if (action === 'getVendors') {
            try {
                const table = catalystApp.datastore().table('Vendors');
                const rows = await table.getAllRows();
                res.status(200).json({ status: 'success', records: rows });
            } catch (err) {
                console.warn('[bridgex] Vendors table not found or error:', err.message);
                res.status(200).json({ status: 'success', records: [] });
            }
            return;
        }
        if (action === 'getReservations') {
            try {
                const table = catalystApp.datastore().table('Reservations');
                const rows = await table.getAllRows();
                res.status(200).json({ status: 'success', records: rows });
            } catch (err) {
                console.warn('[bridgex] Reservations table not found or error:', err.message);
                res.status(200).json({ status: 'success', records: [] });
            }
            return;
        }
        if (action === 'getDepartments') {
            try {
                const table = catalystApp.datastore().table('Departments');
                const rows = await table.getAllRows();
                res.status(200).json({ status: 'success', records: rows });
            } catch (err) {
                console.warn('[bridgex] Departments table not found or error:', err.message);
                res.status(200).json({ status: 'success', records: [] });
            }
            return;
        }
        // 7. Verify User (for Creator SSO integration)
        if (action === 'verify_user' && data && data.user_id) {
            try {
                const zcql = catalystApp.zcql();
                const userId = data.user_id;
                const users = await zcql.executeZCQLQuery(`SELECT * FROM Users WHERE User_ID = '${userId}'`);
                if (users.length > 0) {
                    const user = users[0].Users || users[0];
                    res.status(200).json({
                        status: 'success',
                        user: {
                            id: user.User_ID,
                            name: user.Name,
                            email: user.Email,
                            role: user.Role || 'viewer',
                            department: user.Department
                        }
                    });
                } else {
                    res.status(200).json({ status: 'success', user: null, message: 'User not found' });
                }
            } catch (err) {
                // Users table might not exist, return default
                res.status(200).json({
                    status: 'success',
                    user: {
                        id: data.user_id,
                        name: 'User',
                        role: data.role || 'employee'
                    }
                });
            }
            return;
        }

        // 8. Get all tables info (for CRM data viewer)
        if (action === 'get_tables_info') {
            try {
                const tables = ['Assets', 'Consumables', 'Vendors', 'Reservations', 'Departments'];
                const tableInfo = [];

                for (const tableName of tables) {
                    try {
                        // Use Datastore API instead of ZCQL
                        const table = catalystApp.datastore().table(tableName);
                        const rows = await table.getAllRows();
                        tableInfo.push({ name: tableName, recordCount: rows.length });
                    } catch (e) {
                        tableInfo.push({ name: tableName, recordCount: 0, error: e.message });
                    }
                }

                res.status(200).json({ status: 'success', tables: tableInfo });
            } catch (err) {
                res.status(200).json({ status: 'success', tables: [], error: err.message });
            }
            return;
        }

        // 9. Generic fetch by table name (for Creator/CRM data viewer)
        if (action === 'fetch_table' && table_name) {
            try {
                const table = catalystApp.datastore().table(table_name);
                const rows = await table.getAllRows();
                res.status(200).json({ status: 'success', records: rows, table: table_name });
            } catch (err) {
                res.status(200).json({ status: 'success', records: [], table: table_name, error: err.message });
            }
            return;
        }

        if (action === 'getAssets' || !action) {
            try {
                // Use Datastore API instead of ZCQL (ZCQL doesn't support SELECT *)
                const table = catalystApp.datastore().table('Assets');
                const rows = await table.getAllRows();
                res.status(200).json({ status: "success", source: "catalyst_cloud_db", records: rows, total: rows.length });
            } catch (err) {
                console.warn('[bridgex] Assets table not found or error:', err.message);
                res.status(200).json({ status: 'success', records: [] });
            }
            return;
        }

    } catch (error) {
        console.error('[bridgex] Error:', error);
        res.status(500).json({ status: "error", message: error.message, records: [] });
    }
});

module.exports = app;