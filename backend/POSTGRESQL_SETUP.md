# 🐘 PostgreSQL Setup Guide for AI Note Summarizer

## Overview

The backend is now configured to work with both SQLite (development) and PostgreSQL (production). It automatically detects the database type based on the `DATABASE_URL` environment variable.

## ✅ Current Configuration

### **Database Support**
- ✅ **SQLite** - Development (default)
- ✅ **PostgreSQL** - Production (Railway)
- ✅ **Auto-detection** based on `DATABASE_URL`
- ✅ **Connection pooling** optimized for each database type
- ✅ **Error handling** with detailed feedback

### **Files Updated**
- ✅ `app/database.py` - Enhanced PostgreSQL support
- ✅ `migrate.py` - Better migration handling  
- ✅ `requirements.txt` - Added `psycopg2-binary`
- ✅ `.env.production` - PostgreSQL connection examples
- ✅ `setup_postgresql.py` - Local PostgreSQL setup script

## 🚀 Railway Deployment (Recommended)

### **Step 1: Deploy to Railway**
```bash
cd backend
./deploy-railway.sh
```

### **Step 2: Add PostgreSQL Database**
1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Select your project
3. Click **"New"** → **"Database"** → **"Add PostgreSQL"**
4. Railway automatically sets `DATABASE_URL` environment variable
5. Format: `postgresql://username:password@host:port/database_name`

### **Step 3: Configure Environment Variables**
In Railway Dashboard → Variables:
```env
GROQ_API_KEY=your_actual_groq_api_key_here
DEBUG=False
FRONTEND_URL=https://your-vercel-app.vercel.app
ALLOWED_ORIGINS=https://your-vercel-app.vercel.app
```

**Note**: `DATABASE_URL` is automatically set by Railway PostgreSQL addon.

### **Step 4: Verify Deployment**
```bash
curl https://your-app.railway.app/health
curl https://your-app.railway.app/notes
```

## 🧪 Local PostgreSQL Testing (Optional)

If you want to test PostgreSQL locally before deploying:

### **Option A: Automated Setup**
```bash
cd backend
./setup_postgresql.py
export $(cat .env.local | xargs)
python migrate.py
python run.py
```

### **Option B: Manual Setup**
```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Create user and database
sudo -u postgres psql -c "CREATE USER noteuser WITH PASSWORD 'notepass123';"
sudo -u postgres psql -c "CREATE DATABASE notedb OWNER noteuser;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE notedb TO noteuser;"

# Set environment variable
export DATABASE_URL=postgresql://noteuser:notepass123@localhost:5432/notedb

# Run migration
python migrate.py
```

## 🔧 Database Configuration Details

### **Connection String Formats**

**Railway PostgreSQL** (Auto-provided):
```
postgresql://username:password@containers-us-west-12.railway.app:5432/railway
```

**Local PostgreSQL**:
```
postgresql://noteuser:notepass123@localhost:5432/notedb
```

**SQLite** (Default):
```
sqlite:///./notes.db
```

### **Auto-Detection Logic**

The system automatically:
1. ✅ **Detects database type** from `DATABASE_URL`
2. ✅ **Converts** `postgres://` to `postgresql://` (Railway format)
3. ✅ **Configures connection pooling** appropriately
4. ✅ **Sets logging level** based on debug mode
5. ✅ **Handles timezone** settings for PostgreSQL

### **Connection Pool Settings**

**PostgreSQL (Production)**:
- Pool size: 5 connections
- Max overflow: 10 connections  
- Pool recycle: 300 seconds (5 minutes)
- Pre-ping: Enabled
- Timezone: UTC

**SQLite (Development)**:
- Pool size: 10 connections
- Max overflow: 5 connections
- Pool recycle: 1800 seconds (30 minutes)
- Thread safety: Disabled check_same_thread
- Timeout: 30 seconds

## 🛠️ Troubleshooting

### **Common Issues**

1. **"database does not exist"**
   ```
   Solution: Ensure PostgreSQL addon is added in Railway
   ```

2. **"permission denied for database"**
   ```
   Solution: Check DATABASE_URL format and credentials
   ```

3. **"connection refused"**
   ```
   Solution: Verify PostgreSQL service is running
   ```

4. **"too many connections"**
   ```
   Solution: Connection pool is configured for Railway limits
   ```

### **Debug Steps**

1. **Check Database URL**:
   ```bash
   echo $DATABASE_URL
   ```

2. **Test Connection**:
   ```bash
   python migrate.py
   ```

3. **View Logs**:
   ```bash
   # Railway logs
   railway logs

   # Local logs  
   python run.py
   ```

## ✅ Production Checklist

- [ ] **PostgreSQL addon** added to Railway project
- [ ] **DATABASE_URL** automatically set by Railway
- [ ] **Migration script** runs successfully
- [ ] **Health endpoint** returns database info
- [ ] **API endpoints** working with PostgreSQL
- [ ] **Connection pooling** configured appropriately

## 📊 Database Schema

```sql
CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    note_session_id VARCHAR(36) UNIQUE NOT NULL,
    original_text TEXT NOT NULL,
    summary TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notes_session_id ON notes(note_session_id);
CREATE INDEX idx_notes_created_at ON notes(created_at);
```

## 🎯 Ready for Production!

Your backend now supports:
- 🐘 **PostgreSQL** for Railway production deployment
- 📦 **SQLite** for local development  
- 🔄 **Automatic database detection**
- 🏊 **Optimized connection pooling**
- 🧪 **Comprehensive testing and migration**
- 📊 **Health monitoring with database info**

The database configuration is **production-ready** for Railway deployment with PostgreSQL!
