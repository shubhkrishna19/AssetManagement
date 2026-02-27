const catalyst = require('zcatalyst-sdk-node');

const app = catalyst.initialize();

async function addSampleAsset() {
    try {
        const datastore = app.datastore();
        const table = datastore.table('Assets');

        const rowData = {
            Asset_ID: 'LPT-001',
            Name: 'Dell XPS 15 (Sample)',
            Status: 'Available',
            Category: 'Laptops',
            Department: 'IT'
        };

        const insertPromise = table.insertRow(rowData);
        const result = await insertPromise;
        console.log("Successfully inserted sample asset:", result);
    } catch (err) {
        console.error("Error inserting sample asset. Did you create the columns?", err);
    }
}

addSampleAsset();
