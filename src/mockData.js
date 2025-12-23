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
    { id: 1, assetId: 'BLW-002', userId: 'user1', userName: 'Priya Sharma', startDate: '2025-12-26', endDate: '2025-12-28', status: 'Approved', purpose: 'Client Presentation' },
    { id: 2, assetId: 'BLW-030', userId: 'user2', userName: 'Suresh Driver', startDate: '2025-12-27', endDate: '2025-12-29', status: 'Pending', purpose: 'Warehouse Delivery' },
    { id: 3, assetId: 'BLW-051', userId: 'user3', userName: 'Amit Patel', startDate: '2025-12-30', endDate: '2025-12-31', status: 'Approved', purpose: 'Training Session' },
    { id: 4, assetId: 'BLW-001', userId: 'user4', userName: 'Neha Singh', startDate: '2026-01-02', endDate: '2026-01-05', status: 'Approved', purpose: 'Remote Work Assignment' },
    { id: 5, assetId: 'BLW-032', userId: 'user5', userName: 'Warehouse Team', startDate: '2026-01-10', endDate: '2026-01-12', status: 'Pending', purpose: 'Inventory Reorganization' },
    { id: 6, assetId: 'BLW-005', userId: 'user1', userName: 'Priya Sharma', startDate: '2026-01-15', endDate: '2026-01-18', status: 'Cancelled', purpose: 'Field Survey' },
    { id: 7, assetId: 'BLW-040', userId: 'user6', userName: 'IT Admin', startDate: '2025-12-25', endDate: '2025-12-26', status: 'Approved', purpose: 'Server Maintenance Window' }
];

export const mockContracts = [
    { id: 1, contractNo: 'CON-2024-001', vendor: 'Dell Enterprise', type: 'AMC', startDate: '2024-01-01', endDate: '2025-12-31', value: 250000, status: 'Active', assets: ['BLW-001', 'BLW-003', 'BLW-004'], description: 'Annual Maintenance Contract for all Dell laptops' },
    { id: 2, contractNo: 'CON-2024-002', vendor: 'Mahindra & Mahindra', type: 'Service Agreement', startDate: '2024-06-01', endDate: '2026-05-31', value: 180000, status: 'Active', assets: ['BLW-030', 'BLW-031'], description: 'Fleet maintenance and servicing contract' },
    { id: 3, contractNo: 'CON-2023-005', vendor: 'Office Depot', type: 'Supply Contract', startDate: '2023-01-01', endDate: '2024-12-31', value: 95000, status: 'Expired', assets: [], description: 'Office supplies and consumables supply agreement' },
    { id: 4, contractNo: 'CON-2024-003', vendor: 'Cisco Systems', type: 'Support', startDate: '2024-03-15', endDate: '2027-03-14', value: 420000, status: 'Active', assets: ['BLW-041'], description: '3-year smart net total care for networking equipment' },
    { id: 5, contractNo: 'CON-2024-004', vendor: 'PowerSafe India', type: 'AMC', startDate: '2024-07-01', endDate: '2025-06-30', value: 75000, status: 'Active', assets: ['BLW-042'], description: 'UPS maintenance including battery replacement' }
];

export const mockWarranties = [
    { id: 1, assetId: 'BLW-002', assetName: 'MacBook Pro 14', vendor: 'Apple Business', type: 'AppleCare+', startDate: '2024-01-10', endDate: '2027-01-09', status: 'Active', coverage: 'Full replacement, accidental damage' },
    { id: 2, assetId: 'BLW-001', assetName: 'Dell Latitude 5520', vendor: 'Dell Enterprise', type: 'ProSupport Plus', startDate: '2023-06-15', endDate: '2026-06-14', status: 'Active', coverage: 'Next-day onsite service, accidental damage' },
    { id: 3, assetId: 'BLW-020', assetName: 'CNC Cutting Machine', vendor: 'Bosch India', type: 'Extended Warranty', startDate: '2022-08-01', endDate: '2025-07-31', status: 'Expiring Soon', coverage: 'Parts and labor, excludes consumables' },
    { id: 4, assetId: 'BLW-040', assetName: 'Dell PowerEdge Server', vendor: 'Dell Enterprise', type: 'ProSupport', startDate: '2023-11-01', endDate: '2026-10-31', status: 'Active', coverage: '24x7 support, 4-hour response' },
    { id: 5, assetId: 'BLW-012', assetName: 'Conference Table 12-Seater', vendor: 'Godrej Interio', type: 'Standard Warranty', startDate: '2022-03-01', endDate: '2024-02-28', status: 'Expired', coverage: 'Manufacturing defects only' },
    { id: 6, assetId: 'BLW-021', assetName: 'Industrial Printer XL', vendor: 'HP Enterprise', type: 'CarePack', startDate: '2024-02-01', endDate: '2027-01-31', status: 'Active', coverage: 'Onsite service, print head replacement' }
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

export const mockMaintenance = [
    { id: 1, assetId: 'BLW-004', assetName: 'Lenovo ThinkPad X1', issueType: 'Hardware Failure', priority: 'High', status: 'In Progress', reportedBy: 'Ravi Kumar', reportedDate: '2025-12-20', assignedTo: 'IT Support Team', notes: 'Screen flickering issue, replacement ordered' },
    { id: 2, assetId: 'BLW-022', assetName: 'Wood Laminating Press', issueType: 'Mechanical', priority: 'Critical', status: 'Pending Parts', reportedBy: 'Production Manager', reportedDate: '2025-12-18', assignedTo: 'Maintenance Crew', notes: 'Hydraulic pump failure, awaiting spare parts from vendor' },
    { id: 3, assetId: 'BLW-042', assetName: 'UPS 10KVA', issueType: 'Electrical', priority: 'Medium', status: 'Scheduled', reportedBy: 'Facilities', reportedDate: '2025-12-22', assignedTo: 'Vendor - PowerSafe', notes: 'Battery replacement due, scheduled for Dec 28' },
    { id: 4, assetId: 'BLW-030', assetName: 'Tata Ace Delivery Van', issueType: 'Servicing', priority: 'Low', status: 'Completed', reportedBy: 'Suresh Driver', reportedDate: '2025-12-15', assignedTo: 'Mahindra Service Center', notes: 'Regular 20,000 km service completed' },
    { id: 5, assetId: 'BLW-013', assetName: 'Filing Cabinet 4-Drawer', issueType: 'Disposal Request', priority: 'Low', status: 'Pending Approval', reportedBy: 'Admin', reportedDate: '2025-12-21', assignedTo: 'Asset Manager', notes: 'Cabinet damaged beyond repair, recommend disposal' }
];
