import os
from datetime import datetime
from flask import Flask, render_template, request, jsonify, redirect, url_for, flash
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase

class Base(DeclarativeBase):
    pass

db = SQLAlchemy(model_class=Base)
app = Flask(__name__)
app.secret_key = os.environ.get("FLASK_SECRET_KEY") or "a secret key"
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL")
app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
    "pool_recycle": 300,
    "pool_pre_ping": True,
}
db.init_app(app)

with app.app_context():
    import models
    db.create_all()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/save_entry', methods=['POST'])
def save_entry():
    try:
        content = request.form.get('content')
        prompt = request.form.get('prompt')
        if not content or not prompt:
            flash('Please provide both content and prompt', 'error')
            return redirect(url_for('index'))
        
        entry = models.JournalEntry(
            content=content,
            prompt=prompt,
            created_at=datetime.utcnow()
        )
        db.session.add(entry)
        db.session.commit()
        flash('Journal entry saved successfully!', 'success')
        return redirect(url_for('index'))
    except Exception as e:
        flash('Error saving entry. Please try again.', 'error')
        return redirect(url_for('index'))

@app.route('/past_entries')
def past_entries():
    entries = models.JournalEntry.query.order_by(
        models.JournalEntry.created_at.desc()
    ).all()
    return render_template('past_entries.html', entries=entries)

@app.route('/generate_prompt')
def generate_prompt():
    # Fallback prompts in case AI is unavailable
    fallback_prompts = [
        "What made you smile today?",
        "Describe a moment that surprised you today.",
        "What's something you learned about yourself today?",
        "What's a small win you had today?",
        "What's something you're looking forward to?"
    ]
    return jsonify({"prompts": fallback_prompts})
