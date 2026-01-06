-- CreateTable
CREATE TABLE "admin_users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastLogin" TIMESTAMP(3),

    CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cars" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "vin" TEXT,
    "category" TEXT NOT NULL,
    "bodyType" TEXT NOT NULL,
    "condition" TEXT NOT NULL,
    "price" DECIMAL(15,2) NOT NULL,
    "transmission" TEXT NOT NULL,
    "fuelType" TEXT NOT NULL,
    "mileage" INTEGER NOT NULL DEFAULT 0,
    "features" TEXT[],
    "description" TEXT,
    "tags" TEXT[],
    "status" TEXT NOT NULL DEFAULT 'available',
    "visibility" BOOLEAN NOT NULL DEFAULT true,
    "views" INTEGER NOT NULL DEFAULT 0,
    "country" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cars_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "car_images" (
    "id" SERIAL NOT NULL,
    "carId" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "car_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "financing_leads" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "dateOfBirth" TEXT,
    "ssn" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zipCode" TEXT,
    "employmentStatus" TEXT NOT NULL,
    "employer" TEXT,
    "jobTitle" TEXT,
    "employmentLength" TEXT,
    "workPhone" TEXT,
    "annualIncome" TEXT,
    "monthlyIncome" TEXT,
    "additionalIncome" TEXT,
    "monthlyHousing" TEXT,
    "monthlyDebt" TEXT,
    "selectedCarId" INTEGER,
    "preferredRepaymentDuration" TEXT,
    "initialDepositBudget" DECIMAL(15,2),
    "additionalNotes" TEXT,
    "authorizeCredit" BOOLEAN NOT NULL DEFAULT false,
    "agreeToTerms" BOOLEAN NOT NULL DEFAULT false,
    "formType" TEXT NOT NULL DEFAULT 'Financing',
    "source" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "submissionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "financing_leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "importation_leads" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "desiredCar" TEXT NOT NULL,
    "preferredCountry" TEXT NOT NULL,
    "budgetRange" TEXT NOT NULL,
    "deliveryTimeline" TEXT NOT NULL,
    "importationType" TEXT NOT NULL,
    "additionalDetails" TEXT,
    "formType" TEXT NOT NULL DEFAULT 'Importation',
    "source" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "submissionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "importation_leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_messages" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'new',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contact_messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_email_key" ON "admin_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "cars_vin_key" ON "cars"("vin");

-- CreateIndex
CREATE INDEX "cars_brand_model_idx" ON "cars"("brand", "model");

-- CreateIndex
CREATE INDEX "cars_price_idx" ON "cars"("price");

-- CreateIndex
CREATE INDEX "cars_year_idx" ON "cars"("year");

-- CreateIndex
CREATE INDEX "cars_status_idx" ON "cars"("status");

-- CreateIndex
CREATE INDEX "cars_category_idx" ON "cars"("category");

-- CreateIndex
CREATE INDEX "cars_views_idx" ON "cars"("views");

-- CreateIndex
CREATE INDEX "cars_createdAt_idx" ON "cars"("createdAt");

-- CreateIndex
CREATE INDEX "car_images_carId_idx" ON "car_images"("carId");

-- CreateIndex
CREATE INDEX "financing_leads_email_idx" ON "financing_leads"("email");

-- CreateIndex
CREATE INDEX "financing_leads_status_idx" ON "financing_leads"("status");

-- CreateIndex
CREATE INDEX "financing_leads_submissionDate_idx" ON "financing_leads"("submissionDate");

-- CreateIndex
CREATE INDEX "financing_leads_selectedCarId_idx" ON "financing_leads"("selectedCarId");

-- CreateIndex
CREATE INDEX "importation_leads_email_idx" ON "importation_leads"("email");

-- CreateIndex
CREATE INDEX "importation_leads_status_idx" ON "importation_leads"("status");

-- CreateIndex
CREATE INDEX "importation_leads_submissionDate_idx" ON "importation_leads"("submissionDate");

-- CreateIndex
CREATE INDEX "contact_messages_email_idx" ON "contact_messages"("email");

-- CreateIndex
CREATE INDEX "contact_messages_status_idx" ON "contact_messages"("status");

-- CreateIndex
CREATE INDEX "contact_messages_createdAt_idx" ON "contact_messages"("createdAt");

-- AddForeignKey
ALTER TABLE "car_images" ADD CONSTRAINT "car_images_carId_fkey" FOREIGN KEY ("carId") REFERENCES "cars"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financing_leads" ADD CONSTRAINT "financing_leads_selectedCarId_fkey" FOREIGN KEY ("selectedCarId") REFERENCES "cars"("id") ON DELETE SET NULL ON UPDATE CASCADE;
