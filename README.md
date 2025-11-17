# Phonebook Application

A full-stack phonebook application with user authentication, built with FastAPI (Python) and Vue.js.

## Features

- User registration and authentication
- Add, view, update, and delete contacts
- Search functionality
- Secure password storage
- Responsive UI

## Docker Deployment

The application can be easily deployed using Docker and Docker Compose.

### Prerequisites

- Docker
- Docker Compose

### Quick Start with Docker

1. **Clone or copy the repository**

2. **Navigate to the project directory**
   ```bash
   cd phonebook_app
   ```

3. **Build and start the services**
   ```bash
   docker-compose up -d
   ```

4. **Access the application**
   - Frontend: `http://localhost` (or `http://localhost:80`)
   - Backend API: `http://localhost:8000`
   - Database: `http://localhost:5432`

### Docker Services

The application consists of the following services:

- **frontend**: Nginx server serving the Vue.js frontend
- **backend**: FastAPI application server 
- **db**: PostgreSQL database

### Docker Configuration

#### Backend Service (FastAPI)
- Built from Python 3.11-slim
- Runs on port 8000
- Environment variables configured in docker-compose.yml

#### Frontend Service (Vue.js + Nginx)
- Built with Node.js
- Served by Nginx on port 80
- Proxies API requests to the backend

#### Database Service (PostgreSQL)
- PostgreSQL 15-alpine image
- Persistent data storage using volumes
- Preconfigured database, user, and password

### Environment Variables

The following environment variables can be configured in `docker-compose.yml`:

- `DATABASE_URL`: Connection string for PostgreSQL
- `SECRET_KEY`: Secret key for JWT tokens
- `ALGORITHM`: JWT algorithm (default: HS256)
- `ACCESS_TOKEN_EXPIRE_MINUTES`: Token expiration time

### Customization

To customize the application:

1. **Environment Variables**: Modify the environment variables in `docker-compose.yml`
2. **Database**: Update credentials in both `docker-compose.yml` and `.env` (for local development)
3. **Ports**: Change exposed ports in `docker-compose.yml` if needed

### Building Images Manually

To build the images manually:

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

# Stop and remove volumes
docker-compose down -v
```

### Development with Docker

For local development:

```bash
# Start database only
docker-compose up -d db

# Run backend locally (with database in Docker)
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Production Considerations

For production deployment, consider:

1. **Secrets Management**: Use Docker secrets or external secrets management
2. **SSL/TLS**: Add SSL certificates for HTTPS
3. **Reverse Proxy**: Use a dedicated reverse proxy like Traefik or Nginx
4. **Monitoring**: Add monitoring and logging solutions
5. **Backup**: Set up database backup procedures
6. **Security**: Regular security updates and vulnerability scans

### Troubleshooting

1. **Database Connection Issues**: Ensure the database service is running and accessible
2. **Frontend-Backend Communication**: Check the nginx configuration for proper API proxying
3. **Port Conflicts**: Verify that required ports are not used by other applications

## Tech Stack

- **Backend**: Python, FastAPI, PostgreSQL, SQLAlchemy
- **Frontend**: Vue.js 3, Bootstrap 5, Axios
- **Authentication**: JWT tokens
- **Containerization**: Docker, Docker Compose

## Manual Local Setup (Alternative)

If you prefer to run locally without Docker:

### Backend Setup

1. Make sure you have Python 3.8+ installed
2. Install PostgreSQL and create a database named "phonebook"
3. Navigate to the `backend` directory
4. Install dependencies: `pip install -r requirements.txt`
5. Set up environment variables in `.env` file
6. Run the application: `uvicorn main:app --reload`

### Frontend Setup

1. Navigate to the `frontend` directory
2. Install dependencies: `npm install` (if using npm) or use the HTML directly
3. Open `index.html` in a browser or serve with a local server

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

Create a `.env` file in the backend directory:

```
DATABASE_URL=postgresql://username:password@localhost/phonebook
SECRET_KEY=your-super-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## Project Structure

```
phonebook_app/
├── backend/
│   ├── main.py           # Main FastAPI application
│   ├── models.py         # Database models
│   ├── schemas.py        # Pydantic schemas
│   ├── database.py       # Database configuration
│   ├── utils.py          # Utility functions
│   ├── requirements.txt  # Python dependencies
│   └── .env             # Environment variables
├── frontend/
│   ├── index.html        # Main HTML file
│   ├── src/
│   │   ├── main.js       # Main Vue app entry
│   │   └── components/   # Vue components
│   └── package.json      # Frontend dependencies
├── nginx/
│   └── nginx.conf        # Nginx configuration
├── docker-compose.yml    # Docker Compose configuration
├── Dockerfile            # Backend Dockerfile
├── Dockerfile.frontend   # Frontend Dockerfile
├── init.sql              # Database initialization
├── .dockerignore         # Docker ignore file
└── README.md             # This file
```

## Security

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- Input validation on both frontend and backend
- SQL injection prevention through ORM
- Docker containers run as non-root users