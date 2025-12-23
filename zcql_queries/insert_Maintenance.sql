START TRANSACTION;

INSERT INTO Maintenance (Maintenance_Title, Asset_ID, Due_Date, Cost, Status) VALUES ('Not Working', 'AT-00001', '2025-05-01', NULL, 'Scheduled');

COMMIT;