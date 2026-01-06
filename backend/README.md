# Platinum Helms Autos - Backend API

Production-ready backend system for Platinum Helms Autos car dealership platform.

## 🚀 Features

- **Car Inventory Management**: Full CRUD operations with multi-image support
- **Lead Capture**: Financing and importation lead submissions
- **Admin Dashboard**: Secure authentication and management interface
- **Advanced Filtering**: 9+ filter parameters with optimized database queries
- **Image Storage**: Cloudinary integration for scalable image hosting
- **Security**: JWT authentication, rate limiting, input validation
- **Performance**: Strategic indexing for sub-10ms query times

## 📋 Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT + Bcrypt
- **File Storage**: Cloudinary
- **Validation**: Express-validator
- **Security**: Helmet, CORS, Rate Limiting

## 🏗️ Project Structure

```
platinum-helms-backend/
├── prisma/
│   ├── schema.prisma       # Database schema
│   ├── migrations/         # Migration history
│   └── seed.js            # Seed script
├── src/
│   ├── config/
│   │   ├── database.js    # Prisma client
│   │   ├── cloudinary.js  # Image storage
│   │   └── constants.js   # App constants
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── validation.middleware.js
│   │   ├── error.middleware.js
│   │   └── upload.middleware.js
│   ├── controllers/       # Route handlers (Step 4)
│   ├── services/
│   │   └── auth.service.js
│   ├── routes/
│   │   └── index.js
│   ├── utils/
│   │   └── helpers.js
│   ├── app.js            # Express setup
│   └── server.js         # Entry point
├── .env.example          # Environment template
├── .gitignore
├── package.json
└── README.md
```

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+ and npm 9+
- PostgreSQL 14+
- Cloudinary account (free tier works)

### 1. Clone and Install

```bash
# Clone repository
git clone <repository-url>
cd platinum-helms-backend

# Install dependencies
npm install
```

### 2. Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your values
nano .env
```

**Required Environment Variables:**

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/platinum_helms"

# JWT (generate: openssl rand -base64 32)
JWT_SECRET=your-secret-key-min-32-characters

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Server
PORT=5000
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

### 3. Database Setup

```bash
# Generate Prisma Client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed database with sample data
npm run db:seed
```

**Default Admin Credentials (CHANGE IN PRODUCTION):**
- Email: `admin@platinumhelms.com`
- Password: `Admin123!`

### 4. Start Development Server

```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

Server will start on `http://localhost:5000`

### 5. Verify Setup

```bash
# Health check
curl http://localhost:5000/health

# API welcome
curl http://localhost:5000/api/v1
```

## 📚 Database Commands

```bash
# View database in browser
npm run db:studio

# Create new migration
npm run db:migrate

# Reset database (WARNING: deletes all data)
npm run db:reset

# Re-seed database
npm run db:seed
```

## 🔒 Security Features

### Authentication
- JWT-based stateless authentication
- HTTP-only cookies for token storage
- Token expiration (7 days default)
- Password hashing with bcrypt (12 rounds)

### Input Validation
- Express-validator for all inputs
- Field whitelisting
- SQL injection prevention (Prisma parameterization)
- XSS protection

### Rate Limiting
- 100 requests per 15 minutes (general)
- 5 login attempts per 15 minutes (auth)
- IP-based tracking

### Headers
- Helmet.js security headers
- CORS configuration
- CSP policies

## 🚦 API Endpoints (Step 4)

### Public Endpoints
```
GET    /api/v1/cars              # List cars with filters
GET    /api/v1/cars/:id          # Get car details
POST   /api/v1/cars/:id/view     # Increment view count
POST   /api/v1/leads/financing   # Submit financing application
POST   /api/v1/leads/importation # Submit importation request
POST   /api/v1/contact           # Submit contact message
```

### Admin Endpoints (Protected)
```
POST   /api/v1/admin/login       # Admin login
GET    /api/v1/admin/stats       # Dashboard statistics
GET    /api/v1/admin/cars        # List all cars (including hidden)
POST   /api/v1/admin/cars        # Create new car
PUT    /api/v1/admin/cars/:id    # Update car
DELETE /api/v1/admin/cars/:id    # Delete car
POST   /api/v1/admin/cars/:id/images # Upload car images
GET    /api/v1/admin/leads       # List all leads
PATCH  /api/v1/admin/leads/:id   # Update lead status
```

## 📊 Database Schema

### Models
1. **AdminUser**: Admin authentication
2. **Car**: Vehicle inventory (20+ fields)
3. **CarImage**: Multiple images per car
4. **FinancingLead**: Auto financing applications (30+ fields)
5. **ImportationLead**: Custom importation requests
6. **ContactMessage**: General inquiries

### Performance
- 14 strategic indexes
- Expected query times: 2-10ms
- Supports 10K+ cars, 100K+ leads

See `DATABASE_DESIGN.md` for full schema documentation.

## 🧪 Testing

```bash
# Run tests (once implemented)
npm test

# Test coverage
npm run test:coverage
```

## 🚀 Deployment

### Environment Setup

```bash
# Production environment variables
NODE_ENV=production
DATABASE_URL=<production-db-url>
FRONTEND_URL=https://platinumhelms.com
JWT_SECRET=<strong-production-secret>
CLOUDINARY_CLOUD_NAME=<production-cloudinary>
# ... other production values
```

### Deployment Platforms

**Render (Recommended)**
1. Connect GitHub repository
2. Add environment variables
3. Deploy with automatic SSL

**Railway**
1. Import project
2. Add PostgreSQL addon
3. Configure environment

**AWS/DigitalOcean**
1. Set up Node.js server
2. Install PostgreSQL
3. Configure nginx reverse proxy
4. Set up SSL with Let's Encrypt

### Pre-Deployment Checklist

- [ ] Change default admin password
- [ ] Set strong JWT_SECRET
- [ ] Configure production database
- [ ] Set up Cloudinary production account
- [ ] Update CORS_ORIGINS to production domain
- [ ] Enable HTTPS
- [ ] Set NODE_ENV=production
- [ ] Test all endpoints
- [ ] Set up monitoring/logging
- [ ] Configure backups

## 🔧 Troubleshooting

### Database Connection Issues
```bash
# Test connection
npx prisma db push

# Check DATABASE_URL format
postgresql://USER:PASSWORD@HOST:PORT/DATABASE
```

### Cloudinary Upload Failures
```bash
# Verify credentials
node -e "require('./src/config/cloudinary').testCloudinaryConnection()"
```

### Port Already in Use
```bash
# Kill process on port 5000
kill -9 $(lsof -t -i:5000)

# Or use different port
PORT=5001 npm run dev
```

## 📖 Documentation

- [Database Design](./DATABASE_DESIGN.md)
- [Schema Visual](./DATABASE_SCHEMA_VISUAL.md)
- [Step 2 Summary](./STEP_2_SUMMARY.md)
- API Documentation: Coming in Step 4

## 🤝 Contributing

1. Follow existing code structure
2. Add JSDoc comments
3. Validate inputs
4. Handle errors gracefully
5. Update documentation

## 📝 License

Proprietary - Platinum Helms Autos

## 📧 Support

For issues or questions, contact: tech@platinumhelms.com

---

**Built with ❤️ for Platinum Helms Autos**
