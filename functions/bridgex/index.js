const express = require('express');
const app = express();

app.use(express.json());

// Mock Data (matches frontend mockData.js)
const mockRecords = [
    { ID: '1', Asset_ID: 'AST-001', Item_Name: 'Dell XPS 15', Purchase_Date: '2023-01-15', Cost: 185000, Category: 'Laptop', Status: 'In Use', Assigned_User: { display_value: 'Alice Johnson' } },
    { ID: '2', Asset_ID: 'AST-002', Item_Name: 'MacBook Pro M2', Purchase_Date: '2023-03-10', Cost: 240000, Category: 'Laptop', Status: 'Available', Assigned_User: null },
    { ID: '3', Asset_ID: 'AST-003', Item_Name: 'Herman Miller Chair', Purchase_Date: '2022-11-05', Cost: 95000, Category: 'Furniture', Status: 'In Use', Assigned_User: { display_value: 'Bob Smith' } },
    { ID: '4', Asset_ID: 'AST-004', Item_Name: 'Sony 4K Monitor', Purchase_Date: '2023-06-20', Cost: 45000, Category: 'Electronics', Status: 'Under Maintenance', Assigned_User: null },
    { ID: '5', Asset_ID: 'AST-005', Item_Name: 'Polycom Conf Phone', Purchase_Date: '2021-08-12', Cost: 35000, Category: 'Equipment', Status: 'In Use', Assigned_User: { display_value: 'Conference Room A' } }
];

app.all('/', (req, res) => {
    // Enable CORS
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(200).send();
        return;
    }

    // Return Success with Records
    res.status(200).json({
        status: "success",
        message: "Live connection established (BridgeX v2.0)",
        records: mockRecords
    });
});

module.exports = app;
