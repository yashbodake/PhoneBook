# Phonebook Pro

A full-stack phonebook application with user authentication, built with FastAPI (Python) and Vue.js. Uses **SQLite** for storage — no external database server required.

**Live Demo:** [https://phone-book-yrap.vercel.app/](https://phone-book-yrap.vercel.app/)

## Features

- User registration and authentication
- Add, view, update, and delete contacts
- Search functionality
- Secure password storage
- Responsive UI with modern flat design
- Toast notifications, inline validation, and loading states
- Accessible forms and keyboard navigation

## Quick Start (Local)

### Prerequisites

- Python 3.12+ (recommended; Python 3.14 may cause build issues with pinned dependencies)
- A modern web browser (for the frontend)

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

The API starts at `http://localhost:8000`. On first run, SQLAlchemy creates `phonebook.db` automatically.

### Frontend

Open `frontend/index.html` in a browser, or serve it with any static file server:

```bash
cd frontend
# Example with Python:
python -m http.server 8080
```

Then open `http://localhost:8080`.

That's it — no PostgreSQL or Docker required for local development.

---

## Deployed Application

The app is deployed on **Vercel** (frontend) and **Render** (backend).

| Service | URL |
|---|---|
| Frontend | [https://phone-book-yrap.vercel.app/](https://phone-book-yrap.vercel.app/) |
| Backend API | [https://phonebook-st8l.onrender.com](https://phonebook-st8l.onrender.com) |
| API Docs | [https://phonebook-st8l.onrender.com/docs](https://phonebook-st8l.onrender.com/docs) |

Frontend `/api/*` requests are rewritten to the Render backend via `frontend/vercel.json`.

### Deploy on Vercel + Render

See [DEPLOY.md](DEPLOY.md) for the full step-by-step deployment guide.

Quick overview:

1. Deploy the backend on Render using `render.yaml`.
2. Copy the Render backend URL.
3. Replace `YOUR-RENDER-BACKEND.onrender.com` in `frontend/vercel.json` with your Render URL.
4. Deploy the frontend on Vercel with root directory `frontend`, framework preset `Other`, empty build command, and output directory `.`.

---

## Docker Deployment

### Prerequisites

- Docker
- Docker Compose

### Quick Start with Docker

1. **Navigate to the project directory**
   ```bash
   cd PhoneBook
   ```

2. **Build and start the services**
   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - Frontend: `http://localhost` (or `http://localhost:80`)
   - Backend API: `http://localhost:8000`
   - API docs: `http://localhost:8000/docs`

### Docker Services

- **frontend**: Nginx serving the Vue.js frontend
- **backend**: FastAPI application with an embedded SQLite database

The SQLite database file is stored in a Docker volume (`sqlite_data`) so data persists across container restarts.

### Environment Variables

Configured in `docker-compose.yml` (and optionally `backend/.env` for local runs):

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | SQLAlchemy connection URL | `sqlite:///./phonebook.db` |
| `SECRET_KEY` | Secret key for JWT tokens | (change in production) |
| `ALGORITHM` | JWT algorithm | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiration time | `30` |

### Building Images Manually

```bash
# Build backend
docker build -f Dockerfile -t phonebook-backend .

# Build frontend
docker build -f Dockerfile.frontend -t phonebook-frontend .
```

### Running with Docker Compose

```bash
# Start all services in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Stop and remove the SQLite volume (deletes all data)
docker-compose down -v
```

### Production Considerations

1. **Secrets Management**: Set a strong `SECRET_KEY` via environment variables or secrets
2. **SSL/TLS**: Add SSL certificates for HTTPS
3. **Reverse Proxy**: Use a dedicated reverse proxy like Traefik or Nginx
4. **Backups**: Periodically copy the SQLite database file
5. **Security**: Regular security updates and vulnerability scans

### Troubleshooting

1. **Database Issues**: Ensure the process can write to the path in `DATABASE_URL` (the directory must exist and is writable)
2. **Frontend-Backend Communication**: Check the nginx configuration or Vercel rewrites for proper API proxying
3. **Port Conflicts**: Verify that ports 80 and 8000 are free
4. **Render Build Failures**: Pin Python to 3.12.x using `backend/.python-version` to avoid issues with Python 3.14

## Tech Stack

- **Backend**: Python, FastAPI, SQLite, SQLAlchemy
- **Frontend**: Vue.js 3, Bootstrap 5, Axios, Plus Jakarta Sans
- **Authentication**: JWT tokens
- **Containerization**: Docker, Docker Compose
- **Deployment**: Vercel (frontend), Render (backend)

## API Endpoints

### Authentication
- `POST /register` - Register a new user. Requires `username`, `email`, and `password`.
- `POST /login` - Login and get JWT token. Requires `username` and `password`.

### Contacts Management
- `GET /contacts` - Get all contacts for current user (with optional search)
- `POST /contacts` - Create a new contact
- `GET /contacts/{id}` - Get a specific contact
- `PUT /contacts/{id}` - Update a contact
- `DELETE /contacts/{id}` - Delete a contact

## Environment Variables

Create a `.env` file in the backend directory (a default is already provided):

```
DATABASE_URL=sqlite:///./phonebook.db
SECRET_KEY=your-super-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

For production, generate a strong secret key, e.g.:

```bash
openssl rand -hex 32
```

## Project Structure

```
PhoneBook/
├── backend/
│   ├── main.py           # Main FastAPI application
│   ├── models.py         # Database models
│   ├── schemas.py        # Pydantic schemas
│   ├── database.py       # Database configuration (SQLite)
│   ├── utils.py          # Utility functions
│   ├── requirements.txt  # Python dependencies
│   ├── .python-version   # Python version for Render
│   ├── phonebook.db      # SQLite database (created on first run)
│   └── .env              # Environment variables
├── frontend/
│   ├── index.html        # Main HTML file
│   ├── vercel.json       # Vercel rewrite config
│   ├── src/
│   │   └── main.js       # Main Vue app entry
│   └── package.json      # Frontend dependencies
├── design-system/
│   └── phonebook-pro/
│       └── MASTER.md     # UI/UX design system
├── nginx/
│   └── nginx.conf        # Nginx configuration
├── tests/
│   └── createContacts.spec.ts  # Playwright e2e test
├── docker-compose.yml    # Docker Compose configuration
├── Dockerfile            # Backend Dockerfile
├── Dockerfile.frontend   # Frontend Dockerfile
├── database_schema.sql   # Reference SQLite schema
├── render.yaml           # Render blueprint
├── DEPLOY.md             # Deployment guide
└── README.md             # This file
```

## Security

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- Input validation on both frontend and backend
- SQL injection prevention through ORM
- Docker containers run as non-root users

## Testing

Run the Playwright e2e test (requires Playwright and the app running locally):

```bash
npx playwright test tests/createContacts.spec.ts
```

The test creates 100 contacts and verifies the full CRUD flow.

## License

MIT
