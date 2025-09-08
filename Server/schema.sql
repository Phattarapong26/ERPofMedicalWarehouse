-- PostgreSQL Database Schema for Medlab Warehouse System

-- Create database (run this separately as superuser)
-- CREATE DATABASE medlab;

-- Connect to medlab database before running the rest

-- User roles table
CREATE TABLE IF NOT EXISTS user_role (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL
);

-- Users table (renamed from 'user' to 'users' to avoid PostgreSQL reserved word)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    user_name VARCHAR(100) UNIQUE NOT NULL,
    user_password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    surname VARCHAR(100) NOT NULL,
    role INTEGER REFERENCES user_role(role_id),
    withdraw BOOLEAN DEFAULT FALSE,
    add_new BOOLEAN DEFAULT FALSE,
    purchase BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Unit table
CREATE TABLE IF NOT EXISTS unit (
    unit_id SERIAL PRIMARY KEY,
    unit_name VARCHAR(50) NOT NULL
);

-- Type table
CREATE TABLE IF NOT EXISTS type (
    type_id SERIAL PRIMARY KEY,
    type_name VARCHAR(100) NOT NULL
);

-- Category table
CREATE TABLE IF NOT EXISTS category (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL
);

-- Product table
CREATE TABLE IF NOT EXISTS product (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    low_stock INTEGER DEFAULT 0,
    unit INTEGER REFERENCES unit(unit_id),
    type INTEGER REFERENCES type(type_id),
    category INTEGER REFERENCES category(category_id),
    detail TEXT,
    direction TEXT,
    before_date INTEGER DEFAULT 30,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Warehouse table
CREATE TABLE IF NOT EXISTS warehouse (
    warehouse_id SERIAL PRIMARY KEY,
    warehouse_name VARCHAR(100) NOT NULL,
    description TEXT
);

-- Location table
CREATE TABLE IF NOT EXISTS location (
    location_id SERIAL PRIMARY KEY,
    warehouse_id INTEGER REFERENCES warehouse(warehouse_id),
    location_name VARCHAR(100) NOT NULL,
    description TEXT
);

-- Lot table
CREATE TABLE IF NOT EXISTS lot (
    lot_id SERIAL PRIMARY KEY,
    lot_number VARCHAR(100) NOT NULL,
    p_id VARCHAR(50) REFERENCES product(id),
    quantity INTEGER NOT NULL DEFAULT 0,
    exp_date DATE,
    location_id INTEGER REFERENCES location(location_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Purchase table
CREATE TABLE IF NOT EXISTS purchase (
    purchase_id SERIAL PRIMARY KEY,
    p_id VARCHAR(50) REFERENCES product(id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2),
    total_price DECIMAL(10,2),
    supplier VARCHAR(200),
    purchase_date DATE DEFAULT CURRENT_DATE,
    created_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Import table
CREATE TABLE IF NOT EXISTS import (
    import_id SERIAL PRIMARY KEY,
    p_id VARCHAR(50) REFERENCES product(id),
    lot_number VARCHAR(100) NOT NULL,
    quantity INTEGER NOT NULL,
    exp_date DATE,
    import_date DATE DEFAULT CURRENT_DATE,
    created_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Export table
CREATE TABLE IF NOT EXISTS export (
    export_id SERIAL PRIMARY KEY,
    p_id VARCHAR(50) REFERENCES product(id),
    lot_number VARCHAR(100) NOT NULL,
    quantity INTEGER NOT NULL,
    export_date DATE DEFAULT CURRENT_DATE,
    destination VARCHAR(200),
    created_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Purchase detail table (line-item records per purchase)
CREATE TABLE IF NOT EXISTS purchase_detail (
    purchase_detail_id SERIAL PRIMARY KEY,
    purchase_id INTEGER REFERENCES purchase(purchase_id) ON DELETE CASCADE,
    lot_id INTEGER REFERENCES lot(lot_id),
    p_id VARCHAR(50) REFERENCES product(id),
    quantity INTEGER NOT NULL,
    location_id INTEGER REFERENCES location(location_id)
);

-- Export detail table (line-item records per export)
CREATE TABLE IF NOT EXISTS export_detail (
    export_detail_id SERIAL PRIMARY KEY,
    export_id INTEGER REFERENCES export(export_id) ON DELETE CASCADE,
    lot_id INTEGER REFERENCES lot(lot_id),
    location_id INTEGER REFERENCES location(location_id),
    quantity INTEGER NOT NULL
);

-- Insert default data
INSERT INTO user_role (role_name) VALUES 
    ('Admin'),
    ('User'),
    ('Manager')
ON CONFLICT DO NOTHING;

INSERT INTO unit (unit_name) VALUES 
    ('กล่อง'),
    ('ขวด'),
    ('แผง'),
    ('หลอด'),
    ('ซอง')
ON CONFLICT DO NOTHING;

INSERT INTO type (type_name) VALUES 
    ('ยาเม็ด'),
    ('ยาน้ำ'),
    ('ยาฉีด'),
    ('ยาครีม'),
    ('ยาสเปรย์')
ON CONFLICT DO NOTHING;

INSERT INTO category (category_name) VALUES 
    ('ยาปฏิชีวนะ'),
    ('ยาแก้ปวด'),
    ('ยาลดไข้'),
    ('ยาแก้แพ้'),
    ('วิตามิน')
ON CONFLICT DO NOTHING;

INSERT INTO warehouse (warehouse_name, description) VALUES 
    ('คลังหลัก', 'คลังเก็บยาหลัก'),
    ('คลังสำรอง', 'คลังสำรองสำหรับยาพิเศษ')
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_username ON users(user_name);
CREATE INDEX IF NOT EXISTS idx_product_id ON product(id);
CREATE INDEX IF NOT EXISTS idx_lot_pid ON lot(p_id);
CREATE INDEX IF NOT EXISTS idx_lot_location ON lot(location_id);
CREATE INDEX IF NOT EXISTS idx_lot_expdate ON lot(exp_date);
CREATE INDEX IF NOT EXISTS idx_purchase_detail_purchase ON purchase_detail(purchase_id);
CREATE INDEX IF NOT EXISTS idx_purchase_detail_lot ON purchase_detail(lot_id);
CREATE INDEX IF NOT EXISTS idx_export_detail_export ON export_detail(export_id);
CREATE INDEX IF NOT EXISTS idx_export_detail_lot ON export_detail(lot_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for lot table
DROP TRIGGER IF EXISTS update_lot_updated_at ON lot;
CREATE TRIGGER update_lot_updated_at 
    BEFORE UPDATE ON lot 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
