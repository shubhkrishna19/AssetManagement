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
        Health_Score: 92,
        Vendor_Name: "Dell Enterprise"
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
        Health_Score: 98,
        Vendor_Name: "Apple Business"
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
        Health_Score: 85,
        Vendor_Name: "Office Depot"
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
        Health_Score: 45,
        Vendor_Name: "Dell Enterprise"
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
        Health_Score: 72,
        Vendor_Name: "Mahindra & Mahindra"
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
        Health_Score: 95,
        Vendor_Name: "Office Depot"
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
        Health_Score: 88,
        Vendor_Name: "Cisco Systems"
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
        Health_Score: 68,
        Vendor_Name: "CleanFaster Services"
    },
    {
        ID: '6',
        Asset_ID: 'AST-006',
        Item_Name: 'Projector 4K',
        Purchase_Date: '2023-01-20',
        Cost: 85000,
        Category: 'Electronics',
        Status: 'Available',
        Assigned_User: null,
        Health_Score: 90,
        Vendor_Name: "Cisco Systems"
    }
];

export const mockReservations = [
    {
        id: 1,
        assetId: 'AST-006',
        userId: 'user1',
        userName: 'Alice Johnson',
        startDate: '2025-12-25',
        endDate: '2025-12-26',
        status: 'Approved',
        purpose: 'Client Presentation'
    },
    {
        id: 2,
        assetId: 'AST-003',
        userId: 'user2',
        userName: 'Bob Smith',
        startDate: '2025-12-28',
        endDate: '2025-12-29',
        status: 'Pending',
        purpose: 'Video Shoot'
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

export const mockConsumables = [
    { id: 1, name: 'Printer Paper (A4)', category: 'Office', quantity: 45, threshold: 10, unit: 'Reams', cost: 450, status: 'In Stock' },
    { id: 2, name: 'Sanitizer Refill', category: 'Health', quantity: 2, threshold: 5, unit: 'Bottles', cost: 120, status: 'Low Stock' },
    { id: 3, name: 'HDMI Cables 2m', category: 'IT', quantity: 12, threshold: 3, unit: 'Pcs', cost: 350, status: 'In Stock' },
    { id: 4, name: 'Coffee Beans', category: 'Pantry', quantity: 0, threshold: 2, unit: 'Kg', cost: 800, status: 'Out of Stock' }
];

export const mockVendors = [
    { id: 1, name: 'Dell Enterprise', type: 'Hardware', contact: 'Michael Scott', email: 'sales@dell.com', phone: '1-800-DELL-BIZ', rating: 4.5, status: 'Preferred' },
    { id: 2, name: 'Office Depot', type: 'Supplies', contact: 'Dwight Schrute', email: 'orders@officedepot.com', phone: '555-0199', rating: 3.8, status: 'Active' },
    { id: 3, name: 'CleanFaster Services', type: 'Maintenance', contact: 'Creed Bratton', email: 'support@cleanfaster.com', phone: '555-9000', rating: 2.5, status: 'Under Review' },
    { id: 4, name: 'Apple Business', type: 'Hardware', contact: 'Tim Cook', email: 'enterprise@apple.com', phone: '1-800-MY-APPLE', rating: 5.0, status: 'Preferred' },
    { id: 5, name: 'Mahindra & Mahindra', type: 'Vehicles', contact: 'Anand Mahindra', email: 'fleet@mahindra.com', phone: '+91-22-2490', rating: 4.8, status: 'Preferred' },
    { id: 6, name: 'Cisco Systems', type: 'Networking', contact: 'Chuck Robbins', email: 'sales@cisco.com', phone: '1-800-CISCO-BIZ', rating: 4.6, status: 'Active' }
];
