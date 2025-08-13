#!/usr/bin/env python3
"""
Local PostgreSQL setup and testing script
Use this to test PostgreSQL connection locally before deploying
"""

import os
import subprocess
import sys
from pathlib import Path

# Add the current directory to the Python path
sys.path.insert(0, str(Path(__file__).parent))

def install_postgresql():
    """Install PostgreSQL on Ubuntu/Debian"""
    print("📦 Installing PostgreSQL...")
    try:
        subprocess.run(["sudo", "apt", "update"], check=True)
        subprocess.run(["sudo", "apt", "install", "-y", "postgresql", "postgresql-contrib"], check=True)
        print("✅ PostgreSQL installed successfully!")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install PostgreSQL: {e}")
        return False

def setup_postgresql_user():
    """Setup PostgreSQL user and database"""
    print("👤 Setting up PostgreSQL user and database...")
    try:
        # Create user
        subprocess.run([
            "sudo", "-u", "postgres", "psql", "-c",
            "CREATE USER noteuser WITH PASSWORD 'notepass123';"
        ], check=False)  # Don't fail if user already exists
        
        # Create database
        subprocess.run([
            "sudo", "-u", "postgres", "psql", "-c",
            "CREATE DATABASE notedb OWNER noteuser;"
        ], check=False)  # Don't fail if database already exists
        
        # Grant privileges
        subprocess.run([
            "sudo", "-u", "postgres", "psql", "-c",
            "GRANT ALL PRIVILEGES ON DATABASE notedb TO noteuser;"
        ], check=True)
        
        print("✅ PostgreSQL user and database setup completed!")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to setup PostgreSQL: {e}")
        return False

def test_local_postgresql():
    """Test local PostgreSQL connection"""
    print("🧪 Testing local PostgreSQL connection...")
    
    # Set environment variable for local PostgreSQL
    os.environ["DATABASE_URL"] = "postgresql://noteuser:notepass123@localhost:5432/notedb"
    
    try:
        from app.database import test_database_connection
        return test_database_connection()
    except Exception as e:
        print(f"❌ Local PostgreSQL test failed: {e}")
        return False

def create_local_env():
    """Create .env.local file for PostgreSQL testing"""
    env_content = """# Local PostgreSQL configuration for testing
DATABASE_URL=postgresql://noteuser:notepass123@localhost:5432/notedb
GROQ_API_KEY=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
DEBUG=True
HOST=0.0.0.0
PORT=8000
ALLOWED_ORIGINS=*
FRONTEND_URL=http://localhost:5173
"""
    
    with open(".env.local", "w") as f:
        f.write(env_content)
    
    print("✅ Created .env.local file for PostgreSQL testing")

def main():
    """Main function"""
    print("🐘 PostgreSQL Local Setup for AI Note Summarizer")
    print("=" * 50)
    
    # Check if PostgreSQL is installed
    try:
        subprocess.run(["psql", "--version"], check=True, capture_output=True)
        print("✅ PostgreSQL is already installed")
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("❌ PostgreSQL not found. Installing...")
        if not install_postgresql():
            sys.exit(1)
    
    # Setup user and database
    if not setup_postgresql_user():
        print("⚠️  Database setup had issues, but continuing...")
    
    # Create local environment file
    create_local_env()
    
    # Test connection
    if test_local_postgresql():
        print("✅ Local PostgreSQL setup completed successfully!")
        print("\n📋 Next steps:")
        print("1. Run: export $(cat .env.local | xargs)")
        print("2. Run: python migrate.py")
        print("3. Run: python run.py")
        print("\nYour app will now use PostgreSQL instead of SQLite!")
    else:
        print("❌ Local PostgreSQL setup failed")
        print("💡 You can still deploy to Railway - it will provide PostgreSQL automatically")

if __name__ == "__main__":
    main()
