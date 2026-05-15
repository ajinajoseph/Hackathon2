# FinanceOS — Personal Finance Analyzer

A full-stack personal finance tracker with AI-powered insights, built with **React**, **Django**, and **MySQL**.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + Tailwind CSS + Recharts |
| Backend | Django 4.2 + Django REST Framework |
| Database | MySQL / SQLite (via PyMySQL) |
| Auth | JWT (SimpleJWT) |
| Currency | Indian Rupees (₹) |
| AI | Google Gemini 1.5 |

---

## Project Structure

```
finance-analyzer/
├── frontend/          # React + Vite app
└── backend/           # Django REST API
    ├── app/
    │   ├── expenses/  # Django app (models, serializers)
    │   ├── routers/   # API views (expenses, analytics, insights)
    │   └── settings.py
    └── manage.py
```

---

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.10+
- MySQL 8+ (or use SQLite for dev)

---

### 1. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your database credentials and API keys

# Run database migrations
python manage.py makemigrations expenses
python manage.py migrate

# (Optional) Create a superuser for admin panel
python manage.py createsuperuser

# Start the server
python manage.py runserver
```

### 1.5 Authentication & User Creation
The app now uses JWT Authentication. After running migrations:
1. Create your user via the Django admin (`http://localhost:8000/admin/`) or via `createsuperuser`.
2. A default user has been seeded for testing: **Spence / spency123**.

The API will be available at **http://localhost:8000/api/**

---

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at **http://localhost:3000**

---

### 3. MySQL Setup (Optional)

By default, the app uses SQLite. To use MySQL:

1. Create the database:
```sql
CREATE DATABASE finance_analyzer CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. Update `.env`:
```env
DB_ENGINE=mysql
DB_NAME=finance_analyzer
DB_USER=your_user
DB_PASSWORD=your_password
DB_HOST=127.0.0.1
DB_PORT=3306
```

3. Run migrations:
```bash
python manage.py migrate
```

---

## API Endpoints

### Expenses
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/expenses/` | List all expenses (filterable, searchable) |
| POST | `/api/expenses/` | Create a new expense |
| GET | `/api/expenses/{id}/` | Get single expense |
| PUT | `/api/expenses/{id}/` | Update expense (Edit functionality) |
| DELETE | `/api/expenses/{id}/` | Delete expense |

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/token/` | Obtain JWT access/refresh tokens |
| POST | `/api/token/refresh/` | Refresh expired access token |

**Query params:** `category`, `date_from`, `date_to`, `min_amount`, `max_amount`, `search`, `ordering`

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/summary/` | Financial summary |
| GET | `/api/analytics/by-category/` | Spending by category |
| GET | `/api/analytics/monthly-trend/` | Monthly trend data |
| GET | `/api/analytics/daily/` | Daily spending (last 30 days) |

### AI Insights
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/insights/` | Auto-generated AI insights |
| POST | `/api/insights/chat/` | Chat with AI advisor |

---

## AI Configuration

Add at least one key to `.env`:

```env
GEMINI_API_KEY=AIza...
ANTHROPIC_API_KEY=sk-ant-...
```

If neither is set, the app uses rule-based insights as a fallback.

---

## Features

- 📊 **Dashboard** — Overview with stat cards, spending trend, category pie chart
- ➕ **Add & Edit Expenses** — Full CRUD support; update existing records easily
- 📈 **Analytics** — Line, bar, and pie charts; category breakdown table (Rupee-formatted)
- 🤖 **AI Insights** — Chat interface + auto-generated financial insights (User-aware)
- 🔒 **Secure Auth** — JWT-protected API with modern login UI
- 🗑️ **Transaction Management** — Search, sort, delete transactions
- 🌙 **Dark Theme** — Carefully crafted dark UI with custom design system

---

## Development

### Backend admin panel
Visit `http://localhost:8000/admin/` after creating a superuser.

### Running tests
```bash
cd backend
python manage.py test
```

### Building frontend for production
```bash
cd frontend
npm run build
```

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `SECRET_KEY` | dev key | Django secret key |
| `DEBUG` | `True` | Debug mode |
| `DB_ENGINE` | `sqlite` | `sqlite` or `mysql` |
| `DB_NAME` | `finance_analyzer` | MySQL database name |
| `DB_USER` | `root` | MySQL user |
| `DB_PASSWORD` | _(empty)_ | MySQL password |
| `DB_HOST` | `127.0.0.1` | MySQL host |
| `GEMINI_API_KEY` | _(empty)_ | Google Gemini API key |
| `ANTHROPIC_API_KEY` | _(empty)_ | Anthropic API key |
