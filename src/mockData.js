// Mock Asset Data - Used when API Bridge is offline
// This provides a realistic demo experience during development

export const mockAssets = [
    {
        ID: "1",
        Asset_ID: "BW-IT-001",
        Item_Name: "Dell Latitude 5520",
        Category: "IT Equipment",
        Status: "Assigned",
        Assigned_User: { display_value: "Shubh Krishna" },
        Purchase_Date: "2023-06-15",
        Cost: 85000,
        Location: "Head Office - Bangalore",
        Health_Score: 92
    },
    {
        ID: "2",
        Asset_ID: "BW-IT-002",
        Item_Name: "MacBook Pro 14\"",
        Category: "IT Equipment",
        Status: "Assigned",
        Assigned_User: { display_value: "Design Team" },
        Purchase_Date: "2024-01-10",
        Cost: 199000,
        Location: "Creative Studio",
        Health_Score: 98
    },
    {
        ID: "3",
        Asset_ID: "BW-FN-001",
        Item_Name: "Executive Desk - Walnut",
        Category: "Furniture",
        Status: "Available",
        Assigned_User: null,
        Purchase_Date: "2022-03-20",
        Cost: 45000,
        Location: "Warehouse A",
        Health_Score: 85
    },
    {
        ID: "4",
        Asset_ID: "BW-IT-003",
        Item_Name: "HP LaserJet Pro MFP",
        Category: "IT Equipment",
        Status: "Under Maintenance",
        Assigned_User: { display_value: "Operations" },
        Purchase_Date: "2021-11-05",
        Cost: 32000,
        Location: "Print Room",
        Health_Score: 45
    },
    {
        ID: "5",
        Asset_ID: "BW-VH-001",
        Item_Name: "Mahindra Bolero",
        Category: "Vehicle",
        Status: "Assigned",
        Assigned_User: { display_value: "Logistics Team" },
        Purchase_Date: "2020-08-12",
        Cost: 850000,
        Location: "Mumbai Depot",
        Health_Score: 72
    },
    {
        ID: "6",
        Asset_ID: "BW-FN-002",
        Item_Name: "Conference Table - 12 Seater",
        Category: "Furniture",
        Status: "Available",
        Assigned_User: null,
        Purchase_Date: "2023-02-28",
        Cost: 120000,
        Location: "Board Room",
        Health_Score: 95
    },
    {
        ID: "7",
        Asset_ID: "BW-IT-004",
        Item_Name: "Cisco IP Phone 8845",
        Category: "IT Equipment",
        Status: "Assigned",
        Assigned_User: { display_value: "Reception" },
        Purchase_Date: "2022-07-15",
        Cost: 18500,
        Location: "Front Desk",
        Health_Score: 88
    },
    {
        ID: "8",
        Asset_ID: "BW-MC-001",
        Item_Name: "CNC Router Machine",
        Category: "Machinery",
        Status: "In Use",
        Assigned_User: { display_value: "Production Floor" },
        Purchase_Date: "2019-04-10",
        Cost: 2500000,
        Location: "Factory Unit 1",
        Health_Score: 68
    }
];

// Summary stats for dashboard (can be computed from mockAssets)
export const mockStats = {
    totalAssets: mockAssets.length,
    totalValue: mockAssets.reduce((sum, a) => sum + a.Cost, 0),
    assigned: mockAssets.filter(a => a.Status === "Assigned").length,
    available: mockAssets.filter(a => a.Status === "Available").length,
    maintenance: mockAssets.filter(a => a.Status === "Under Maintenance").length,
    avgHealth: Math.round(mockAssets.reduce((sum, a) => sum + a.Health_Score, 0) / mockAssets.length),

    // Chart Ready Data
    categoryData: [
        { name: 'IT Equipment', value: 4, color: '#0984e3' },
        { name: 'Furniture', value: 2, color: '#00b894' },
        { name: 'Vehicle', value: 1, color: '#fdcb6e' },
        { name: 'Machinery', value: 1, color: '#e17055' },
    ],
    healthData: [
        { name: 'Excellent', value: 48, color: '#00b894' },
        { name: 'Good', value: 32, color: '#0984e3' },
        { name: 'Fair', value: 15, color: '#fdcb6e' },
        { name: 'Poor', value: 5, color: '#e74c3c' },
    ],
    trendData: [
        { month: 'Jan', value: 1200000 },
        { month: 'Feb', value: 1500000 },
        { month: 'Mar', value: 1400000 },
        { month: 'Apr', value: 2500000 },
        { month: 'May', value: 2800000 },
        { month: 'Jun', value: 3200000 },
        { month: 'Jul', value: 3904500 },
    ]
};
