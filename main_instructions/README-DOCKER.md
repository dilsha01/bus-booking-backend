# Docker Deployment Guide for RideWay

This guide explains how to deploy the RideWay bus booking application using Docker containers.

## Prerequisites

- Docker and Docker Compose installed
- Git (to clone/manage the repo)
- (For DigitalOcean) A DigitalOcean account with App Platform access

## Local Development with Docker

### 1. Set up environment variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

Edit `.env` and set:
- `DB_PASSWORD`: A strong MySQL password
- `JWT_SECRET`: A random secret string for JWT tokens
- `FRONTEND_URL`: `http://localhost:3000` for local
- `VITE_API_URL`: `http://localhost:4000/api` for local
- `RESEND_API_KEY`: Your Resend API key for email delivery
- `EMAIL_FROM`: From-address used for verification and notification emails

### 2. Build and run all services

```bash
docker-compose up --build
```

This will:
- Start a MySQL 8.0 database on port 3306
- Build and start the backend API on port 4000
- Build and start the frontend on port 3000

### 3. Access the application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **Health check**: http://localhost:4000/

### 4. Stop services

```bash
docker-compose down
```

To remove volumes (database data):

```bash
docker-compose down -v
```

## Deployment to DigitalOcean App Platform

### Option A: Using App Platform with Dockerfiles

1. **Push your code to GitHub** (with all Docker files):
   ```bash
   git add .
   git commit -m "Add Docker configuration"
   git push origin main
   ```

2. **Create App Platform apps** for backend and frontend:
   - **Backend**:
     - Source: GitHub repo `bus-booking-backend`, branch `main`
     - Type: **Web Service** (Docker)
     - Dockerfile path: `Dockerfile`
     - HTTP Port: `4000`
     - Environment variables: `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `JWT_SECRET`, `EMAIL_USER`, `EMAIL_PASS`, `FRONTEND_URL`
   
   - **Frontend**:
     - Source: GitHub repo `bus-booking-frontend`, branch `main`
     - Type: **Web Service** (Docker)
     - Dockerfile path: `Dockerfile`
     - HTTP Port: `80`
     - Build args: `VITE_API_URL=https://<your-backend-url>/api`

3. **Create Managed MySQL Database**:
   - DigitalOcean → Databases → Create MySQL cluster
   - Note connection details and set them as backend env vars

4. **Wire URLs**:
   - Set backend `FRONTEND_URL` to your frontend DO app URL
   - Rebuild frontend with `VITE_API_URL` pointing to backend DO app URL

### Option B: Using DigitalOcean Container Registry (DOCR)

1. **Install doctl** and authenticate:
   ```bash
   doctl auth init
   ```

2. **Create a container registry**:
   ```bash
   doctl registry create rideway
   ```

3. **Build and push images**:
   ```bash
   # Backend
   cd bus-booking-backend
   docker build -t registry.digitalocean.com/busgo/backend:latest .
   docker push registry.digitalocean.com/busgo/backend:latest

   # Frontend
   cd ../bus-booking-frontend
   docker build --build-arg VITE_API_URL=https://<backend-url>/api -t registry.digitalocean.com/busgo/frontend:latest .
   docker push registry.digitalocean.com/busgo/frontend:latest
   ```

4. **Deploy from DOCR** in App Platform by selecting images from your registry.

## Environment Variables Reference

### Backend (`bus-booking-backend`)

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port | `4000` |
| `DB_HOST` | MySQL hostname | `db-mysql-...db.ondigitalocean.com` |
| `DB_PORT` | MySQL port | `25060` |
| `DB_NAME` | Database name | `bus_booking` |
| `DB_USER` | Database user | `doadmin` |
| `DB_PASSWORD` | Database password | `<from DO>` |
| `JWT_SECRET` | JWT signing secret | `<random string>` |
| `RESEND_API_KEY` | Resend API key for email delivery | `<your key>` |
| `EMAIL_FROM` | From-address for emails | `no-reply@your-domain.com` |
| `FRONTEND_URL` | Frontend URL (CORS) | `https://frontend.ondigitalocean.app` |

### Frontend (`bus-booking-frontend`)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL (build-time) | `https://backend.ondigitalocean.app/api` |

## Troubleshooting

### Backend can't connect to database

- Check `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD` are correct
- Ensure the database allows connections from your app's IP
- For DigitalOcean Managed DB, add your app to trusted sources

### Frontend shows CORS error

- Ensure backend `FRONTEND_URL` matches your actual frontend URL
- Restart backend after changing `FRONTEND_URL`

### Build fails on DigitalOcean

- Check build logs in App Platform dashboard
- Verify Dockerfile paths and build args
- Ensure `package.json` scripts are correct

## Production Best Practices

1. **Use managed database**: Don't run MySQL in a container for production
2. **Set strong secrets**: Generate random strings for `JWT_SECRET` and `DB_PASSWORD`
3. **Enable SSL**: DigitalOcean App Platform provides SSL by default
4. **Monitor logs**: Use DigitalOcean logging or external services
5. **Backup database**: Enable automated backups on managed MySQL
6. **Scale as needed**: Increase resources if traffic grows

## Local Testing with Production-like Setup

To test with a similar setup to DigitalOcean locally:

1. Use a cloud MySQL instead of the local container
2. Set `DB_HOST` to the cloud MySQL hostname
3. Rebuild and restart services

```bash
docker-compose up --build backend frontend
```

(This skips the local `db` service and uses your cloud database)
