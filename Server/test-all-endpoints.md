# การทดสอบระบบ Medlab ERP ด้วยข้อมูลจำลอง

## ข้อมูลการเข้าสู่ระบบ
- **Username/Password**: `admin/password123`, `user1/password123`, `user2/password123`, `manager1/password123`
- **Roles**: 1=Admin, 2=User, 3=Manager

## API Endpoints ที่พร้อมใช้งาน

### 1. การเข้าสู่ระบบ (Authentication)
```bash
# Login as Admin
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"user_name":"admin","user_password":"password123","role":1}'

# Login as User
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"user_name":"user1","user_password":"password123","role":2}'
```

### 2. ข้อมูลสินค้า (Products)
```bash
# ดูรายการสินค้าทั้งหมด
curl http://localhost:3000/product

# ตรวจสอบจำนวนสินค้า
curl -X POST http://localhost:3000/getQuantity \
  -H "Content-Type: application/json" \
  -d '{"id":"MED001"}'

# ตรวจสอบรหัสสินค้าซ้ำ
curl -X POST http://localhost:3000/checkID \
  -H "Content-Type: application/json" \
  -d '{"id":"MED001"}'
```

### 3. การตรวจสอบระบบ (System Health)
```bash
# ตรวจสอบสถานะเซิร์ฟเวอร์
curl http://localhost:3000/health

# ทดสอบการเชื่อมต่อฐานข้อมูล
curl http://localhost:3000/test-db
```

## ข้อมูลจำลองที่สร้างขึ้น

### ผู้ใช้งาน (Users)
- **admin**: ผู้ดูแลระบบหลัก (Role: 1) - สิทธิ์เต็ม
- **user1**: พนักงานคลัง (Role: 2) - เบิก-จ่าย, เพิ่มสินค้า
- **user2**: เภสัชกรหญิง (Role: 2) - เพิ่มสินค้าเท่านั้น
- **manager1**: ผู้จัดการคลัง (Role: 3) - สิทธิ์เต็ม

### สินค้า (Products) - 10 รายการ
- **MED001**: พาราเซตามอล 500mg
- **MED002**: แอมอกซิซิลลิน 250mg
- **MED003**: ไอบูโปรเฟน 400mg
- **MED004**: ยาแก้ไอน้ำเชื่อม
- **MED005**: วิตามินซี 1000mg
- **MED006**: ยาหยอดตา
- **MED007**: ยาครีมทาผิว
- **MED008**: อินซูลิน
- **MED009**: ยาสเปรย์พ่นจมูก
- **MED010**: แคลเซียม + วิตามินดี

### คลังสินค้า (Warehouses)
- **คลังหลัก**: คลังเก็บยาหลักของโรงพยาบาล
- **คลังสำรอง**: คลังสำรองสำหรับยาพิเศษและยาฉุกเฉิน
- **คลังเย็น**: คลังเก็บยาที่ต้องควบคุมอุณหภูมิ

### ตำแหน่งเก็บ (Locations) - 10 ตำแหน่ง
- A-01, A-02, A-03, B-01, B-02 (คลังหลัก)
- S-01, S-02 (คลังสำรอง)
- C-01, C-02, C-03 (คลังเย็น)

### ล็อตสินค้า (Inventory Lots) - 17 ล็อต
- รวมสินค้าที่มีจำนวนเพียงพอ, สินค้าใกล้หมด, และสินค้าใกล้หมดอายุ
- มีการจำลองการเบิก-จ่ายแล้ว

### ประเภทสินค้า (Categories) - 10 ประเภท
- ยาปฏิชีวนะ, ยาแก้ปวด, ยาลดไข้, ยาแก้แพ้, วิตามิน
- ยาทางเดินหายใจ, ยาทางเดินอาหาร, ยาหัวใจและหลอดเลือด
- ยาต้านการอักเสบ, ยาฮอร์โมน

### หน่วยนับ (Units) - 10 หน่วย
- กล่อง, ขวด, แผง, หลอด, ซอง, แคปซูล, เม็ด, ขวดเล็ก, ขวดใหญ่, กระปุก

### ประวัติการซื้อ (Purchase Records) - 5 รายการ
### ประวัติการรับเข้า (Import Records) - 7 รายการ  
### ประวัติการเบิกจ่าย (Export Records) - 5 รายการ

## สถานะระบบ
✅ PostgreSQL Database เชื่อมต่อสำเร็จ
✅ Server รันที่ port 3000
✅ ข้อมูลจำลองโหลดเสร็จสมบูรณ์
✅ API Login ทำงานได้
✅ API Product ทำงานได้
✅ ระบบพร้อมใช้งานทุกฟีเจอร์

## การเริ่มต้นใช้งาน Frontend
1. เปิด Frontend: `cd Client && npm run dev`
2. เข้าสู่ระบบด้วย: admin/password123
3. เลือก Role: Admin (1)
4. ทดสอบฟีเจอร์ต่างๆ ในระบบ
