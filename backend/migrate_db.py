import sqlite3
import uuid
from datetime import datetime

def migrate_database():
    """
    Migrate the existing database to add note_session_id and updated_at columns
    """
    # Connect to the database
    conn = sqlite3.connect('notes.db')
    cursor = conn.cursor()
    
    try:
        # Check if note_session_id column already exists
        cursor.execute("PRAGMA table_info(notes)")
        columns = [column[1] for column in cursor.fetchall()]
        
        if 'note_session_id' not in columns:
            print("Adding note_session_id column...")
            cursor.execute("ALTER TABLE notes ADD COLUMN note_session_id TEXT")
            
            # Generate unique UUIDs for existing notes
            cursor.execute("SELECT id FROM notes")
            note_ids = cursor.fetchall()
            
            for note_id in note_ids:
                note_session_id = str(uuid.uuid4())
                cursor.execute(
                    "UPDATE notes SET note_session_id = ? WHERE id = ?", 
                    (note_session_id, note_id[0])
                )
            
            # Create a unique index on note_session_id
            cursor.execute("CREATE UNIQUE INDEX idx_note_session_id ON notes (note_session_id)")
        
        if 'updated_at' not in columns:
            print("Adding updated_at column...")
            current_time = datetime.utcnow().isoformat()
            cursor.execute(f"ALTER TABLE notes ADD COLUMN updated_at TEXT DEFAULT '{current_time}'")
            
            # Set updated_at to the same value as created_at for existing notes
            cursor.execute("UPDATE notes SET updated_at = created_at")
        
        # Commit the changes
        conn.commit()
        print("Database migration completed successfully.")
        
    except Exception as e:
        conn.rollback()
        print(f"Error during migration: {str(e)}")
    finally:
        conn.close()

if __name__ == "__main__":
    migrate_database()
