# Database Design Documentation
## Platinum Helms Autos Backend

---

## Overview

This database schema supports a car dealership platform with:
- Car inventory management
- Lead capture (financing & importation)
- Admin authentication
- Analytics tracking

**Database**: PostgreSQL  
**ORM**: Prisma  
**Design Philosophy**: Normalized, indexed, scalable

---

## Model Breakdown

### 1. AdminUser Model

```prisma
model AdminUser {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String   // Bcrypt hashed
  firstName String?
  lastName  String?
  role      String   @default("admin")
  isActive  Boolean  @default(true)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  lastLogin DateTime?
}
```

**Design Decisions:**
- **`email` as unique identifier**: Standard for admin login
- **`password` field**: Stores bcrypt hash (never plain text)
- **`role` field**: Future-proofs for RBAC (super_admin, manager, viewer)
- **`isActive` flag**: Soft delete - disable without losing audit trail
- **`lastLogin` tracking**: Security audit capability

**Security Notes:**
- Password must be hashed with bcrypt (12 rounds) before storage
- Email should be lowercase and trimmed
- Never expose password field in API responses

---

### 2. Car Model

```prisma
model Car {
  id           Int      @id @default(autoincrement())
  name         String
  brand        String
  model        String
  year         Int
  vin          String?  @unique
  category     String
  bodyType     String
  condition    String
  price        Decimal  @db.Decimal(15, 2)
  transmission String
  fuelType     String
  mileage      Int
  features     String[]
  description  String?  @db.Text
  images       CarImage[]
  tags         String[]
  status       String   @default("available")
  visibility   Boolean  @default(true)
  views        Int      @default(0)
  country      String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

**Design Decisions:**

1. **Separate `name`, `brand`, `model`**:
   - `name`: Display name (e.g., "S-Class Premium")
   - `brand`: Manufacturer (e.g., "Mercedes-Benz")
   - `model`: Specific model (e.g., "S-Class")
   - Allows flexible naming while maintaining filter accuracy

2. **`price` as Decimal(15,2)**:
   - Stores Nigerian Naira (₦)
   - Supports up to ₦9,999,999,999,999.99
   - Precision to 2 decimal places (kobo)
   - Avoids floating-point errors

3. **`features` as String[]**:
   - PostgreSQL native array type
   - Easy to query: `features @> ['Leather Interior']`
   - Flexible - no separate features table needed

4. **`tags` as String[]**:
   - Supports: "popular", "hotDeal", "promo", "searched"
   - Can be auto-assigned by business logic:
     - "popular" if views > 1000
     - "hotDeal" manually set by admin
     - "searched" if frequently appearing in searches

5. **`status` vs `visibility`**:
   - `status`: Business state (available, reserved, sold, hidden)
   - `visibility`: Public display toggle (true/false)
   - Separation allows: "sold but still visible for showcase"

6. **`views` counter**:
   - Incremented on detail page view
   - Used for "popular" sorting
   - Can track trending vehicles

7. **`country` field**:
   - Optional - for import vehicles
   - Helps display "Imported from Germany" badges

**Indexing Strategy:**
```prisma
@@index([brand, model])    // Fast brand-model lookups
@@index([price])           // Price range filters
@@index([year])            // Year filters
@@index([status])          // Active listings query
@@index([category])        // Category filters
@@index([views])           // Popular sorting
@@index([createdAt])       // Recent sorting
```

**Why these indexes?**
- Frontend filters query these fields heavily
- Sorting operations need indexed columns
- Composite index (brand, model) for dependent dropdowns

---

### 3. CarImage Model

```prisma
model CarImage {
  id        Int      @id @default(autoincrement())
  carId     Int
  url       String
  publicId  String
  isPrimary Boolean  @default(false)
  order     Int      @default(0)
  car       Car      @relation(fields: [carId], references: [id], onDelete: Cascade)
}
```

**Design Decisions:**

1. **Separate table vs embedded array**:
   - **Chosen**: Separate table (1-to-many)
   - **Reason**: Easier to manage, query, and order images
   - Cloudinary metadata needs separate tracking

2. **`isPrimary` flag**:
   - First image uploaded = primary
   - Returned in car listing cards
   - Can be changed by admin

3. **`order` field**:
   - Controls display sequence
   - Admin can drag-to-reorder in future

4. **`publicId` storage**:
   - Cloudinary public ID
   - Needed for image deletion via API

5. **`onDelete: Cascade`**:
   - Deleting car automatically deletes all images
   - Prevents orphaned records

**Frontend Integration:**
```javascript
// API returns:
{
  car: {
    id: 1,
    name: "S-Class Premium",
    image: "https://cloudinary.com/...",  // First/primary image URL
    images: [
      { url: "https://...", order: 0 },
      { url: "https://...", order: 1 }
    ]
  }
}
```

---

### 4. FinancingLead Model

```prisma
model FinancingLead {
  id                          Int      @id @default(autoincrement())
  // 30+ fields covering both frontend and official doc requirements
  selectedCarId               Int?
  formType                    String   @default("Financing")
  source                      String?
  status                      String   @default("pending")
  submissionDate              DateTime @default(now())
}
```

**Design Decisions:**

1. **Comprehensive field coverage**:
   - Includes ALL frontend fields (US-style credit app)
   - PLUS official doc requirements
   - Allows gradual simplification later

2. **`selectedCarId` as optional**:
   - Nullable - user might submit without selecting car
   - Foreign key to Car model
   - `onDelete: SetNull` - deleting car won't delete lead

3. **`ssn` field**:
   - ⚠️ **CRITICAL**: Must be encrypted before storage
   - Use crypto library or Prisma middleware
   - Consider hashing or storing in separate secure vault

4. **Income fields flexibility**:
   - `annualIncome` (frontend): number
   - `monthlyIncome` (official doc): range string
   - Both stored as String to handle ranges like "₦100k-₦250k"

5. **Status lifecycle**:
   - `pending` → `contacted` → `approved/rejected` → `closed`
   - Admin can update via dashboard

6. **Metadata fields** (from official doc):
   - `formType`: Always "Financing"
   - `source`: "Car Page" or "Financing Page"
   - Helps track conversion sources

**Indexes:**
```prisma
@@index([email])           // Search by contact
@@index([status])          // Filter by status
@@index([submissionDate])  // Recent submissions
@@index([selectedCarId])   // Leads per car
```

---

### 5. ImportationLead Model

```prisma
model ImportationLead {
  id                Int      @id @default(autoincrement())
  fullName          String
  desiredCar        String
  preferredCountry  String
  budgetRange       String
  deliveryTimeline  String
  importationType   String
  formType          String   @default("Importation")
  status            String   @default("pending")
}
```

**Design Decisions:**

1. **Simpler than FinancingLead**:
   - Fewer fields (9 vs 30+)
   - Matches frontend exactly
   - No need for expansion

2. **`desiredCar` as text**:
   - Not linked to Car model
   - Free-form input: "Toyota Highlander 2019"
   - Flexible - user might want car not in inventory

3. **`budgetRange` as enum-like string**:
   - "5M-7M", "7M-10M", etc.
   - String instead of separate min/max
   - Matches frontend dropdown exactly

4. **`importationType`**:
   - "self-import" vs "assisted-import"
   - Determines service level
   - Affects pricing/support workflow

---

### 6. ContactMessage Model

```prisma
model ContactMessage {
  id        Int      @id @default(autoincrement())
  name      String
  email     String
  phone     String?
  subject   String
  message   String   @db.Text
  status    String   @default("new")
}
```

**Design Decisions:**

1. **Separate from leads**:
   - Generic contact != lead
   - Different workflow/lifecycle
   - Simpler model

2. **`status` states**:
   - `new` → `responded` → `closed`
   - Tracks admin follow-up

---

## Data Relationships

```
AdminUser (1) -------- (manages) -------- (*) Car
Car (1) -------------- (has) ------------ (*) CarImage
Car (1) -------------- (receives) -------- (*) FinancingLead
```

**No complex joins needed** - intentionally simple for performance.

---

## Indexing Strategy Summary

### Why These Indexes?

1. **Filter Performance**:
   - Users filter by brand, model, price, year simultaneously
   - Without indexes: Full table scan (slow)
   - With indexes: O(log n) lookups

2. **Sorting Performance**:
   - "Sort by price" needs price index
   - "Sort by popularity" needs views index
   - "Sort by recent" needs createdAt index

3. **Admin Queries**:
   - "Show all pending leads" → status index
   - "Leads for Car #123" → selectedCarId index

### Performance Expectations:

| Query Type | Without Index | With Index |
|------------|---------------|------------|
| Filter 10K cars by brand | ~500ms | ~5ms |
| Sort by price | ~800ms | ~10ms |
| Find leads by email | ~300ms | ~2ms |

---

## Data Integrity Rules

1. **Cascading Deletes**:
   - Delete Car → Delete all CarImages (cascade)
   - Delete Car → Set FinancingLead.selectedCarId to NULL

2. **Unique Constraints**:
   - AdminUser.email (unique)
   - Car.vin (unique, nullable)

3. **Required Fields**:
   - All models have required core fields
   - Optional fields marked with `?`

4. **Default Values**:
   - Car.status = "available"
   - Car.visibility = true
   - Lead.status = "pending"

---

## Security Considerations

1. **Password Hashing**:
   ```javascript
   // Before insert
   const hashedPassword = await bcrypt.hash(password, 12);
   ```

2. **SSN Encryption** (Future):
   ```javascript
   // Use Prisma middleware or crypto
   const encrypted = encrypt(ssn, process.env.ENCRYPTION_KEY);
   ```

3. **SQL Injection Prevention**:
   - Prisma automatically parameterizes queries
   - No raw SQL needed for MVP

4. **Data Access Control**:
   - Admin routes require JWT
   - Public routes only access visible cars

---

## Migration Strategy

1. **Initial Migration**:
   ```bash
   npx prisma migrate dev --name init
   ```

2. **Future Migrations**:
   - Add fields without breaking existing data
   - Use `@default()` for new required fields
   - Consider backfilling scripts

3. **Rollback Plan**:
   - Prisma tracks migrations
   - Can revert with: `prisma migrate resolve`

---

## Performance Optimization

1. **Eager Loading**:
   ```javascript
   // Good: Load images with car in one query
   const car = await prisma.car.findUnique({
     where: { id },
     include: { images: true }
   });
   
   // Bad: N+1 query problem
   const car = await prisma.car.findUnique({ where: { id } });
   const images = await prisma.carImage.findMany({ where: { carId: id } });
   ```

2. **Pagination**:
   ```javascript
   // Always paginate large result sets
   const cars = await prisma.car.findMany({
     skip: (page - 1) * limit,
     take: limit
   });
   ```

3. **Select Only Needed Fields**:
   ```javascript
   // Don't fetch heavy fields unless needed
   const cars = await prisma.car.findMany({
     select: {
       id: true,
       name: true,
       price: true,
       // exclude: description, features for listing view
     }
   });
   ```

---

## Scalability Considerations

**Current Design Handles:**
- ✅ 10,000+ cars
- ✅ 100,000+ leads
- ✅ Concurrent admin operations

**Future Scaling Options:**
- Read replicas for heavy queries
- Materialized views for stats
- Redis cache for popular queries
- Archive old leads to separate table

---

## Validation Rules (Enforced in Application Layer)

1. **Car Validation**:
   - Price > 0
   - Year between 1990-2030
   - Mileage >= 0
   - Brand, model must be from predefined lists

2. **Lead Validation**:
   - Email format validation
   - Phone number format (Nigeria: +234...)
   - Required field checks

3. **Admin Validation**:
   - Strong password (8+ chars, numbers, special)
   - Email format

---

## Next Steps

1. ✅ Schema defined
2. → Create seed data script
3. → Generate Prisma Client
4. → Test migrations
5. → Build API endpoints

