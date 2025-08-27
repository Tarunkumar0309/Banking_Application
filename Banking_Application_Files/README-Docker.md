# Banking Application - Docker Deployment

This document provides instructions for deploying the Banking Application using Docker containers.

## Prerequisites

- Docker Desktop installed and running
- Docker Compose installed
- At least 4GB of available RAM
- Ports 80, 5000, 5001, and 5002 available

## Quick Start

### Option 1: Using Deployment Script (Recommended)

**For Windows:**
```powershell
.\deploy.ps1
```

**For Linux/Mac:**
```bash
chmod +x deploy.sh
./deploy.sh
```

### Option 2: Manual Deployment

1. **Build and start all services:**
   ```bash
   docker-compose up --build -d
   ```

2. **Check service status:**
   ```bash
   docker-compose ps
   ```

3. **View logs:**
   ```bash
   docker-compose logs -f
   ```

## Application URLs

Once deployed, the application will be available at:

- **Frontend (Angular):** http://localhost
- **API Gateway:** http://localhost:5000
- **Account Service:** http://localhost:5001
- **Transaction Service:** http://localhost:5002

## Service Architecture

```
┌─────────────┐    ┌──────────────┐    ┌─────────────────┐
│   Frontend  │───▶│ API Gateway  │───▶│ Account Service │
│  (Port 80)  │    │ (Port 5000)  │    │  (Port 5001)    │
└─────────────┘    └──────────────┘    └─────────────────┘
                           │
                           └─────────▶┌─────────────────┐
                                      │Transaction Service│
                                      │  (Port 5002)    │
                                      └─────────────────┘
```

## Docker Services

### Frontend (Angular)
- **Image:** nginx:alpine
- **Port:** 80
- **Features:** 
  - Serves the built Angular application
  - Handles client-side routing
  - Static asset caching
  - Security headers

### API Gateway
- **Image:** python:3.11-slim
- **Port:** 5000
- **Features:**
  - Routes requests to appropriate microservices
  - Handles authentication
  - Request/response logging

### Account Service
- **Image:** python:3.11-slim
- **Port:** 5001
- **Features:**
  - Account management (create, read, update, delete)
  - User authentication
  - Database persistence

### Transaction Service
- **Image:** python:3.11-slim
- **Port:** 5002
- **Features:**
  - Transaction processing (deposit, withdraw, transfer)
  - Transaction history
  - Database persistence

## Data Persistence

The application uses Docker volumes for data persistence:

- **account-data:** Stores account database files
- **transaction-data:** Stores transaction database files

## Useful Commands

### View running containers:
```bash
docker-compose ps
```

### View logs:
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f frontend
docker-compose logs -f api-gateway
docker-compose logs -f account-service
docker-compose logs -f transaction-service
```

### Stop services:
```bash
docker-compose down
```

### Restart services:
```bash
docker-compose restart
```

### Rebuild and restart:
```bash
docker-compose up --build -d
```

### Access container shell:
```bash
docker-compose exec frontend sh
docker-compose exec api-gateway bash
docker-compose exec account-service bash
docker-compose exec transaction-service bash
```

## Troubleshooting

### Port conflicts
If you get port conflicts, you can modify the ports in `docker-compose.yml`:

```yaml
ports:
  - "8080:80"  # Change 80 to 8080
```

### Memory issues
If containers fail to start due to memory constraints:
1. Increase Docker Desktop memory allocation
2. Restart Docker Desktop
3. Run `docker-compose up --build -d` again

### Database issues
If you need to reset the databases:
```bash
docker-compose down -v  # Removes volumes
docker-compose up --build -d
```

### Build issues
If you encounter build issues:
```bash
# Clean Docker cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache
docker-compose up -d
```

## Development

For development, you can run services individually:

```bash
# Build specific service
docker-compose build frontend

# Run specific service
docker-compose up frontend

# Run with hot reload (for development)
docker-compose -f docker-compose.dev.yml up
```

## Production Deployment

For production deployment, consider:

1. **Environment variables:** Use `.env` files for configuration
2. **SSL/TLS:** Add reverse proxy with SSL termination
3. **Monitoring:** Add health checks and monitoring
4. **Backup:** Implement database backup strategies
5. **Scaling:** Use Docker Swarm or Kubernetes for scaling

## Security Notes

- The application runs in development mode
- Database files are stored in Docker volumes
- Consider implementing proper SSL/TLS for production
- Review and update security headers in nginx.conf
- Implement proper authentication and authorization

## Support

If you encounter issues:

1. Check the logs: `docker-compose logs -f`
2. Verify Docker is running: `docker info`
3. Check port availability: `netstat -an | grep :80`
4. Restart Docker Desktop if needed
5. Clean and rebuild: `docker-compose down -v && docker-compose up --build -d`

