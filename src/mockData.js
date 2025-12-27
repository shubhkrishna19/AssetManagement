// Mock Asset Data - Used when API Bridge is offline
// This provides a realistic demo experience during development
// Prices are realistic Indian market values (2024)

export const mockAssets = [
    // IT Equipment - Laptops
    {
        ID: "1", Asset_ID: "BW-IT-001", Item_Name: "Dell Latitude 5540",
        Category: "IT Equipment", Status: "Assigned",
        Assigned_User: { display_value: "Shubh Krishna" },
        Purchase_Date: "2023-06-15", Cost: 78500,
        Location: "A-108", Health_Score: 92, Vendor_Name: "Dell India"
    },
    {
        ID: "2", Asset_ID: "BW-IT-002", Item_Name: "MacBook Pro 14\" M3",
        Category: "IT Equipment", Status: "Assigned",
        Assigned_User: { display_value: "Design Team" },
        Purchase_Date: "2024-01-10", Cost: 199000,
        Location: "J-18", Health_Score: 98, Vendor_Name: "Apple India"
    },
    {
        ID: "3", Asset_ID: "BW-IT-003", Item_Name: "HP EliteBook 840 G9",
        Category: "IT Equipment", Status: "Available",
        Assigned_User: null,
        Purchase_Date: "2023-09-20", Cost: 92000,
        Location: "A-108", Health_Score: 95, Vendor_Name: "HP India"
    },
    {
        ID: "4", Asset_ID: "BW-IT-004", Item_Name: "Lenovo ThinkPad X1 Carbon",
        Category: "IT Equipment", Status: "Assigned",
        Assigned_User: { display_value: "Anandini Singh" },
        Purchase_Date: "2024-03-05", Cost: 145000,
        Location: "A-108", Health_Score: 99, Vendor_Name: "Lenovo India"
    },
    // IT Equipment - Desktops & Monitors
    {
        ID: "5", Asset_ID: "BW-IT-005", Item_Name: "Dell OptiPlex 7010",
        Category: "IT Equipment", Status: "Assigned",
        Assigned_User: { display_value: "Accounts Dept" },
        Purchase_Date: "2023-04-12", Cost: 65000,
        Location: "J-18", Health_Score: 88, Vendor_Name: "Dell India"
    },
    {
        ID: "6", Asset_ID: "BW-IT-006", Item_Name: "LG UltraWide 34\" Monitor",
        Category: "IT Equipment", Status: "Assigned",
        Assigned_User: { display_value: "Design Team" },
        Purchase_Date: "2023-08-25", Cost: 48000,
        Location: "J-18", Health_Score: 94, Vendor_Name: "LG Electronics"
    },
    {
        ID: "7", Asset_ID: "BW-IT-007", Item_Name: "Dell 27\" 4K Monitor P2723QE",
        Category: "IT Equipment", Status: "Available",
        Assigned_User: null,
        Purchase_Date: "2024-02-15", Cost: 42000,
        Location: "A-108", Health_Score: 100, Vendor_Name: "Dell India"
    },
    // Printers & Peripherals
    {
        ID: "8", Asset_ID: "BW-IT-008", Item_Name: "HP LaserJet Pro MFP M428fdw",
        Category: "IT Equipment", Status: "Available",
        Assigned_User: { display_value: "Admin Office" },
        Purchase_Date: "2022-11-10", Cost: 38500,
        Location: "A-108", Health_Score: 72, Vendor_Name: "HP India"
    },
    {
        ID: "9", Asset_ID: "BW-IT-009", Item_Name: "Canon imageRUNNER 2630i",
        Category: "IT Equipment", Status: "Under Maintenance",
        Assigned_User: { display_value: "Print Room" },
        Purchase_Date: "2021-06-20", Cost: 125000,
        Location: "J-18", Health_Score: 45, Vendor_Name: "Canon India"
    },
    {
        ID: "10", Asset_ID: "BW-IT-010", Item_Name: "Logitech MX Master 3S Mouse",
        Category: "IT Equipment", Status: "Assigned",
        Assigned_User: { display_value: "Shubh Krishna" },
        Purchase_Date: "2024-01-05", Cost: 8900,
        Location: "A-108", Health_Score: 100, Vendor_Name: "Logitech"
    },
    // Networking & Infrastructure
    {
        ID: "11", Asset_ID: "BW-IT-011", Item_Name: "Cisco Catalyst 9200 Switch",
        Category: "IT Equipment", Status: "Assigned",
        Assigned_User: { display_value: "Server Room" },
        Purchase_Date: "2022-03-15", Cost: 185000,
        Location: "A-108", Health_Score: 90, Vendor_Name: "Cisco Systems"
    },
    {
        ID: "12", Asset_ID: "BW-IT-012", Item_Name: "Dell PowerEdge R750 Server",
        Category: "IT Equipment", Status: "Assigned",
        Assigned_User: { display_value: "IT Department" },
        Purchase_Date: "2023-01-20", Cost: 450000,
        Location: "A-108", Health_Score: 95, Vendor_Name: "Dell India"
    },
    {
        ID: "13", Asset_ID: "BW-IT-013", Item_Name: "APC Smart-UPS 10kVA",
        Category: "IT Equipment", Status: "Assigned",
        Assigned_User: { display_value: "Server Room" },
        Purchase_Date: "2022-08-10", Cost: 285000,
        Location: "A-108", Health_Score: 82, Vendor_Name: "APC India"
    },
    // Furniture
    {
        ID: "14", Asset_ID: "BW-FN-001", Item_Name: "Featherlite Executive Chair",
        Category: "Furniture", Status: "Assigned",
        Assigned_User: { display_value: "CEO Office" },
        Purchase_Date: "2023-02-10", Cost: 28500,
        Location: "A-108", Health_Score: 95, Vendor_Name: "Featherlite"
    },
    {
        ID: "15", Asset_ID: "BW-FN-002", Item_Name: "Godrej L-Shaped Workstation",
        Category: "Furniture", Status: "Available",
        Assigned_User: null,
        Purchase_Date: "2022-09-15", Cost: 32000,
        Location: "J-18", Health_Score: 88, Vendor_Name: "Godrej Interio"
    },
    {
        ID: "16", Asset_ID: "BW-FN-003", Item_Name: "Conference Table 12-Seater",
        Category: "Furniture", Status: "Available",
        Assigned_User: null,
        Purchase_Date: "2021-11-20", Cost: 145000,
        Location: "A-108", Health_Score: 92, Vendor_Name: "Godrej Interio"
    },
    {
        ID: "17", Asset_ID: "BW-FN-004", Item_Name: "Steel Filing Cabinet 4-Drawer",
        Category: "Furniture", Status: "Assigned",
        Assigned_User: { display_value: "HR Department" },
        Purchase_Date: "2020-06-10", Cost: 12500,
        Location: "J-18", Health_Score: 75, Vendor_Name: "Godrej Interio"
    },
    {
        ID: "18", Asset_ID: "BW-FN-005", Item_Name: "Visitor Sofa Set 3+1+1",
        Category: "Furniture", Status: "Available",
        Assigned_User: null,
        Purchase_Date: "2023-05-25", Cost: 68000,
        Location: "A-108", Health_Score: 98, Vendor_Name: "Urban Ladder"
    },
    // Machinery (Woodworking)
    {
        ID: "19", Asset_ID: "BW-MC-001", Item_Name: "CNC Wood Router 4x8",
        Category: "Machinery", Status: "Assigned",
        Assigned_User: { display_value: "Production Floor" },
        Purchase_Date: "2019-08-15", Cost: 1850000,
        Location: "Off-Site", Health_Score: 68, Vendor_Name: "Biesse India"
    },
    {
        ID: "20", Asset_ID: "BW-MC-002", Item_Name: "Edge Banding Machine Automatic",
        Category: "Machinery", Status: "Assigned",
        Assigned_User: { display_value: "Production Floor" },
        Purchase_Date: "2020-03-20", Cost: 980000,
        Location: "Off-Site", Health_Score: 72, Vendor_Name: "Homag India"
    },
    {
        ID: "21", Asset_ID: "BW-MC-003", Item_Name: "Panel Saw Sliding Table",
        Category: "Machinery", Status: "Under Maintenance",
        Assigned_User: { display_value: "Wood Workshop" },
        Purchase_Date: "2018-11-10", Cost: 450000,
        Location: "Off-Site", Health_Score: 45, Vendor_Name: "Altendorf"
    },
    {
        ID: "22", Asset_ID: "BW-MC-004", Item_Name: "Dust Collector Industrial",
        Category: "Machinery", Status: "Assigned",
        Assigned_User: { display_value: "Factory" },
        Purchase_Date: "2021-02-28", Cost: 185000,
        Location: "Off-Site", Health_Score: 85, Vendor_Name: "Nederman"
    },
    // Vehicles
    {
        ID: "23", Asset_ID: "BW-VH-001", Item_Name: "Mahindra Bolero Pikup",
        Category: "Vehicle", Status: "Assigned",
        Assigned_User: { display_value: "Logistics Team" },
        Purchase_Date: "2022-05-15", Cost: 925000,
        Location: "Off-Site", Health_Score: 78, Vendor_Name: "Mahindra"
    },
    {
        ID: "24", Asset_ID: "BW-VH-002", Item_Name: "Tata Ace Gold Delivery Van",
        Category: "Vehicle", Status: "Assigned",
        Assigned_User: { display_value: "Delivery Dept" },
        Purchase_Date: "2023-08-10", Cost: 685000,
        Location: "Off-Site", Health_Score: 92, Vendor_Name: "Tata Motors"
    },
    {
        ID: "25", Asset_ID: "BW-VH-003", Item_Name: "Toyota Innova Crysta",
        Category: "Vehicle", Status: "Assigned",
        Assigned_User: { display_value: "Management" },
        Purchase_Date: "2024-02-20", Cost: 2450000,
        Location: "A-108", Health_Score: 100, Vendor_Name: "Toyota India"
    },
    // Electronics & Appliances
    {
        ID: "26", Asset_ID: "BW-EL-001", Item_Name: "Daikin 1.5 Ton Split AC",
        Category: "Electronics", Status: "Assigned",
        Assigned_User: { display_value: "Conference Room" },
        Purchase_Date: "2023-04-05", Cost: 52000,
        Location: "A-108", Health_Score: 95, Vendor_Name: "Daikin India"
    },
    {
        ID: "27", Asset_ID: "BW-EL-002", Item_Name: "Samsung 65\" 4K Smart TV",
        Category: "Electronics", Status: "Available",
        Assigned_User: null,
        Purchase_Date: "2023-09-12", Cost: 89000,
        Location: "A-108", Health_Score: 100, Vendor_Name: "Samsung India"
    },
    {
        ID: "28", Asset_ID: "BW-EL-003", Item_Name: "Epson EB-2265U Projector",
        Category: "Electronics", Status: "Available",
        Assigned_User: null,
        Purchase_Date: "2022-07-20", Cost: 145000,
        Location: "J-18", Health_Score: 88, Vendor_Name: "Epson India"
    },
    {
        ID: "29", Asset_ID: "BW-EL-004", Item_Name: "Panasonic PABX System",
        Category: "Electronics", Status: "Assigned",
        Assigned_User: { display_value: "Reception" },
        Purchase_Date: "2021-10-15", Cost: 78000,
        Location: "A-108", Health_Score: 80, Vendor_Name: "Panasonic India"
    },
    {
        ID: "30", Asset_ID: "BW-EL-005", Item_Name: "Bose SoundLink Revolve+",
        Category: "Electronics", Status: "Assigned",
        Assigned_User: { display_value: "Conference Room" },
        Purchase_Date: "2024-01-25", Cost: 24500,
        Location: "A-108", Health_Score: 100, Vendor_Name: "Bose India"
    }
];

export const mockReservations = [
    { id: 1, assetId: 'BW-IT-002', userId: 'user1', userName: 'Priya Sharma', startDate: '2025-12-26', endDate: '2025-12-28', status: 'Approved', purpose: 'Client Presentation' },
    { id: 2, assetId: 'BW-VH-001', userId: 'user2', userName: 'Suresh Driver', startDate: '2025-12-27', endDate: '2025-12-29', status: 'Pending', purpose: 'Warehouse Delivery' },
    { id: 3, assetId: 'BW-EL-003', userId: 'user3', userName: 'Amit Patel', startDate: '2025-12-30', endDate: '2025-12-31', status: 'Approved', purpose: 'Training Session' },
    { id: 4, assetId: 'BW-IT-001', userId: 'user4', userName: 'Neha Singh', startDate: '2026-01-02', endDate: '2026-01-05', status: 'Approved', purpose: 'Remote Work Assignment' },
    { id: 5, assetId: 'BW-VH-002', userId: 'user5', userName: 'Warehouse Team', startDate: '2026-01-10', endDate: '2026-01-12', status: 'Pending', purpose: 'Inventory Delivery' }
];

export const mockContracts = [
    { id: 1, contractNo: 'CON-2024-001', vendor: 'Dell India', type: 'AMC', startDate: '2024-01-01', endDate: '2025-12-31', value: 250000, status: 'Active', assets: ['BW-IT-001', 'BW-IT-005', 'BW-IT-007'], description: 'Annual Maintenance Contract for Dell equipment' },
    { id: 2, contractNo: 'CON-2024-002', vendor: 'Mahindra Service', type: 'Service', startDate: '2024-06-01', endDate: '2026-05-31', value: 180000, status: 'Active', assets: ['BW-VH-001'], description: 'Fleet maintenance contract' },
    { id: 3, contractNo: 'CON-2024-003', vendor: 'Biesse India', type: 'AMC', startDate: '2024-01-01', endDate: '2024-12-31', value: 350000, status: 'Active', assets: ['BW-MC-001'], description: 'CNC Router maintenance and support' },
    { id: 4, contractNo: 'CON-2024-004', vendor: 'Cisco Systems', type: 'SmartNet', startDate: '2024-03-15', endDate: '2027-03-14', value: 420000, status: 'Active', assets: ['BW-IT-011'], description: '3-year support for networking' }
];

export const mockWarranties = [
    { id: 1, assetId: 'BW-IT-002', assetName: 'MacBook Pro 14"', vendor: 'Apple India', type: 'AppleCare+', startDate: '2024-01-10', endDate: '2027-01-09', status: 'Active', coverage: 'Full replacement, accidental damage' },
    { id: 2, assetId: 'BW-IT-001', assetName: 'Dell Latitude 5540', vendor: 'Dell India', type: 'ProSupport', startDate: '2023-06-15', endDate: '2026-06-14', status: 'Active', coverage: 'Next-day onsite service' },
    { id: 3, assetId: 'BW-MC-001', assetName: 'CNC Wood Router', vendor: 'Biesse India', type: 'Extended', startDate: '2019-08-15', endDate: '2025-08-14', status: 'Expiring Soon', coverage: 'Parts and labor' },
    { id: 4, assetId: 'BW-VH-003', assetName: 'Toyota Innova Crysta', vendor: 'Toyota India', type: 'Standard', startDate: '2024-02-20', endDate: '2027-02-19', status: 'Active', coverage: '3-year warranty' }
];

export const mockStats = {
    totalAssets: mockAssets.length,
    totalValue: mockAssets.reduce((sum, a) => sum + a.Cost, 0),
    assigned: mockAssets.filter(a => a.Status === "Assigned").length,
    available: mockAssets.filter(a => a.Status === "Available").length,
    maintenance: mockAssets.filter(a => a.Status === "Under Maintenance").length,
    avgHealth: Math.round(mockAssets.reduce((sum, a) => sum + a.Health_Score, 0) / mockAssets.length),
    categoryData: [
        { name: 'IT Equipment', value: 13, color: '#1a4f8b' },
        { name: 'Furniture', value: 5, color: '#00b894' },
        { name: 'Machinery', value: 4, color: '#e17055' },
        { name: 'Vehicle', value: 3, color: '#fdcb6e' },
        { name: 'Electronics', value: 5, color: '#6c5ce7' },
    ],
    healthData: [
        { name: 'Excellent (90+)', value: 15, color: '#00b894' },
        { name: 'Good (70-89)', value: 10, color: '#0984e3' },
        { name: 'Fair (50-69)', value: 3, color: '#fdcb6e' },
        { name: 'Poor (<50)', value: 2, color: '#e74c3c' },
    ],
    trendData: [
        { month: 'Jul', value: 5200000 },
        { month: 'Aug', value: 5800000 },
        { month: 'Sep', value: 6200000 },
        { month: 'Oct', value: 7100000 },
        { month: 'Nov', value: 7800000 },
        { month: 'Dec', value: 8543500 },
    ]
};

export const mockConsumables = [
    { id: 1, name: 'Printer Paper A4 (500 sheets)', category: 'Office', quantity: 45, threshold: 10, unit: 'Reams', cost: 320, status: 'In Stock' },
    { id: 2, name: 'HP 12A Toner Cartridge', category: 'IT', quantity: 3, threshold: 5, unit: 'Pcs', cost: 2800, status: 'Low Stock' },
    { id: 3, name: 'HDMI Cable 2m', category: 'IT', quantity: 12, threshold: 3, unit: 'Pcs', cost: 450, status: 'In Stock' },
    { id: 4, name: 'Sanitizer 500ml', category: 'Health', quantity: 8, threshold: 5, unit: 'Bottles', cost: 180, status: 'In Stock' },
    { id: 5, name: 'Coffee Beans Premium', category: 'Pantry', quantity: 2, threshold: 3, unit: 'Kg', cost: 850, status: 'Low Stock' },
    { id: 6, name: 'Sticky Notes (Pack of 12)', category: 'Office', quantity: 0, threshold: 5, unit: 'Packs', cost: 280, status: 'Out of Stock' }
];

export const mockVendors = [
    { id: 1, name: 'Dell India', type: 'Hardware', contact: 'Rajesh Kumar', email: 'enterprise@dell.co.in', phone: '1800-425-3355', rating: 4.5, status: 'Preferred' },
    { id: 2, name: 'Godrej Interio', type: 'Furniture', contact: 'Anita Desai', email: 'b2b@godrejinterio.com', phone: '1800-267-6766', rating: 4.2, status: 'Active' },
    { id: 3, name: 'Biesse India', type: 'Machinery', contact: 'Marco Rossi', email: 'service@biesse.in', phone: '+91-80-4669', rating: 4.8, status: 'Preferred' },
    { id: 4, name: 'Apple India', type: 'Hardware', contact: 'Enterprise Sales', email: 'business@apple.in', phone: '000-800-040-1966', rating: 5.0, status: 'Preferred' },
    { id: 5, name: 'Mahindra Service', type: 'Vehicles', contact: 'Service Center', email: 'fleet@mahindra.com', phone: '1800-209-6006', rating: 4.3, status: 'Active' }
];

export const mockMaintenance = [
    { id: 1, assetId: 'BW-IT-009', assetName: 'Canon imageRUNNER 2630i', issueType: 'Paper Jam Frequent', priority: 'Medium', status: 'In Progress', reportedBy: 'Admin Staff', reportedDate: '2025-12-20', assignedTo: 'Canon Service', notes: 'Roller replacement scheduled' },
    { id: 2, assetId: 'BW-MC-003', assetName: 'Panel Saw Sliding Table', issueType: 'Motor Issue', priority: 'High', status: 'Pending Parts', reportedBy: 'Production Manager', reportedDate: '2025-12-18', assignedTo: 'Altendorf Service', notes: 'Waiting for motor from Germany' },
    { id: 3, assetId: 'BW-IT-013', assetName: 'APC Smart-UPS 10kVA', issueType: 'Battery Replacement', priority: 'Medium', status: 'Scheduled', reportedBy: 'IT Team', reportedDate: '2025-12-22', assignedTo: 'APC Service', notes: 'Battery pack ordered, replacement on Dec 30' },
    { id: 4, assetId: 'BW-VH-001', assetName: 'Mahindra Bolero Pikup', issueType: 'Regular Service', priority: 'Low', status: 'Completed', reportedBy: 'Driver', reportedDate: '2025-12-15', assignedTo: 'Mahindra Service', notes: '25,000 km service completed' }
];
