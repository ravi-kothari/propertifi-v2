# Propertifi Docker Development Environment Guide

This guide explains how to set up and run the Propertifi application using Docker for a consistent and easy-to-manage development workflow.

## Prerequisites

- **Docker:** You must have Docker and Docker Compose installed on your system. You can download it from the [official Docker website](https://www.docker.com/products/docker-desktop).

## Quick Start

1.  **Build and Start:**
    Open a terminal at the root of the project and run the start script:
    ```bash
    cd /Users/ravi/Documents/gemini_projects/propertifi
    ./docker-start.sh
    ```
    This command will build the Docker images for the frontend and backend, start all the required services (database, cache, etc.), and then begin showing the logs from all containers.

2.  **Stop the Environment:**
    To stop all running containers, open a new terminal window (or press `Ctrl+C` in the log-tailing window) and run:
    ```bash
    ./docker-stop.sh
    ```

## Accessing Services

Once the environment is running, you can access the different services at the following URLs:

-   **Frontend (Next.js):** [http://localhost:3000](http://localhost:3000)
-   **Backend (Laravel):** [http://localhost:8001](http://localhost:8001)
-   **phpMyAdmin (Database GUI):** [http://localhost:8080](http://localhost:8080)
-   **MailHog (Email Testing):** [http://localhost:8025](http://localhost:8025)

### Database Connection

-   **From Backend (Laravel):** The backend is pre-configured to connect to the `db` service.
-   **From External Client (e.g., TablePlus, DBeaver):**
    -   **Host:** `127.0.0.1`
    -   **Port:** `33060`
    -   **User:** `propertifi`
    -   **Password:** `password`
    -   **Database:** `propertifi`

## Development Workflow

-   **Live Reloading:** Both the frontend (Next.js) and backend (Laravel) are configured with volume mounts. Any changes you make to the code on your local machine will be reflected inside the containers automatically, triggering hot-reloading for the Next.js app.
-   **Database Migrations:** Migrations and seeders are run automatically every time the backend container starts.

## Common Docker Commands

### Start the Environment
```bash
./docker-start.sh
# OR manually:
docker-compose up --build -d
```

### Stop the Environment
```bash
./docker-stop.sh
# OR manually:
docker-compose down
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Run Laravel Artisan Commands
```bash
docker-compose exec backend php artisan <command>

# Examples:
docker-compose exec backend php artisan migrate
docker-compose exec backend php artisan make:controller UserController
docker-compose exec backend php artisan cache:clear
```

### Access Container Shell
```bash
# Backend (Laravel)
docker-compose exec backend sh

# Frontend (Next.js)
docker-compose exec frontend sh

# Database
docker-compose exec db mysql -u propertifi -ppassword propertifi
```

### Rebuild Containers
```bash
# Rebuild everything
docker-compose up --build -d

# Rebuild specific service
docker-compose up --build -d backend
```

### Check Container Status
```bash
docker-compose ps
```

### Remove All Data (Fresh Start)
```bash
# Stop containers and remove volumes (⚠️ THIS DELETES ALL DATABASE DATA)
docker-compose down -v
```

## Common Troubleshooting

### "Port is already allocated" error
This means another service on your machine is using one of the ports defined in `docker-compose.yml`.

**Solutions:**
- Stop the conflicting service
- Change the port mapping in `docker-compose.yml` (e.g., change `"3000:3000"` to `"3001:3000"`)

### Backend container fails to start
Check the logs:
```bash
docker-compose logs backend
```

Common issues:
- Errors in `.env` configuration
- Problems with Composer dependencies
- Database connection issues

### Permission Errors (Backend)
If you encounter permission issues with the `storage` or `bootstrap/cache` directories:

```bash
docker-compose exec backend chown -R www-data:www-data storage bootstrap/cache
```

### Frontend hot-reload not working
Make sure you have the `CHOKIDAR_USEPOLLING=true` environment variable set in the `docker-compose.yml` file for the frontend service.

### Database connection refused
Ensure the database container is healthy:
```bash
docker-compose ps
```

If it's not healthy, check the database logs:
```bash
docker-compose logs db
```

### Container keeps restarting
Check the logs to see what's causing the restart:
```bash
docker-compose logs -f <service-name>
```

## Managing the Environment

### Viewing Logs
To view logs from all services in real-time:
```bash
docker-compose logs -f
```

To view logs for a specific service (e.g., the backend):
```bash
docker-compose logs -f backend
```

### Rebuilding Containers
If you make changes to a `Dockerfile` or an `entrypoint.sh` script, you need to rebuild the images. The `./docker-start.sh` script does this automatically with the `--build` flag. You can also run it manually:
```bash
docker-compose up --build -d
```

### Running Artisan Commands
To run a `php artisan` command, you can `exec` into the backend container:
```bash
docker-compose exec backend php artisan <your-command>
```

For example, to create a new migration:
```bash
docker-compose exec backend php artisan make:migration create_new_table
```

### Installing New Dependencies

**Backend (Composer):**
```bash
docker-compose exec backend composer require vendor/package
```

**Frontend (npm):**
```bash
docker-compose exec frontend npm install package-name
```

## Test Accounts (After Seeding)

After the database is seeded automatically on first startup, you can use these test accounts:

- **Admin:** admin@propertifi.com / password
- **Owner:** owner@propertifi.com / password
- **PM:** pm@propertifi.com / password

## Performance Tips

- **Use Docker Desktop Settings:** Allocate sufficient CPU and memory to Docker (at least 4GB RAM recommended)
- **Volume Performance:** On macOS, consider using Docker's file sharing optimization
- **Clean Up Regularly:** Remove unused containers and images to save disk space:
  ```bash
  docker system prune -a
  ```

## Comparison: Docker vs Manual Setup

| Aspect | Docker | Manual Setup |
|--------|--------|--------------|
| Setup Time | 5 minutes | 30+ minutes |
| Consistency | Same on all machines | Varies by system |
| Dependencies | Isolated | May conflict |
| Database | Auto-configured | Manual setup |
| Cleanup | One command | Manual uninstall |
| Portability | Highly portable | System-dependent |

## Next Steps

1. Start the Docker environment: `./docker-start.sh`
2. Open the frontend: [http://localhost:3000](http://localhost:3000)
3. Access the admin dashboard: [http://localhost:3000/admin](http://localhost:3000/admin)
4. Check the API: [http://localhost:8001/api/health](http://localhost:8001/api/health)
5. View database: [http://localhost:8080](http://localhost:8080)

## Support

For issues or questions:
1. Check container logs: `docker-compose logs -f`
2. Verify all containers are running: `docker-compose ps`
3. Check this guide's troubleshooting section
4. Restart the environment: `./docker-stop.sh && ./docker-start.sh`

---

Built with 🐳 Docker for seamless development
