/* 
  ZCQL Table Creation Script
  Copy and Paste these blocks one by one (or all together if supported) into your Catalyst ZCQL Query Pad.
*/

/* 1. ASSETS TABLE */
CREATE TABLE Assets (
    Asset_ID VarChar(50) UNIQUE,
    Item_Name VarChar(200),
    Category VarChar(100),
    Sub_Category VarChar(100),
    Brand VarChar(100),
    Model VarChar(100),
    Serial_Number VarChar(100),
    Cost Double,
    Current_Value Double,
    Purchase_Date Date,
    Vendor_Name VarChar(155),
    Location VarChar(100),
    Site VarChar(100),
    Department VarChar(100),
    Assigned_User VarChar(155),
    Status VarChar(50),
    Health_Score BigInt
);

/* 2. CONTRACTS TABLE */
CREATE TABLE Contracts (
    Contract_No VarChar(100),
    Title VarChar(200),
    Vendor VarChar(155),
    Start_Date Date,
    End_Date Date,
    Cost Double,
    Active Boolean,
    Hyperlink VarChar(500)
);

/* 3. EMPLOYEES TABLE */
CREATE TABLE Employees (
    Employee_ID VarChar(50) UNIQUE,
    Name VarChar(155),
    Email VarChar(100),
    Title VarChar(100),
    Department VarChar(100)
);

/* 4. MAINTENANCE TABLE */
CREATE TABLE Maintenance (
    Maintenance_Title VarChar(200),
    Asset_ID VarChar(50),
    Due_Date Date,
    Cost Double,
    Status VarChar(50),
    Completion_Date Date
);

/* 5. VENDORS TABLE */
CREATE TABLE Vendors (
    Name VarChar(155),
    Company VarChar(155),
    Email VarChar(100),
    Phone VarChar(50),
    Category VarChar(100)
);
