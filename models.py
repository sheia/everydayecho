from app import db
from datetime import datetime

class JournalEntry(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    prompt = db.Column(db.String(500), nullable=False)
    mood = db.Column(db.String(50), nullable=True)  # New field for mood
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<JournalEntry {self.created_at.strftime("%Y-%m-%d")}>'
