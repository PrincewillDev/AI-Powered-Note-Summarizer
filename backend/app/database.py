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

# Configure SQLite with more robust connection settings
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    connect_args={
        "check_same_thread": False,  # Allow access from multiple threads
        "timeout": 30,  # Increase timeout to 30 seconds (default is 5)
        "isolation_level": "IMMEDIATE"  # Better transaction isolation to avoid locking
    },
    # Add connection pool settings for better handling
    pool_pre_ping=True,    # Check connection health before using
    pool_recycle=1800,     # Recycle connections after 30 minutes
    pool_size=10,          # Reasonable pool size for SQLite
    max_overflow=5,         # Allow 5 connections beyond pool_size
    # Echo SQL for debugging (remove in production)
    echo=True
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

# Create tables
Base.metadata.create_all(bind=engine)

def get_db():
    """
    Get database session with improved error handling
    """
    db = SessionLocal()
    try:
        # Test connection before using it with proper SQLAlchemy text() function
        db.execute(text("SELECT 1"))
        yield db
    except Exception as e:
        print(f"Database connection error: {str(e)}")
        # If there's an error with the connection, close and retry
        try:
            db.close()
        except:
            pass  # Ignore errors on close
            
        # Create new session and try again
        db = SessionLocal()
        yield db
    finally:
        # Always ensure connection is properly closed
        try:
            db.close()
        except Exception as e:
            print(f"Error closing database connection: {str(e)}")
            pass
