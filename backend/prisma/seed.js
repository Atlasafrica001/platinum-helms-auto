// Seed script for Platinum Helms database
// Run with: npx prisma db seed

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...\n');

  // ============================================================================
  // 1. CREATE ADMIN USER
  // ============================================================================
  console.log('👤 Creating admin user...');
  
  const hashedPassword = await bcrypt.hash('Admin123!', 12);
  
  const admin = await prisma.adminUser.upsert({
    where: { email: 'admin@platinumhelms.com' },
    update: {},
    create: {
      email: 'admin@platinumhelms.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      isActive: true,
    },
  });
  
  console.log(`✅ Admin created: ${admin.email}`);
  console.log(`   Password: Admin123! (CHANGE IN PRODUCTION)\n`);

  // ============================================================================
  // 2. CREATE SAMPLE CARS
  // ============================================================================
  console.log('🚗 Creating sample cars...\n');

  const carsData = [
    {
      name: 'S-Class Premium',
      brand: 'Mercedes-Benz',
      model: 'S-Class',
      year: 2024,
      vin: 'WDD2221771A123456',
      category: 'luxury',
      bodyType: 'Sedan',
      condition: 'New',
      price: 95000000, // ₦95M
      transmission: 'Automatic',
      fuelType: 'Petrol',
      mileage: 0,
      features: ['Adaptive Cruise Control', 'Premium Sound System', 'Leather Interior', 'Panoramic Sunroof'],
      description: 'Luxurious flagship sedan with cutting-edge technology and unparalleled comfort.',
      tags: ['popular', 'searched'],
      status: 'available',
      visibility: true,
      views: 1245,
    },
    {
      name: 'GLE Sport',
      brand: 'Mercedes-Benz',
      model: 'GLE',
      year: 2024,
      vin: 'WDC1668771A234567',
      category: 'suv',
      bodyType: 'SUV',
      condition: 'New',
      price: 78000000, // ₦78M
      transmission: 'Automatic',
      fuelType: 'Petrol',
      mileage: 0,
      features: ['All-Wheel Drive', 'Panoramic Sunroof', 'Third Row Seating', 'Navigation System'],
      description: 'Premium SUV combining luxury with versatility and performance.',
      tags: ['popular', 'hotDeal'],
      status: 'available',
      visibility: true,
      views: 980,
    },
    {
      name: 'Camry LE',
      brand: 'Toyota',
      model: 'Camry',
      year: 2023,
      category: 'sedan',
      bodyType: 'Sedan',
      condition: 'Foreign Used',
      price: 35000000, // ₦35M
      transmission: 'Automatic',
      fuelType: 'Hybrid',
      mileage: 15000,
      features: ['Hybrid Engine', 'Fuel Efficient', 'Spacious Interior', 'Apple CarPlay'],
      description: 'Reliable hybrid sedan with excellent fuel economy and comfort.',
      tags: ['popular', 'searched'],
      status: 'available',
      visibility: true,
      views: 2100,
      country: 'USA',
    },
    {
      name: 'Accord Sport',
      brand: 'Honda',
      model: 'Accord',
      year: 2022,
      category: 'sedan',
      bodyType: 'Sedan',
      condition: 'Foreign Used',
      price: 32000000, // ₦32M
      transmission: 'Automatic',
      fuelType: 'Petrol',
      mileage: 22000,
      features: ['Turbo Engine', 'Sport Package', 'Apple CarPlay', 'Lane Keep Assist'],
      description: 'Sporty sedan with responsive handling and modern tech features.',
      tags: ['hotDeal'],
      status: 'available',
      visibility: true,
      views: 856,
      country: 'USA',
    },
    {
      name: 'X5 M Sport',
      brand: 'BMW',
      model: 'X5',
      year: 2023,
      vin: 'WBA7E2C53JG345678',
      category: 'suv',
      bodyType: 'SUV',
      condition: 'Foreign Used',
      price: 72000000, // ₦72M
      transmission: 'Automatic',
      fuelType: 'Diesel',
      mileage: 18000,
      features: ['M Sport Package', 'Premium Audio', 'Night Vision', 'Gesture Control'],
      description: 'Performance-oriented luxury SUV with advanced driver assistance.',
      tags: ['popular'],
      status: 'available',
      visibility: true,
      views: 1340,
      country: 'Germany',
    },
    {
      name: 'Corolla Cross',
      brand: 'Toyota',
      model: 'Corolla Cross',
      year: 2024,
      category: 'suv',
      bodyType: 'SUV',
      condition: 'New',
      price: 38000000, // ₦38M
      transmission: 'Automatic',
      fuelType: 'Hybrid',
      mileage: 0,
      features: ['Toyota Safety Sense', 'Hybrid System', 'AWD', 'Smart Entry'],
      description: 'Compact hybrid SUV perfect for city driving with efficiency.',
      tags: ['promo', 'searched'],
      status: 'available',
      visibility: true,
      views: 1890,
    },
    {
      name: 'Tucson Hybrid',
      brand: 'Hyundai',
      model: 'Tucson',
      year: 2024,
      category: 'suv',
      bodyType: 'SUV',
      condition: 'New',
      price: 42000000, // ₦42M
      transmission: 'Automatic',
      fuelType: 'Hybrid',
      mileage: 0,
      features: ['Panoramic Sunroof', 'Wireless Charging', '360 Camera', 'Heated Seats'],
      description: 'Modern SUV with bold styling and hybrid efficiency.',
      tags: ['hotDeal'],
      status: 'available',
      visibility: true,
      views: 724,
    },
    {
      name: 'Range Rover Autobiography',
      brand: 'Land Rover',
      model: 'Range Rover',
      year: 2024,
      vin: 'SALGS2VF5KA456789',
      category: 'luxury',
      bodyType: 'SUV',
      condition: 'New',
      price: 150000000, // ₦150M
      transmission: 'Automatic',
      fuelType: 'Petrol',
      mileage: 0,
      features: ['Luxury Interior', 'Air Suspension', 'Meridian Sound System', 'Massage Seats'],
      description: 'The ultimate luxury SUV with unmatched refinement and capability.',
      tags: ['popular', 'promo'],
      status: 'available',
      visibility: true,
      views: 892,
    },
    {
      name: 'A8 L Quattro',
      brand: 'Audi',
      model: 'A8',
      year: 2023,
      vin: 'WAUZZZ8V9KA567890',
      category: 'luxury',
      bodyType: 'Sedan',
      condition: 'Foreign Used',
      price: 95000000, // ₦95M
      transmission: 'Automatic',
      fuelType: 'Petrol',
      mileage: 12000,
      features: ['Quattro AWD', 'Matrix LED Lights', 'Virtual Cockpit', 'Bang & Olufsen Sound'],
      description: 'Flagship luxury sedan with innovative technology and performance.',
      tags: ['popular'],
      status: 'available',
      visibility: true,
      views: 678,
      country: 'Germany',
    },
    {
      name: 'Panamera Turbo',
      brand: 'Porsche',
      model: 'Panamera',
      year: 2024,
      vin: 'WP0AA2A71KL678901',
      category: 'luxury',
      bodyType: 'Sedan',
      condition: 'New',
      price: 135000000, // ₦135M
      transmission: 'Automatic',
      fuelType: 'Petrol',
      mileage: 0,
      features: ['Sport Chrono Package', 'Bose Surround Sound', 'Adaptive Sport Seats', 'Carbon Fiber Trim'],
      description: 'Sports sedan combining Porsche performance with luxury comfort.',
      tags: ['popular', 'promo'],
      status: 'available',
      visibility: true,
      views: 1123,
    },
    // Add a sold car for testing
    {
      name: 'C-Class Sport',
      brand: 'Mercedes-Benz',
      model: 'C-Class',
      year: 2022,
      category: 'sedan',
      bodyType: 'Sedan',
      condition: 'Foreign Used',
      price: 45000000, // ₦45M
      transmission: 'Automatic',
      fuelType: 'Petrol',
      mileage: 28000,
      features: ['AMG Line', 'Digital Cockpit', 'Keyless Entry'],
      description: 'Sporty compact sedan with premium features.',
      tags: [],
      status: 'sold',
      visibility: false,
      views: 2341,
      country: 'Germany',
    },
    // Add a reserved car
    {
      name: 'Highlander Limited',
      brand: 'Toyota',
      model: 'Highlander',
      year: 2023,
      category: 'suv',
      bodyType: 'SUV',
      condition: 'Foreign Used',
      price: 55000000, // ₦55M
      transmission: 'Automatic',
      fuelType: 'Petrol',
      mileage: 8000,
      features: ['Third Row Seating', 'JBL Audio', 'Blind Spot Monitor', 'Leather Seats'],
      description: 'Family-friendly SUV with exceptional reliability.',
      tags: [],
      status: 'reserved',
      visibility: true,
      views: 1567,
      country: 'USA',
    },
  ];

  for (const carData of carsData) {
    const car = await prisma.car.create({
      data: carData,
    });
    console.log(`  ✓ ${car.brand} ${car.model} (${car.year})`);
  }

  console.log(`\n✅ Created ${carsData.length} cars\n`);

  // ============================================================================
  // 3. CREATE SAMPLE CAR IMAGES
  // ============================================================================
  console.log('📸 Creating sample car images...\n');

  // For demo, we'll use placeholder images
  // In production, these would be actual Cloudinary URLs
  const cars = await prisma.car.findMany();
  
  for (let i = 0; i < Math.min(5, cars.length); i++) {
    const car = cars[i];
    
    // Create 3 images per car
    for (let j = 0; j < 3; j++) {
      await prisma.carImage.create({
        data: {
          carId: car.id,
          url: `https://images.unsplash.com/photo-placeholder-${car.id}-${j}`,
          publicId: `platinum-helms/car-${car.id}-image-${j}`,
          isPrimary: j === 0, // First image is primary
          order: j,
        },
      });
    }
    
    console.log(`  ✓ Added 3 images for ${car.name}`);
  }

  console.log('\n✅ Sample images created\n');

  // ============================================================================
  // 4. CREATE SAMPLE FINANCING LEADS
  // ============================================================================
  console.log('💰 Creating sample financing leads...\n');

  const financingLeads = [
    {
      firstName: 'Adewale',
      lastName: 'Johnson',
      email: 'adewale.j@email.com',
      phone: '+234 801 234 5678',
      employmentStatus: 'full-time',
      employer: 'ABC Corporation',
      jobTitle: 'Software Engineer',
      annualIncome: '12000000', // ₦12M
      monthlyIncome: '₦500k–₦1M+',
      selectedCarId: cars[2]?.id, // Camry
      preferredRepaymentDuration: '24 months',
      initialDepositBudget: 10000000, // ₦10M
      authorizeCredit: true,
      agreeToTerms: true,
      source: 'Car Page',
      status: 'pending',
    },
    {
      firstName: 'Ngozi',
      lastName: 'Okonkwo',
      email: 'ngozi.ok@email.com',
      phone: '+234 802 345 6789',
      employmentStatus: 'self-employed',
      employer: 'NK Enterprises',
      jobTitle: 'Business Owner',
      annualIncome: '25000000', // ₦25M
      monthlyIncome: '₦1M+',
      selectedCarId: cars[0]?.id, // S-Class
      preferredRepaymentDuration: '18 months',
      initialDepositBudget: 40000000, // ₦40M
      authorizeCredit: true,
      agreeToTerms: true,
      source: 'Financing Page',
      status: 'contacted',
    },
    {
      firstName: 'Chukwuma',
      lastName: 'Nwosu',
      email: 'chukwuma.n@email.com',
      phone: '+234 803 456 7890',
      employmentStatus: 'full-time',
      employer: 'Tech Solutions Ltd',
      jobTitle: 'Project Manager',
      annualIncome: '8000000', // ₦8M
      monthlyIncome: '₦500k–₦1M+',
      selectedCarId: cars[3]?.id, // Accord
      preferredRepaymentDuration: '12 months',
      authorizeCredit: true,
      agreeToTerms: true,
      source: 'Car Page',
      status: 'pending',
    },
  ];

  for (const leadData of financingLeads) {
    const lead = await prisma.financingLead.create({
      data: leadData,
    });
    console.log(`  ✓ ${lead.firstName} ${lead.lastName} - ${lead.status}`);
  }

  console.log('\n✅ Created financing leads\n');

  // ============================================================================
  // 5. CREATE SAMPLE IMPORTATION LEADS
  // ============================================================================
  console.log('🌍 Creating sample importation leads...\n');

  const importationLeads = [
    {
      fullName: 'Ibrahim Abdullahi',
      email: 'ibrahim.a@email.com',
      phone: '+234 804 567 8901',
      desiredCar: 'BMW X7 2023',
      preferredCountry: 'Germany',
      budgetRange: '₦15M–₦20M',
      deliveryTimeline: '6-8',
      importationType: 'assisted-import',
      additionalDetails: 'Prefer black color with premium package',
      source: 'Importation Page',
      status: 'pending',
    },
    {
      fullName: 'Fatima Bello',
      email: 'fatima.b@email.com',
      phone: '+234 805 678 9012',
      desiredCar: 'Lexus RX 350 2024',
      preferredCountry: 'USA',
      budgetRange: '₦10M–₦15M',
      deliveryTimeline: '4-6',
      importationType: 'self-import',
      additionalDetails: 'Low mileage, full service history required',
      source: 'Importation Page',
      status: 'contacted',
    },
    {
      fullName: 'Emeka Obi',
      email: 'emeka.obi@email.com',
      phone: '+234 806 789 0123',
      desiredCar: 'Toyota Land Cruiser 2023',
      preferredCountry: 'UAE',
      budgetRange: '₦20M+',
      deliveryTimeline: 'flexible',
      importationType: 'assisted-import',
      source: 'Car Page',
      status: 'pending',
    },
  ];

  for (const leadData of importationLeads) {
    const lead = await prisma.importationLead.create({
      data: leadData,
    });
    console.log(`  ✓ ${lead.fullName} - ${lead.desiredCar}`);
  }

  console.log('\n✅ Created importation leads\n');

  // ============================================================================
  // 6. CREATE SAMPLE CONTACT MESSAGES
  // ============================================================================
  console.log('📧 Creating sample contact messages...\n');

  const contactMessages = [
    {
      name: 'Adeola Williams',
      email: 'adeola.w@email.com',
      phone: '+234 807 890 1234',
      subject: 'Financing Options Inquiry',
      message: 'I would like to know more about your auto financing options and eligibility requirements.',
      status: 'new',
    },
    {
      name: 'Tunde Bakare',
      email: 'tunde.b@email.com',
      phone: '+234 808 901 2345',
      subject: 'Test Drive Request',
      message: 'I am interested in scheduling a test drive for the Mercedes GLE Sport.',
      status: 'responded',
    },
  ];

  for (const messageData of contactMessages) {
    const message = await prisma.contactMessage.create({
      data: messageData,
    });
    console.log(`  ✓ ${message.name} - ${message.subject}`);
  }

  console.log('\n✅ Created contact messages\n');

  // ============================================================================
  // SUMMARY
  // ============================================================================
  const counts = {
    admins: await prisma.adminUser.count(),
    cars: await prisma.car.count(),
    images: await prisma.carImage.count(),
    financingLeads: await prisma.financingLead.count(),
    importationLeads: await prisma.importationLead.count(),
    contacts: await prisma.contactMessage.count(),
  };

  console.log('========================================');
  console.log('✅ SEED COMPLETE - DATABASE SUMMARY');
  console.log('========================================');
  console.log(`👤 Admin Users:        ${counts.admins}`);
  console.log(`🚗 Cars:               ${counts.cars}`);
  console.log(`📸 Car Images:         ${counts.images}`);
  console.log(`💰 Financing Leads:    ${counts.financingLeads}`);
  console.log(`🌍 Importation Leads:  ${counts.importationLeads}`);
  console.log(`📧 Contact Messages:   ${counts.contacts}`);
  console.log('========================================\n');
  
  console.log('🔐 Admin Credentials:');
  console.log('   Email: admin@platinumhelms.com');
  console.log('   Password: Admin123!');
  console.log('   ⚠️  CHANGE THIS IN PRODUCTION!\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
