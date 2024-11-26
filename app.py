import os
from datetime import datetime
from flask import Flask, render_template, request, jsonify, redirect, url_for, flash
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from sqlalchemy.orm import DeclarativeBase
from werkzeug.security import generate_password_hash, check_password_hash

# Initialize SQLAlchemy base class
class Base(DeclarativeBase):
    pass

# Initialize Flask app and extensions
app = Flask(__name__)
db = SQLAlchemy(model_class=Base)

# Configure app settings
app.secret_key = os.environ.get("FLASK_SECRET_KEY") or "a secret key"
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL")
app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
    "pool_recycle": 300,
    "pool_pre_ping": True,
}

# Initialize extensions
db.init_app(app)
migrate = Migrate(app, db)

# Initialize Flask-Login
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

# Template filters
@app.template_filter('nl2br')
def nl2br(value):
    if not value:
        return ''
    return value.replace('\n', '<br>\n')

# Import models and setup user loader
import models

@login_manager.user_loader
def load_user(user_id):
    return models.User.query.get(int(user_id))

# Create database tables
with app.app_context():
    db.create_all()

# Route handlers
@app.route('/')
@login_required
def index():
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        user = models.User.query.filter_by(email=email).first()
        
        if user and user.check_password(password):
            login_user(user)
            return redirect(url_for('index'))
        else:
            flash('Invalid email or password', 'danger')
    
    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        confirm_password = request.form.get('confirm_password')
        
        if password != confirm_password:
            flash('Passwords do not match', 'danger')
            return redirect(url_for('register'))
        
        if models.User.query.filter_by(email=email).first():
            flash('Email already registered', 'danger')
            return redirect(url_for('register'))
        
        user = models.User(email=email)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()
        
        flash('Registration successful! Please login.', 'success')
        return redirect(url_for('login'))
    
    return render_template('register.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))

@app.route('/save_entry', methods=['POST'])
@login_required
def save_entry():
    try:
        content = request.form.get('content')
        prompt = request.form.get('prompt')
        entry_date = request.form.get('date')
        if not content or not prompt:
            flash('Please provide both content and prompt', 'error')
            return redirect(url_for('index'))
        
        entry = models.JournalEntry(
            content=content,
            prompt=prompt,
            created_at=datetime.strptime(entry_date + ' ' + datetime.now().strftime('%H:%M:%S'), '%Y-%m-%d %H:%M:%S') if entry_date else datetime.now(),
            user_id=current_user.id
        )
        db.session.add(entry)
        db.session.commit()
        flash('Journal entry saved successfully!', 'success')
        return redirect(url_for('index'))
    except Exception as e:
        flash('Error saving entry. Please try again.', 'error')
        return redirect(url_for('index'))

@app.route('/past_entries')
@login_required
def past_entries():
    entries = models.JournalEntry.query.filter_by(user_id=current_user.id).order_by(
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
