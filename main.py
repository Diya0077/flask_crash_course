from flask import Flask, render_template, request, redirect, url_for, flash, session
from flask_sqlalchemy import SQLAlchemy
import os
import sqlite3
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)

# app.secret_key = "secretkey"
# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///todo.db'
app.secret_key = os.getenv('SECRET_KEY','defaultsecret')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///instance/todo.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
app.jinja_env.globals.update(session=session)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    completed = db.Column(db.Boolean, default=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

def check_db_schema():
    """Check if database has the correct schema"""
    db_path = os.path.join(app.instance_path, 'todo.db')
    
    if not os.path.exists(db_path):
        return False
    
    try:
        # Use sqlite3 directly to check schema
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute("PRAGMA table_info(task)")
        columns = [column[1] for column in cursor.fetchall()]
        conn.close()
        
        return 'user_id' in columns
    except Exception:
        return False

def init_db():
    """Initialize the database with proper schema"""
    db_path = os.path.join(app.instance_path, 'todo.db')
    
    # Check if database exists and has correct schema
    if os.path.exists(db_path) and check_db_schema():
        print("Database schema is up to date")
        return
    
    # If database doesn't exist or has wrong schema, recreate it
    print("Setting up database with correct schema...")
    
    # Close any existing connections
    db.session.close()
    
    # Remove old database if it exists
    if os.path.exists(db_path):
        try:
            os.remove(db_path)
        except PermissionError:
            print("Warning: Could not remove old database file. Please restart the application.")
            return
    
    # Create new database
    with app.app_context():
        db.create_all()
        print("Database created successfully")

# Initialize database
init_db()

# Debug route to test navigation
@app.route('/debug')
def debug():
    return """
    <!DOCTYPE html>
    <html>
    <head>
        <title>Debug - Todo Master</title>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
        <link rel="stylesheet" href="/static/style.css">
    </head>
    <body>
        <nav class="navbar">
            <div class="nav-container">
                <a href="/" class="nav-brand">
                    <i class="fas fa-tasks"></i>
                    <span>Todo Master</span>
                </a>
                <div class="nav-menu">
                    <a href="/" class="nav-link">
                        <i class="fas fa-home"></i> Home
                    </a>
                    <a href="/logout" class="nav-link logout-btn">
                        <i class="fas fa-sign-out-alt"></i> Logout
                    </a>
                </div>
            </div>
        </nav>
        <div style="padding: 2rem; text-align: center;">
            <h1>Debug Page</h1>
            <p>If you can see "Todo Master" on the left side of the navigation above, the styling is working!</p>
            <p>Navigation should show: [📋 Todo Master] on the left, [🏠 Home] [🚪 Logout] on the right</p>
        </div>
    </body>
    </html>
    """

# Rending basic string / JSON response use this
@app.route('/')
def home():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    tasks = Task.query.filter_by(user_id=session['user_id']).all()
    return render_template('home.html', tasks=tasks, edit_task=None)

@app.route('/add_task', methods=['POST'])
def add_task():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    title = request.form['title']
    new_task = Task(title=title, user_id=session['user_id'])
    db.session.add(new_task)
    db.session.commit()
    flash("Task added!")
    return redirect(url_for('home'))

@app.route('/delete_task/<int:id>')
def delete_task(id):
    task = Task.query.get_or_404(id)
    if task.user_id != session['user_id']:
        flash("Not authorized.")
        return redirect(url_for('home'))
    db.session.delete(task)
    db.session.commit()
    flash("Task deleted!")
    return redirect(url_for('home'))

@app.route('/toggle/<int:id>')
def toggle_task(id):
    task = Task.query.get_or_404(id)
    if task.user_id != session['user_id']:
        flash("Not authorized.")
        return redirect(url_for('home'))
    task.completed = not task.completed
    db.session.commit()
    flash("Task status updated!")
    return redirect(url_for('home'))

@app.route('/edit_task/<int:id>', methods=['GET', 'POST'])
def edit_task(id):
    task = Task.query.get_or_404(id)
    if task.user_id != session['user_id']:
        flash("Not authorized.")
        return redirect(url_for('home'))
    if request.method == 'POST':
        task.title = request.form['title']
        db.session.commit()
        flash("Task updated!")
        return redirect(url_for('home'))
    tasks = Task.query.filter_by(user_id=session['user_id']).all()
    return render_template('home.html', tasks=tasks, edit_task=task)

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user = User.query.filter_by(username=username, password=password).first()
        if user:
            session['user_id'] = user.id
            flash("Login successful!")
            return redirect(url_for('home'))
        else:
            flash("Invalid credentials.")
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.pop('user_id', None)
    flash("Logged out!")
    return redirect(url_for('login'))

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        if User.query.filter_by(username=username).first():
            flash("Username already exists.")
        else:
            new_user = User(username=username, password=password)
            db.session.add(new_user)
            db.session.commit()
            flash("Registration successful! Please login.")
            return redirect(url_for('login'))
    return render_template('register.html')

if __name__ == '__main__':
    app.run(debug=False)
