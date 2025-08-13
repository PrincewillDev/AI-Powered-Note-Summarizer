from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, UniqueConstraint, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import datetime
import os
import uuid
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get database URL from environment variables or use default SQLite
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./notes.db")

# Handle Railway PostgreSQL URL format (starts with postgres://)
if SQLALCHEMY_DATABASE_URL.startswith("postgres://"):
    SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Debug environment
DEBUG = os.getenv("DEBUG", "False").lower() in ("true", "1", "t")
print(f"Using database URL: {SQLALCHEMY_DATABASE_URL.split('@')[0] if '@' in SQLALCHEMY_DATABASE_URL else SQLALCHEMY_DATABASE_URL[:25]}...")
print(f"Database type: {'PostgreSQL' if SQLALCHEMY_DATABASE_URL.startswith('postgresql://') else 'SQLite'}")
print(f"Debug mode: {DEBUG}")

# Configure database engine based on the database type
if SQLALCHEMY_DATABASE_URL.startswith("postgresql://"):
    print("Configuring PostgreSQL engine for production...")
    # PostgreSQL configuration for production
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL,
        pool_pre_ping=True,      # Check connection health before using
        pool_recycle=300,        # Recycle connections after 5 minutes (Railway timeout)
        pool_size=5,             # Smaller pool size for Railway's connection limits
        max_overflow=10,         # Allow additional connections
        echo=DEBUG,              # Enable SQL logging only in debug mode
        connect_args={
            "options": "-c timezone=utc"  # Set timezone to UTC
        }
    )
else:
    print("Configuring SQLite engine for development...")
    # SQLite configuration for development
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL, 
        connect_args={
            "check_same_thread": False,  # Allow access from multiple threads
            "timeout": 30,               # Increase timeout to 30 seconds
            "isolation_level": "IMMEDIATE"  # Better transaction isolation
        },
        pool_pre_ping=True,    # Check connection health before using
        pool_recycle=1800,     # Recycle connections after 30 minutes
        pool_size=10,          # Reasonable pool size for SQLite
        max_overflow=5,        # Allow 5 connections beyond pool_size
        echo=DEBUG             # Enable SQL logging only in debug mode
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class Note(Base):
    __tablename__ = "notes"
    
    id = Column(Integer, primary_key=True, index=True)
    note_session_id = Column(String(36), nullable=False, unique=True, index=True)
    original_text = Column(Text, nullable=False)
    summary = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    
    __table_args__ = (UniqueConstraint('note_session_id', name='uix_note_session_id'),)
    
    def __repr__(self):
        return f"<Note(id={self.id}, note_session_id={self.note_session_id}, summary={self.summary[:30]}...)>"

# Create tables with error handling
try:
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created successfully!")
except Exception as e:
    print(f"❌ Error creating database tables: {e}")
    if "does not exist" in str(e):
        print("💡 Make sure PostgreSQL database is created and accessible")
    raise

def get_db():
    """
    Get database session with improved error handling for PostgreSQL
    """
    db = SessionLocal()
    try:
        # Test connection before using it
        if SQLALCHEMY_DATABASE_URL.startswith("postgresql://"):
            # PostgreSQL-specific connection test
            db.execute(text("SELECT version()"))
        else:
            # SQLite connection test
            db.execute(text("SELECT 1"))
        yield db
    except Exception as e:
        print(f"Database connection error: {str(e)}")
        db.rollback()  # Rollback any pending transaction
        # If there's an error with the connection, close and retry
        try:
            db.close()
        except:
            pass  # Ignore errors on close
            
        # Create new session and try again
        db = SessionLocal()
        try:
            if SQLALCHEMY_DATABASE_URL.startswith("postgresql://"):
                db.execute(text("SELECT 1"))  # Simpler test for retry
            else:
                db.execute(text("SELECT 1"))
            yield db
        except Exception as retry_error:
            print(f"Database retry failed: {retry_error}")
            raise
    finally:
        # Always ensure connection is properly closed
        try:
            db.close()
        except Exception as e:
            print(f"Error closing database connection: {str(e)}")
            pass

def test_database_connection():
    """
    Test database connection and return status
    """
    try:
        db = SessionLocal()
        if SQLALCHEMY_DATABASE_URL.startswith("postgresql://"):
            result = db.execute(text("SELECT version()"))
            version = result.fetchone()[0]
            print(f"✅ PostgreSQL connection successful: {version.split(',')[0]}")
        else:
            db.execute(text("SELECT 1"))
            print("✅ SQLite connection successful")
        db.close()
        return True
    except Exception as e:
        print(f"❌ Database connection test failed: {e}")
        return False
