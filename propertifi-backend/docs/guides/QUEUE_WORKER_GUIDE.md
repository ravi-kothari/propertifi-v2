# Queue Worker Guide

## Overview

The queue worker is essential for the tiered lead assignment system. It processes:
- **Delayed notifications** for free tier users (sent after premium exclusivity window)
- **Email notifications**
- **Database notifications**
- Any other queued jobs

## Starting the Queue Worker

### Option 1: Using the Shell Script (Recommended)
```bash
./start-queue-worker.sh
```

### Option 2: Manual Command
```bash
php artisan queue:work database --queue=default --sleep=3 --tries=3 --timeout=90
```

## Monitoring the Queue

### Check pending jobs in queue
```bash
php artisan queue:monitor
```

### View jobs table
```bash
php artisan tinker --execute="echo DB::table('jobs')->count() . ' jobs pending';"
```

### Check failed jobs
```bash
php artisan queue:failed
```

### Retry failed jobs
```bash
php artisan queue:retry all
```

### Clear all jobs (use with caution)
```bash
php artisan queue:clear database
```

## How It Works

### For Tiered Lead Assignment:

1. **Lead is submitted** → System finds matching managers
2. **Premium tier managers** (Pro/Enterprise):
   - Get immediate assignment with `available_at = now()`
   - Receive instant notification (no queue)
3. **Free/Basic tier managers**:
   - Get delayed assignment with `available_at = now() + exclusivity_hours`
   - Notification is **queued** with delay
   - Queue worker will send notification when delay expires

### Example Timeline:

```
T=0:00    Lead submitted
          ├─ Premium PM: Notified immediately ✅
          └─ Free PM: Notification queued for T=24:00

T=24:00   Queue worker sends notification to Free PM ✅
```

## Production Deployment

For production, you should use a process manager like **Supervisor** to keep the queue worker running:

### Supervisor Configuration (`/etc/supervisor/conf.d/propertifi-worker.conf`):

```ini
[program:propertifi-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /path/to/propertifi-backend/artisan queue:work database --sleep=3 --tries=3 --timeout=90
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=2
redirect_stderr=true
stdout_logfile=/path/to/propertifi-backend/storage/logs/worker.log
stopwaitsecs=3600
```

Then:
```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start propertifi-worker:*
```

## Troubleshooting

### Queue worker not processing jobs
1. Check if worker is running: `ps aux | grep "queue:work"`
2. Check database connection in `.env`
3. Verify `QUEUE_CONNECTION=database` in `.env`
4. Check logs: `tail -f storage/logs/laravel.log`

### Notifications not being sent
1. Verify notification uses `implements ShouldQueue`
2. Check if jobs are in database: `select * from jobs;`
3. Check failed jobs: `php artisan queue:failed`
4. Check mail configuration in `.env`

### Jobs failing repeatedly
1. Check error in `failed_jobs` table
2. Review stack trace: `php artisan queue:failed`
3. Fix the issue and retry: `php artisan queue:retry <job-id>`

## Development vs Production

### Development (Current Setup)
- **Queue Driver**: Database
- **Worker**: Run manually with `./start-queue-worker.sh`
- **Good for**: Testing, debugging with console output

### Production (Recommended)
- **Queue Driver**: Redis (better performance)
- **Worker**: Managed by Supervisor (auto-restart, multiple workers)
- **Monitoring**: Queue monitoring tools, alerts for failed jobs

To switch to Redis for production:
```bash
# In .env
QUEUE_CONNECTION=redis

# Restart worker
php artisan queue:restart
```

## Important Notes

⚠️ **The queue worker must be running for delayed notifications to work!**

Without it:
- Free tier users won't receive notifications when their exclusivity window ends
- Any delayed/queued jobs won't be processed
- Email notifications won't be sent (if queued)

✅ **Always keep the queue worker running in development and production**
