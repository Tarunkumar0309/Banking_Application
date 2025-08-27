# Docker Setup and Deployment Guide

## Prerequisites Installation

### 1. Install Docker Desktop

**For Windows:**
1. Download Docker Desktop from: https://www.docker.com/products/docker-desktop/
2. Run the installer and follow the setup wizard
3. Restart your computer when prompted
4. Start Docker Desktop from the Start menu
5. Wait for Docker to fully start (you'll see the Docker icon in the system tray)

**For macOS:**
1. Download Docker Desktop from: https://www.docker.com/products/docker-desktop/
2. Drag Docker to Applications folder
3. Start Docker Desktop
4. Wait for Docker to fully start

**For Linux (Ubuntu/Debian):**
```bash
# Update package index
sudo apt-get update

# Install prerequisites
sudo apt-get install apt-transport-https ca-certificates curl gnupg lsb-release

# Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Add Docker repository
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io

# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Add user to docker group (optional, to run docker without sudo)
sudo usermod -aG docker $USER
```

### 2. Verify Docker Installation

Open a terminal/command prompt and run:
```bash
docker --version
docker-compose --version
```

You should see output similar to:
```
Docker version 20.10.x, build xxxxxxx
docker-compose version 1.29.x, build xxxxxxx
```

### 3. Test Docker

Run a simple test to ensure Docker is working:
```bash
docker run hello-world
```

## Deployment Steps

### Step 1: Navigate to Project Directory
```bash
cd Banking_Application_Files
```

### Step 2: Build and Deploy

**Option A: Using the deployment script (Recommended)**

**For Windows:**
```powershell
.\deploy.ps1
```

**For Linux/Mac:**
```bash
chmod +x deploy.sh
./deploy.sh
```

**Option B: Manual deployment**
```bash
# Build and start all services
docker-compose up --build -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f
```

### Step 3: Access the Application

Once deployment is complete, open your web browser and navigate to:
- **Main Application:** http://localhost
- **API Gateway:** http://localhost:5000

## Troubleshooting

### Docker Not Found
If you get "docker not found" error:
1. Make sure Docker Desktop is installed and running
2. Restart your terminal/command prompt
3. Restart your computer if needed

### Port Conflicts
If you get port conflicts:
1. Check if ports 80, 5000, 5001, 5002 are in use
2. Stop any existing services using these ports
3. Or modify the ports in `docker-compose.yml`

### Permission Issues (Linux)
If you get permission errors on Linux:
```bash
# Add your user to docker group
sudo usermod -aG docker $USER

# Log out and log back in, or run:
newgrp docker
```

### Memory Issues
If containers fail to start:
1. Increase Docker Desktop memory allocation (Windows/Mac)
2. Ensure you have at least 4GB available RAM
3. Restart Docker Desktop

### Build Failures
If build fails:
```bash
# Clean Docker cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache
docker-compose up -d
```

## Service Management

### View Running Services
```bash
docker-compose ps
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f frontend
docker-compose logs -f api-gateway
docker-compose logs -f account-service
docker-compose logs -f transaction-service
```

### Stop Services
```bash
docker-compose down
```

### Restart Services
```bash
docker-compose restart
```

### Update and Redeploy
```bash
# Pull latest changes and rebuild
docker-compose down
docker-compose up --build -d
```

## Application Architecture

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

## Data Persistence

The application uses Docker volumes for data persistence:
- **account-data:** Account database files
- **transaction-data:** Transaction database files

To reset data:
```bash
docker-compose down -v
docker-compose up --build -d
```

## Development Mode

For development with hot reload:
```bash
# Stop production containers
docker-compose down

# Run development server
cd banking-application/webapp
npm start
```

## Production Considerations

For production deployment:
1. Use environment variables for configuration
2. Implement SSL/TLS certificates
3. Set up proper monitoring and logging
4. Configure database backups
5. Use a reverse proxy (nginx/traefik)
6. Implement health checks
7. Set up CI/CD pipelines

## Support

If you encounter issues:
1. Check Docker Desktop is running
2. Verify all prerequisites are installed
3. Check the logs: `docker-compose logs -f`
4. Ensure ports are available
5. Restart Docker Desktop if needed
6. Clean and rebuild: `docker-compose down -v && docker-compose up --build -d`

## Next Steps

After successful deployment:
1. Access the application at http://localhost
2. Create an admin account
3. Test the banking functionality
4. Explore the admin dashboard
5. Test user account creation and transactions

