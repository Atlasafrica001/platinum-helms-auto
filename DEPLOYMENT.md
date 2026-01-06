# 🚀 DEPLOYMENT GUIDE

Complete guide for deploying Platinum Helms Autos to production.

## 📋 PRE-DEPLOYMENT CHECKLIST

### Security
- [ ] Change default admin password
- [ ] Generate strong JWT_SECRET (min 32 chars)
- [ ] Review all environment variables
- [ ] Set NODE_ENV=production
- [ ] Configure CORS for production domain

### Testing
- [ ] Test all API endpoints
- [ ] Test all frontend pages
- [ ] Test form submissions
- [ ] Test image uploads
- [ ] Test admin dashboard
- [ ] Verify mobile responsiveness

### Documentation
- [ ] Update README with production URLs
- [ ] Document admin procedures
- [ ] Create backup procedures
- [ ] Set up monitoring

---

## 🗄️ DATABASE DEPLOYMENT

### Option 1: Render PostgreSQL (Recommended - Free Tier)

1. **Create Database**
   - Go to [render.com](https://render.com)
   - New → PostgreSQL
   - Free tier available
   - Copy **Internal Database URL**

2. **Save Connection String**
   ```
   postgresql://user:pass@host.region.render.com:5432/dbname
   ```

### Option 2: Railway PostgreSQL

1. **Create Project**
   - Go to [railway.app](https://railway.app)
   - New Project → PostgreSQL
   - Connection string auto-generated

### Option 3: Supabase

1. **Create Project**
   - Go to [supabase.com](https://supabase.com)
   - New Project
   - Get connection string from Settings → Database

---

## 🔧 BACKEND DEPLOYMENT

### Option 1: Render (Recommended)

1. **Connect Repository**
   - New → Web Service
   - Connect GitHub repository
   - Select `backend` directory

2. **Configure Build**
   ```
   Build Command: npm install && npx prisma generate
   Start Command: npm start
   ```

3. **Environment Variables**
   Add in Render dashboard:
   ```
   NODE_ENV=production
   PORT=5000
   DATABASE_URL=<your-database-url>
   JWT_SECRET=<strong-secret-32-chars>
   JWT_EXPIRES_IN=7d
   
   CLOUDINARY_CLOUD_NAME=<your-cloud>
   CLOUDINARY_API_KEY=<your-key>
   CLOUDINARY_API_SECRET=<your-secret>
   
   FRONTEND_URL=https://your-frontend.vercel.app
   CORS_ORIGINS=https://your-frontend.vercel.app
   
   WHATSAPP_CONTACT_NUMBER=+234XXXXXXXXXX
   ```

4. **Run Migrations**
   After first deploy, use Render Shell:
   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   ```

5. **Get Backend URL**
   ```
   https://your-app.onrender.com
   ```

### Option 2: Railway

1. **New Project**
   - Deploy from GitHub
   - Select repository
   - Select `backend` directory

2. **Add PostgreSQL**
   - Add Plugin → PostgreSQL
   - DATABASE_URL auto-configured

3. **Add Environment Variables**
   Same as Render (except DATABASE_URL)

4. **Deploy**
   - Automatic on git push

### Option 3: Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create your-app-name

# Add PostgreSQL
heroku addons:create heroku-postgresql:mini

# Set environment variables
heroku config:set JWT_SECRET=your-secret
heroku config:set CLOUDINARY_CLOUD_NAME=your-cloud
# ... etc

# Deploy
cd backend
git push heroku main

# Run migrations
heroku run npx prisma migrate deploy
heroku run npx prisma db seed
```

---

## 🎨 FRONTEND DEPLOYMENT

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Configure Environment**
   Create `frontend/.env.production`:
   ```
   VITE_API_BASE_URL=https://your-backend.onrender.com/api/v1
   ```

3. **Deploy**
   ```bash
   cd frontend
   vercel
   ```

4. **Add Environment Variables**
   In Vercel dashboard:
   - Settings → Environment Variables
   - Add: `VITE_API_BASE_URL`

5. **Redeploy**
   ```bash
   vercel --prod
   ```

### Option 2: Netlify

1. **Build Command**
   ```
   npm run build
   ```

2. **Publish Directory**
   ```
   dist
   ```

3. **Environment Variables**
   In Netlify dashboard:
   ```
   VITE_API_BASE_URL=https://your-backend.onrender.com/api/v1
   ```

4. **Deploy**
   - Connect GitHub repository
   - Select `frontend` directory
   - Deploy

### Option 3: Manual (AWS S3 + CloudFront)

```bash
# Build
cd frontend
npm run build

# Upload dist/ to S3
aws s3 sync dist/ s3://your-bucket/ --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
```

---

## 🔐 POST-DEPLOYMENT SECURITY

### 1. Update Admin Password

```bash
# Using API endpoint
curl -X PUT https://your-backend.com/api/v1/admin/password \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "Admin123!",
    "newPassword": "YourStrongPassword123!",
    "confirmPassword": "YourStrongPassword123!"
  }'
```

### 2. Configure CORS

Update backend environment:
```
CORS_ORIGINS=https://your-frontend.vercel.app,https://www.yourdomain.com
```

### 3. Enable HTTPS

- Render: Automatic
- Railway: Automatic
- Vercel: Automatic
- Custom: Use Let's Encrypt

### 4. Set Up Monitoring

**Render:**
- Built-in logs
- Add Sentry for errors

**Railway:**
- Built-in observability
- Add LogRocket

**Custom:**
- PM2 for process management
- Winston for logging
- Sentry for error tracking

---

## 📊 MONITORING & MAINTENANCE

### Health Checks

**Backend:**
```bash
curl https://your-backend.com/health
```

**Frontend:**
```bash
curl https://your-frontend.com
```

### Database Backups

**Render:**
- Automatic daily backups
- Manual: Download from dashboard

**Railway:**
- Manual backups via CLI
- Schedule with cron

**Supabase:**
- Automatic backups
- Point-in-time recovery

### Log Monitoring

**View Logs:**
```bash
# Render
render logs --tail

# Railway
railway logs

# Heroku
heroku logs --tail
```

### Performance Monitoring

- **Backend Response Times:** Monitor with APM tools
- **Database Queries:** Use Prisma Studio
- **Frontend Load Times:** Use Vercel Analytics
- **Error Rates:** Set up Sentry alerts

---

## 🔄 UPDATE PROCEDURES

### Backend Updates

```bash
# Local changes
git add .
git commit -m "Backend updates"
git push origin main

# Automatic deployment (Render/Railway/Vercel)
# Or manual:
render deploy
```

### Database Migrations

```bash
# Create migration locally
cd backend
npm run db:migrate

# Deploy migration to production
# Render Shell:
npx prisma migrate deploy

# Or use CLI:
DATABASE_URL=<prod-url> npx prisma migrate deploy
```

### Frontend Updates

```bash
# Local changes
git add .
git commit -m "Frontend updates"
git push origin main

# Automatic deployment
# Or manual:
vercel --prod
```

---

## 🚨 ROLLBACK PROCEDURES

### Backend Rollback

**Render:**
- Dashboard → Deploys → Rollback to previous

**Railway:**
- Dashboard → Deployments → Redeploy previous

**Manual:**
```bash
git revert HEAD
git push origin main
```

### Database Rollback

```bash
# Rollback last migration
npx prisma migrate resolve --rolled-back <migration-name>

# Restore from backup
# Use hosting provider's backup restore
```

---

## 📝 PRODUCTION URLs

After deployment, update these URLs:

**Backend API:**
```
https://platinum-helms-backend.onrender.com
```

**Frontend App:**
```
https://platinum-helms.vercel.app
```

**Admin Dashboard:**
```
https://platinum-helms.vercel.app/admin
```

---

## ✅ DEPLOYMENT VERIFICATION

### 1. Backend Tests

```bash
# Health check
curl https://your-backend.com/health

# Get cars
curl https://your-backend.com/api/v1/cars

# Admin login
curl -X POST https://your-backend.com/api/v1/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@platinumhelms.com","password":"NewPassword123!"}'
```

### 2. Frontend Tests

- [ ] Homepage loads
- [ ] Car listing displays
- [ ] Car details page works
- [ ] Forms submit successfully
- [ ] Admin login works
- [ ] Admin dashboard displays
- [ ] Mobile responsive

### 3. Integration Tests

- [ ] Frontend → Backend API calls work
- [ ] Image uploads work
- [ ] Form submissions save to database
- [ ] Admin CRUD operations work
- [ ] No CORS errors
- [ ] HTTPS working

---

## 🎉 LAUNCH CHECKLIST

### Technical
- [ ] Backend deployed and healthy
- [ ] Frontend deployed and accessible
- [ ] Database migrated and seeded
- [ ] Environment variables configured
- [ ] HTTPS enabled
- [ ] CORS configured
- [ ] Admin password changed
- [ ] Monitoring set up
- [ ] Backups configured

### Content
- [ ] Sample cars loaded
- [ ] Contact information updated
- [ ] WhatsApp number configured
- [ ] About page content finalized
- [ ] Terms & conditions added

### Marketing
- [ ] Domain configured (if custom)
- [ ] SEO metadata updated
- [ ] Social media links added
- [ ] Analytics configured
- [ ] Error tracking enabled

---

## 📞 SUPPORT

### Issues?

1. Check logs
2. Verify environment variables
3. Test API endpoints
4. Review documentation
5. Check monitoring dashboards

### Documentation

- Backend: `backend/FINAL_SUMMARY.md`
- API: `backend/STEP_4_SUMMARY.md`
- Database: `backend/DATABASE_DESIGN.md`

---

**🚀 Ready to launch!**
