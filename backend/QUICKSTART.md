# 🚀 QUICK START GUIDE

Get Platinum Helms Backend running in 5 minutes.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL 14+ installed and running
- Cloudinary account (free tier: cloudinary.com)

## Step 1: Install Dependencies (1 min)

```bash
npm install
```

## Step 2: Configure Environment (2 min)

```bash
# Copy template
cp .env.example .env

# Edit .env file with your values
nano .env
```

**Minimum required:**
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/platinum_helms"
JWT_SECRET="your-secret-key-min-32-chars"
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

## Step 3: Setup Database (1 min)

```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed with sample data (12 cars, 3 leads, 1 admin)
npm run db:seed
```

**Default Admin Credentials:**
- Email: `admin@platinumhelms.com`
- Password: `Admin123!`

## Step 4: Start Server (1 min)

```bash
# Development mode (with hot reload)
npm run dev

# Production mode
npm start
```

Server runs at: `http://localhost:5000`

## Step 5: Test API

```bash
# Health check
curl http://localhost:5000/health

# Get cars
curl http://localhost:5000/api/v1/cars

# Admin login
curl -X POST http://localhost:5000/api/v1/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@platinumhelms.com","password":"Admin123!"}'
```

## 🎉 Done!

Your backend is now running with:
- ✅ 12 sample cars
- ✅ 3 sample leads
- ✅ 1 admin user
- ✅ 33 API endpoints ready

## Next Steps

1. **View Database:** `npm run db:studio`
2. **Test Endpoints:** Use Postman or curl
3. **Read Docs:** See `STEP_4_SUMMARY.md`
4. **Integrate Frontend:** See `PROJECT_COMPLETE.md`

## Common Commands

```bash
npm run dev          # Start dev server
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Re-seed database
npm run db:reset     # Reset database (WARNING: deletes all data)
```

## Troubleshooting

**Database connection failed?**
- Check PostgreSQL is running: `sudo service postgresql status`
- Verify DATABASE_URL in .env

**Port 5000 already in use?**
- Change port: `PORT=5001 npm run dev`
- Or kill process: `kill -9 $(lsof -t -i:5000)`

**Cloudinary errors?**
- Verify credentials at cloudinary.com/console
- Test: `node -e "require('./src/config/cloudinary').testCloudinaryConnection()"`

## Support

- 📖 Full docs: `PROJECT_COMPLETE.md`
- 🔧 API docs: `STEP_4_SUMMARY.md`
- 🗄️ Database docs: `DATABASE_DESIGN.md`
