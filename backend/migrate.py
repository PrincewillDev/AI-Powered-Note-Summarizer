#!/usr/bin/env python3
"""
Database migration script for production deployment
This script ensures database tables are created before starting the server
"""

import os
import sys
from pathlib import Path

# Add the current directory to the Python path
sys.path.insert(0, str(Path(__file__).parent))

def create_tables():
    """Create database tables if they don't exist"""
    try:
        from app.database import engine, Base
        import os
        
        database_url = os.getenv("DATABASE_URL", "sqlite:///./notes.db")
        if database_url.startswith("postgres://"):
            database_url = database_url.replace("postgres://", "postgresql://", 1)
        
        db_type = "PostgreSQL" if database_url.startswith("postgresql://") else "SQLite"
        print(f"Creating tables for {db_type} database...")
        
        Base.metadata.create_all(bind=engine)
        print("✅ Database tables created successfully!")
        return True
    except Exception as e:
        print(f"❌ Error creating database tables: {e}")
        if "does not exist" in str(e):
            print("💡 Ensure the PostgreSQL database exists and is accessible")
        elif "permission denied" in str(e):
            print("💡 Check database user permissions")
        elif "connection" in str(e).lower():
            print("💡 Verify database connection string and network access")
        return False

def test_database_connection():
    """Test database connection"""
    try:
        from app.database import test_database_connection
        return test_database_connection()
    except Exception as e:
        print(f"Database connection failed: {e}")
        return False

def main():
    """Main migration function"""
    print("Starting database setup...")
    
    # Test connection
    if not test_database_connection():
        print("Failed to connect to database. Exiting.")
        sys.exit(1)
    
    # Create tables
    if not create_tables():
        print("Failed to create database tables. Exiting.")
        sys.exit(1)
    
    print("Database setup completed successfully!")

if __name__ == "__main__":
    main()
