-- Sample Data for Medlab Warehouse System

-- Clear existing data (optional)
TRUNCATE TABLE export, import, purchase, lot, product, location, warehouse, users CASCADE;

-- Reset sequences
ALTER SEQUENCE user_role_role_id_seq RESTART WITH 4;
ALTER SEQUENCE users_id_seq RESTART WITH 1;
ALTER SEQUENCE unit_unit_id_seq RESTART WITH 11;
ALTER SEQUENCE type_type_id_seq RESTART WITH 11;
ALTER SEQUENCE category_category_id_seq RESTART WITH 11;
ALTER SEQUENCE warehouse_warehouse_id_seq RESTART WITH 1;
ALTER SEQUENCE location_location_id_seq RESTART WITH 1;
ALTER SEQUENCE lot_lot_id_seq RESTART WITH 1;
ALTER SEQUENCE purchase_purchase_id_seq RESTART WITH 1;
ALTER SEQUENCE import_import_id_seq RESTART WITH 1;
ALTER SEQUENCE export_export_id_seq RESTART WITH 1;

-- Insert sample users (password: 'password123' for all)
INSERT INTO users (user_name, user_password, name, surname, role, withdraw, add_new, purchase) VALUES 
    ('admin', '$2b$10$p4h.IkB02ZW10PL61f7UGOZ9ddAFF5yHk3YC6HMuVldGm1HJmVB4e', 'ผู้ดูแลระบบ', 'หลัก', 1, true, true, true),
    ('user1', '$2b$10$p4h.IkB02ZW10PL61f7UGOZ9ddAFF5yHk3YC6HMuVldGm1HJmVB4e', 'พนักงาน', 'คลัง', 2, true, true, false),
    ('user2', '$2b$10$p4h.IkB02ZW10PL61f7UGOZ9ddAFF5yHk3YC6HMuVldGm1HJmVB4e', 'เภสัชกร', 'หญิง', 2, false, true, false),
    ('manager1', '$2b$10$p4h.IkB02ZW10PL61f7UGOZ9ddAFF5yHk3YC6HMuVldGm1HJmVB4e', 'ผู้จัดการ', 'คลัง', 3, true, true, true);

-- Insert units
INSERT INTO unit (unit_name) VALUES 
    ('กล่อง'),
    ('ขวด'),
    ('แผง'),
    ('หลอด'),
    ('ซอง'),
    ('แคปซูล'),
    ('เม็ด'),
    ('ขวดเล็ก'),
    ('ขวดใหญ่'),
    ('กระปุก');

-- Insert types
INSERT INTO type (type_name) VALUES 
    ('ยาเม็ด'),
    ('ยาน้ำ'),
    ('ยาฉีด'),
    ('ยาครีม'),
    ('ยาสเปรย์'),
    ('ยาหยอด'),
    ('ยาแคปซูล'),
    ('ยาผง'),
    ('ยาเจล'),
    ('วิตามิน');

-- Insert categories
INSERT INTO category (category_name) VALUES 
    ('ยาปฏิชีวนะ'),
    ('ยาแก้ปวด'),
    ('ยาลดไข้'),
    ('ยาแก้แพ้'),
    ('วิตามิน'),
    ('ยาทางเดินหายใจ'),
    ('ยาทางเดินอาหาร'),
    ('ยาหัวใจและหลอดเลือด'),
    ('ยาต้านการอักเสบ'),
    ('ยาฮอร์โมน');

-- Insert warehouses
INSERT INTO warehouse (warehouse_name, description) VALUES 
    ('คลังหลัก', 'คลังเก็บยาหลักของโรงพยาบาล'),
    ('คลังสำรอง', 'คลังสำรองสำหรับยาพิเศษและยาฉุกเฉิน'),
    ('คลังเย็น', 'คลังเก็บยาที่ต้องควบคุมอุณหภูมิ');

-- Insert locations
INSERT INTO location (warehouse_id, location_name, description) VALUES 
    (1, 'A-01', 'ชั้น A แถว 1'),
    (1, 'A-02', 'ชั้น A แถว 2'),
    (1, 'A-03', 'ชั้น A แถว 3'),
    (1, 'B-01', 'ชั้น B แถว 1'),
    (1, 'B-02', 'ชั้น B แถว 2'),
    (2, 'S-01', 'ชั้นสำรอง แถว 1'),
    (2, 'S-02', 'ชั้นสำรอง แถว 2'),
    (3, 'C-01', 'ตู้เย็น แถว 1'),
    (3, 'C-02', 'ตู้เย็น แถว 2'),
    (3, 'C-03', 'ตู้เย็น แถว 3');

-- Insert sample products
INSERT INTO product (id, name, low_stock, unit, type, category, detail, direction, before_date) VALUES 
    ('MED001', 'พาราเซตามอล 500mg', 50, 11, 11, 13, 'ยาลดไข้และแก้ปวด', 'รับประทานครั้งละ 1-2 เม็ด ทุก 4-6 ชั่วโมง', 30),
    ('MED002', 'แอมอกซิซิลลิน 250mg', 30, 11, 17, 11, 'ยาปฏิชีวนะ', 'รับประทานครั้งละ 1 แคปซูล วันละ 3 ครั้ง', 60),
    ('MED003', 'ไอบูโปรเฟน 400mg', 40, 13, 11, 12, 'ยาแก้ปวดและต้านการอักเสบ', 'รับประทานครั้งละ 1 เม็ด วันละ 2-3 ครั้ง', 45),
    ('MED004', 'ยาแก้ไอน้ำเชื่อม', 20, 12, 12, 16, 'ยาแก้ไอสำหรับเด็กและผู้ใหญ่', 'รับประทานครั้งละ 1 ช้อนชา วันละ 3 ครั้ง', 90),
    ('MED005', 'วิตามินซี 1000mg', 100, 11, 11, 15, 'วิตามินซีเสริมภูมิคุ้มกัน', 'รับประทานครั้งละ 1 เม็ด วันละ 1 ครั้ง', 180),
    ('MED006', 'ยาหยอดตา', 15, 18, 16, 14, 'ยาหยอดตาแก้แพ้', 'หยอดตาข้างละ 1-2 หยด วันละ 2-3 ครั้ง', 30),
    ('MED007', 'ยาครีมทาผิว', 25, 14, 14, 19, 'ครีมทาผิวแก้การอักเสบ', 'ทาบริเวณที่เป็นวันละ 2-3 ครั้ง', 120),
    ('MED008', 'อินซูลิน', 10, 12, 13, 20, 'ฮอร์โมนอินซูลินสำหรับเบาหวาน', 'ฉีดใต้ผิวหนังตามแพทย์กำหนด', 14),
    ('MED009', 'ยาสเปรย์พ่นจมูก', 30, 18, 15, 16, 'ยาสเปรย์แก้คัดจมูก', 'พ่นจมูกข้างละ 1-2 ครั้ง วันละ 2-3 ครั้ง', 60),
    ('MED010', 'แคลเซียม + วิตามินดี', 80, 11, 11, 15, 'อาหารเสริมแคลเซียมและวิตามินดี', 'รับประทานครั้งละ 1 เม็ด วันละ 1 ครั้ง', 365);

-- Insert sample lots with inventory
INSERT INTO lot (lot_number, p_id, quantity, exp_date, location_id) VALUES 
    ('LOT001-2024', 'MED001', 200, '2025-12-31', 1),
    ('LOT002-2024', 'MED001', 150, '2025-06-30', 1),
    ('LOT003-2024', 'MED002', 100, '2025-08-15', 2),
    ('LOT004-2024', 'MED002', 80, '2025-04-20', 2),
    ('LOT005-2024', 'MED003', 120, '2025-10-10', 3),
    ('LOT006-2024', 'MED004', 50, '2025-07-25', 4),
    ('LOT007-2024', 'MED004', 30, '2025-03-15', 4),
    ('LOT008-2024', 'MED005', 300, '2026-01-30', 5),
    ('LOT009-2024', 'MED006', 25, '2025-05-10', 8),
    ('LOT010-2024', 'MED007', 40, '2025-09-20', 6),
    ('LOT011-2024', 'MED008', 15, '2025-02-28', 8),
    ('LOT012-2024', 'MED009', 60, '2025-11-15', 7),
    ('LOT013-2024', 'MED010', 200, '2026-06-30', 5),
    -- Low stock items
    ('LOT014-2024', 'MED001', 20, '2025-01-15', 1),  -- Low stock
    ('LOT015-2024', 'MED002', 15, '2025-02-10', 2),  -- Low stock
    -- Near expiry items
    ('LOT016-2024', 'MED003', 45, '2025-01-30', 3),  -- Near expiry
    ('LOT017-2024', 'MED004', 25, '2025-02-15', 4);  -- Near expiry

-- Insert sample purchase records
INSERT INTO purchase (p_id, quantity, unit_price, total_price, supplier, purchase_date, created_by) VALUES 
    ('MED001', 500, 2.50, 1250.00, 'บริษัท ยาไทย จำกัด', '2024-01-15', 'admin'),
    ('MED002', 200, 8.75, 1750.00, 'บริษัท ฟาร์มา เฮลท์ จำกัด', '2024-01-20', 'manager1'),
    ('MED003', 300, 5.25, 1575.00, 'บริษัท เมดิคอล ซัพพลาย จำกัด', '2024-02-01', 'admin'),
    ('MED004', 100, 15.50, 1550.00, 'บริษัท ยาไทย จำกัด', '2024-02-10', 'manager1'),
    ('MED005', 500, 3.20, 1600.00, 'บริษัท วิตามิน พลัส จำกัด', '2024-02-15', 'admin');

-- Insert sample import records
INSERT INTO import (p_id, lot_number, quantity, exp_date, import_date, created_by) VALUES 
    ('MED001', 'LOT001-2024', 200, '2025-12-31', '2024-01-16', 'user1'),
    ('MED001', 'LOT002-2024', 150, '2025-06-30', '2024-01-16', 'user1'),
    ('MED002', 'LOT003-2024', 100, '2025-08-15', '2024-01-21', 'user1'),
    ('MED002', 'LOT004-2024', 80, '2025-04-20', '2024-01-21', 'user1'),
    ('MED003', 'LOT005-2024', 120, '2025-10-10', '2024-02-02', 'user2'),
    ('MED004', 'LOT006-2024', 50, '2025-07-25', '2024-02-11', 'user1'),
    ('MED005', 'LOT008-2024', 300, '2026-01-30', '2024-02-16', 'user2');

-- Insert sample export records
INSERT INTO export (p_id, lot_number, quantity, export_date, destination, created_by) VALUES 
    ('MED001', 'LOT001-2024', 50, '2024-03-01', 'แผนกผู้ป่วยใน', 'user1'),
    ('MED002', 'LOT003-2024', 20, '2024-03-05', 'แผนกฉุกเฉิน', 'user1'),
    ('MED003', 'LOT005-2024', 30, '2024-03-10', 'แผนกผู้ป่วยนอก', 'user2'),
    ('MED004', 'LOT006-2024', 15, '2024-03-15', 'แผนกเด็ก', 'user1'),
    ('MED005', 'LOT008-2024', 100, '2024-03-20', 'แผนกผู้ป่วยใน', 'user2');

-- Update lot quantities after exports
UPDATE lot SET quantity = quantity - 50 WHERE lot_number = 'LOT001-2024';
UPDATE lot SET quantity = quantity - 20 WHERE lot_number = 'LOT003-2024';
UPDATE lot SET quantity = quantity - 30 WHERE lot_number = 'LOT005-2024';
UPDATE lot SET quantity = quantity - 15 WHERE lot_number = 'LOT006-2024';
UPDATE lot SET quantity = quantity - 100 WHERE lot_number = 'LOT008-2024';

-- Populate purchase_detail from import and lot data to support line-item queries
-- This links each import to its purchase (by product id) and lot
INSERT INTO purchase_detail (purchase_id, lot_id, p_id, quantity, location_id)
SELECT DISTINCT p.purchase_id, l.lot_id, i.p_id, i.quantity,
       l.location_id
FROM import i
JOIN lot l ON l.lot_number = i.lot_number AND l.p_id = i.p_id
JOIN purchase p ON p.p_id = i.p_id
ON CONFLICT DO NOTHING;

-- Populate export_detail from export and lot data
INSERT INTO export_detail (export_id, lot_id, location_id, quantity)
SELECT DISTINCT e.export_id, l.lot_id, l.location_id, e.quantity
FROM export e
JOIN lot l ON l.lot_number = e.lot_number AND l.p_id = e.p_id
ON CONFLICT DO NOTHING;
