# Database Connection Test Commands

## Prerequisites
1. Make sure PostgreSQL is installed and running
2. Create the database: `createdb medlab`
3. Run the schema: `psql -d medlab -f schema.sql`
4. Start the server: `npm run dev` or `node server.js`

## Test Commands with curl

### 1. Health Check (Server Status)
```bash
curl -X GET http://localhost:3000/health
```
Expected response:
```json
{
  "status": "ok",
  "message": "Server is running",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### 2. Database Connection Test
```bash
curl -X GET http://localhost:3000/test-db
```
Expected response if successful:
```json
{
  "status": "success",
  "message": "PostgreSQL connection successful",
  "data": {
    "current_time": "2024-01-01T12:00:00.000Z",
    "pg_version": "PostgreSQL 14.x on x86_64..."
  }
}
```

Expected response if failed:
```json
{
  "status": "error",
  "message": "Database connection failed",
  "error": "connection refused..."
}
```

### 3. Test Product Endpoint
```bash
curl -X GET http://localhost:3000/product
```

### 4. Test User Login (POST example)
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{
    "user_name": "admin",
    "user_password": "password",
    "role": 1
  }'
```

## Quick Setup Commands

```bash
# 1. Install PostgreSQL (macOS)
brew install postgresql
brew services start postgresql

# 2. Create database and run schema
createdb medlab
psql -d medlab -f schema.sql

# 3. Install dependencies and start server
npm install
npm run dev

# 4. Test connection
curl http://localhost:3000/health
curl http://localhost:3000/test-db
```

## Troubleshooting

### Connection Refused
- Check if PostgreSQL is running: `brew services list | grep postgresql`
- Check if database exists: `psql -l | grep medlab`
- Verify server is running on port 3000

### Authentication Failed
- Check PostgreSQL user permissions
- Try connecting manually: `psql -d medlab`
- Update connection credentials in server.js

### Schema Errors
- Ensure schema.sql was run successfully
- Check tables exist: `psql -d medlab -c "\dt"`
