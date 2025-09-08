# Medlab ERP – Inventory & Warehouse Management System

## Overview
Medlab ERP คือระบบบริหารคลังสินค้าและเวชภัณฑ์สำหรับองค์กรขนาดกลาง-ใหญ่ รองรับการจัดการสินค้า, สต็อก, การนำเข้า-ส่งออก, สิทธิ์ผู้ใช้, และประวัติการทำรายการ ออกแบบมาเพื่อความปลอดภัย, ความถูกต้องของข้อมูล และการขยายระบบในอนาคต

---

## Tech Stack

**Frontend:**
- React (Vite)
- CSS/JSX
- Chart.js (Dashboard)
- Bootstrap 4 (UI Components)

**Backend:**
- Node.js (Express)
- PostgreSQL (pg)
- JWT (Authentication)
- bcrypt (Password Hashing)

**DevOps:**
- npm scripts
- รองรับ Docker/CI (แนะนำให้เพิ่ม)

---

## Features

- User Authentication (JWT, Role-based)
- Product & Inventory Management
- Purchase, Import, Export Operations
- Warehouse & Location Management
- Real-time Stock Status (Low/Out of Stock)
- Transaction History (Purchase/Import/Export)
- Responsive UI Dashboard
- API Design ตาม RESTful Standard

---

## UI Preview

![Login Page](./PR/PR01.png)
![Dashboard](./PR/PR02.png)
![Product List](./PR/PR03.png)
![Warehouse Management](./PR/PR04.png)
![Transaction History](./PR/PR05.png)

---

## Getting Started

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/medlab-erp.git
cd medlab-erp
```

### 2. Install Dependencies

```bash
cd Client
npm install
cd ../Server
npm install
```

### 3. Setup Database

- ติดตั้ง PostgreSQL  
- สร้าง database `medlab` และ user ตามไฟล์ schema.sql  
- รันไฟล์ schema และ sample-data

```bash
psql -U postgres -d medlab -f schema.sql
psql -U postgres -d medlab -f sample-data.sql
```

### 4. Run Server & Client

```bash
# Start backend
cd Server
node server.js

# Start frontend
cd ../Client
npm run dev
```

### 5. Access Application

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend API: [http://localhost:3000](http://localhost:3000)

---

## API Endpoints

- `/login` – Auth
- `/product` – Product List
- `/addNewProduct` – Add Product
- `/purchase` – Purchase Order
- `/import` – Import Stock
- `/export` – Export Stock
- `/userList` – User Management
- ... (ดูรายละเอียดใน server.js)

---

## Example Users

| Username | Password | Role      |
|----------|----------|-----------|
| admin    | admin123 | Admin     |
| staff    | staff123 | Staff     |

---

## Strengths

- โครงสร้างแยก Client/Server ชัดเจน
- ใช้ PostgreSQL เพื่อความเร็วและความถูกต้อง
- มี JWT, bcrypt, error handling
- UI สวยงาม ใช้งานง่าย
- รองรับการขยายระบบในอนาคต

## Areas for Improvement

- เพิ่ม Unit/Integration Test
- เพิ่ม Docker/CI/CD
- Refactor backend ให้แยก controller/service
- เพิ่ม input validation และ logging

---

## License

MIT

---

**หมายเหตุ:**  
โปรเจ็คนี้พัฒนาระหว่างเรียน มีจุดที่ยังต้องปรับปรุง แต่เน้นคุณภาพและความเป็นระบบ  
พร้อมรับ feedback และพัฒนาให้ดีขึ้นในสภาพแวดล้อมจริง

---

**Contact:**  
- [your.email@example.com](mailto:your.email@example.com)  
- [LinkedIn](https://linkedin.com/in/yourprofile)

---

**ถ้า CTO/HR ต้องการดูโค้ดหรือรันจริง สามารถ clone และ setup ตามขั้นตอนด้านบนได้ทันที**
