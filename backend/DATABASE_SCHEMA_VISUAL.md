# Database Schema Visual Documentation

## Entity Relationship Diagram (Text Format)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          PLATINUM HELMS DATABASE                         │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────────┐
│   AdminUser      │
├──────────────────┤
│ id (PK)          │
│ email (UNIQUE)   │
│ password (hash)  │
│ firstName        │
│ lastName         │
│ role             │
│ isActive         │
│ createdAt        │
│ updatedAt        │
│ lastLogin        │
└──────────────────┘
        │
        │ (manages)
        ▼
┌──────────────────┐         ┌──────────────────┐
│      Car         │◄────────│   CarImage       │
├──────────────────┤  1:N    ├──────────────────┤
│ id (PK)          │         │ id (PK)          │
│ name             │         │ carId (FK)       │
│ brand            │         │ url              │
│ model            │         │ publicId         │
│ year             │         │ isPrimary        │
│ vin (UNIQUE)     │         │ order            │
│ category         │         │ createdAt        │
│ bodyType         │         └──────────────────┘
│ condition        │
│ price            │
│ transmission     │
│ fuelType         │         ┌──────────────────┐
│ mileage          │         │ FinancingLead    │
│ features[]       │◄────────├──────────────────┤
│ description      │  1:N    │ id (PK)          │
│ tags[]           │         │ selectedCarId(FK)│
│ status           │         │ firstName        │
│ visibility       │         │ lastName         │
│ views            │         │ email            │
│ country          │         │ phone            │
│ createdAt        │         │ ... (30+ fields) │
│ updatedAt        │         │ status           │
└──────────────────┘         │ submissionDate   │
                              └──────────────────┘

┌──────────────────┐         ┌──────────────────┐
│ImportationLead   │         │ ContactMessage   │
├──────────────────┤         ├──────────────────┤
│ id (PK)          │         │ id (PK)          │
│ fullName         │         │ name             │
│ email            │         │ email            │
│ phone            │         │ phone            │
│ desiredCar       │         │ subject          │
│ preferredCountry │         │ message          │
│ budgetRange      │         │ status           │
│ deliveryTimeline │         │ createdAt        │
│ importationType  │         │ updatedAt        │
│ status           │         └──────────────────┘
│ submissionDate   │
└──────────────────┘
```

---

## Field Type Legend

| Type | PostgreSQL Type | Example |
|------|----------------|---------|
| id (PK) | SERIAL | 1, 2, 3... |
| String | VARCHAR | "Mercedes-Benz" |
| Int | INTEGER | 2024 |
| Decimal | DECIMAL(15,2) | 95000000.00 |
| Boolean | BOOLEAN | true/false |
| DateTime | TIMESTAMP | 2024-11-01T10:30:00Z |
| String[] | TEXT[] | ["feature1", "feature2"] |
| (FK) | Foreign Key | References another table |
| (UNIQUE) | Unique Constraint | No duplicates allowed |

---

## Indexes Summary

### Car Table (7 Indexes)
```sql
CREATE INDEX idx_car_brand_model ON cars(brand, model);
CREATE INDEX idx_car_price ON cars(price);
CREATE INDEX idx_car_year ON cars(year);
CREATE INDEX idx_car_status ON cars(status);
CREATE INDEX idx_car_category ON cars(category);
CREATE INDEX idx_car_views ON cars(views);
CREATE INDEX idx_car_created_at ON cars(created_at);
```

### FinancingLead Table (4 Indexes)
```sql
CREATE INDEX idx_financing_email ON financing_leads(email);
CREATE INDEX idx_financing_status ON financing_leads(status);
CREATE INDEX idx_financing_submission ON financing_leads(submission_date);
CREATE INDEX idx_financing_car ON financing_leads(selected_car_id);
```

### ImportationLead Table (3 Indexes)
```sql
CREATE INDEX idx_importation_email ON importation_leads(email);
CREATE INDEX idx_importation_status ON importation_leads(status);
CREATE INDEX idx_importation_submission ON importation_leads(submission_date);
```

---

## Data Flow Diagrams

### 1. Car Listing Flow
```
User Request (with filters)
         │
         ▼
┌────────────────────┐
│  Filter Query      │
│  - brand           │
│  - price range     │
│  - year            │
│  - condition       │
│  etc...            │
└────────────────────┘
         │
         ▼
┌────────────────────┐
│ Database Query     │
│ (indexed fields)   │
└────────────────────┘
         │
         ▼
┌────────────────────┐
│ Car Records        │
│ + Primary Image    │
└────────────────────┘
         │
         ▼
┌────────────────────┐
│ JSON Response      │
│ { cars: [...] }    │
└────────────────────┘
```

### 2. Financing Lead Submission Flow
```
User Fills Form
         │
         ▼
┌────────────────────┐
│ Frontend POST      │
│ /api/leads/finance │
└────────────────────┘
         │
         ▼
┌────────────────────┐
│ Validation Layer   │
│ - Required fields  │
│ - Email format     │
│ - Phone format     │
└────────────────────┘
         │
         ▼
┌────────────────────┐
│ Create Lead Record │
│ - Auto-add metadata│
│ - Set status=pending│
└────────────────────┘
         │
         ▼
┌────────────────────┐
│ Success Response   │
│ { leadId: 123 }    │
└────────────────────┘
```

### 3. Admin Car Management Flow
```
Admin Login
         │
         ▼
┌────────────────────┐
│ JWT Token          │
│ (stored in cookie) │
└────────────────────┘
         │
         ▼
┌────────────────────┐
│ Protected Routes   │
│ /api/admin/cars    │
└────────────────────┘
         │
         ▼
┌────────────────────┐
│ CRUD Operations    │
│ - Create car       │
│ - Upload images    │
│ - Update details   │
│ - Delete car       │
└────────────────────┘
         │
         ▼
┌────────────────────┐
│ Database Update    │
│ + Cloudinary API   │
└────────────────────┘
```

---

## Sample Data Statistics

### Seed Data Breakdown

| Entity | Count | Notes |
|--------|-------|-------|
| Admin Users | 1 | admin@platinumhelms.com |
| Cars | 12 | Mix of new/used, various brands |
| Car Images | 15 | 3 images for first 5 cars |
| Financing Leads | 3 | Different statuses |
| Importation Leads | 3 | Various countries |
| Contact Messages | 2 | Sample inquiries |

### Car Inventory Breakdown

| Category | Count | Price Range (₦) |
|----------|-------|-----------------|
| Luxury | 4 | 95M - 150M |
| Sedan | 4 | 32M - 45M |
| SUV | 4 | 38M - 78M |

### Lead Status Distribution

| Status | Financing | Importation |
|--------|-----------|-------------|
| Pending | 2 | 2 |
| Contacted | 1 | 1 |
| Closed | 0 | 0 |

---

## Storage Estimates

### Car Table (10,000 records)
- Average row size: ~2KB
- Total size: ~20MB
- With indexes: ~50MB

### Lead Tables (100,000 records combined)
- Financing: ~5KB per row = ~250MB
- Importation: ~1KB per row = ~50MB
- Total: ~300MB

### Image References (30,000 images for 10K cars)
- Average row size: ~0.2KB
- Total size: ~6MB

**Total Database Size (10K cars + 100K leads):**
- Data: ~376MB
- Indexes: ~100MB
- **Total: ~500MB**

**Scalability**: PostgreSQL handles multi-GB databases easily

---

## Query Performance Examples

### Filter Query (indexed)
```sql
SELECT * FROM cars
WHERE brand = 'Toyota'
  AND price BETWEEN 30000000 AND 50000000
  AND condition = 'Foreign Used'
ORDER BY views DESC
LIMIT 20;
```
**Expected Time**: 3-8ms

### Popular Cars Query
```sql
SELECT * FROM cars
WHERE visibility = true
  AND status = 'available'
ORDER BY views DESC
LIMIT 10;
```
**Expected Time**: 2-5ms

### Lead Search Query
```sql
SELECT * FROM financing_leads
WHERE email LIKE '%@email.com'
  AND status = 'pending'
ORDER BY submission_date DESC;
```
**Expected Time**: 5-10ms

---

## Maintenance Tasks

### Daily
- Monitor slow queries
- Check disk space

### Weekly
- Vacuum database (PostgreSQL auto-vacuum)
- Review growth trends

### Monthly
- Archive old leads (status = 'closed', > 6 months)
- Regenerate statistics
- Review index usage

### Quarterly
- Performance audit
- Optimize slow queries
- Plan capacity scaling

