// Application constants
module.exports = {
  // HTTP Status Codes
  STATUS: {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500,
  },

  // Car Status
  CAR_STATUS: {
    AVAILABLE: 'available',
    RESERVED: 'reserved',
    SOLD: 'sold',
    HIDDEN: 'hidden',
  },

  // Lead Status
  LEAD_STATUS: {
    PENDING: 'pending',
    CONTACTED: 'contacted',
    APPROVED: 'approved',
    REJECTED: 'rejected',
    CLOSED: 'closed',
  },

  // Contact Message Status
  CONTACT_STATUS: {
    NEW: 'new',
    RESPONDED: 'responded',
    SCHEDULED: 'scheduled',
    CLOSED: 'closed',
  },

  // Car Categories
  CAR_CATEGORIES: [
    'luxury',
    'sedan',
    'suv',
    'sports',
    'coupe',
    'hatchback',
    'truck',
    'van',
  ],

  // Car Conditions
  CAR_CONDITIONS: [
    'New',
    'Foreign Used',
    'Nigerian Used',
  ],

  // Body Types
  BODY_TYPES: [
    'Sedan',
    'SUV',
    'Coupe',
    'Hatchback',
    'Truck',
    'Van',
    'Wagon',
    'Convertible',
  ],

  // Transmission Types
  TRANSMISSION_TYPES: [
    'Automatic',
    'Manual',
  ],

  // Fuel Types
  FUEL_TYPES: [
    'Petrol',
    'Diesel',
    'Hybrid',
    'Electric',
  ],

  // Car Tags
  CAR_TAGS: [
    'popular',
    'hotDeal',
    'promo',
    'searched',
  ],

  // Sort Options
  SORT_OPTIONS: {
    RECENT: 'recent',
    PRICE_LOW: 'priceLow',
    PRICE_HIGH: 'priceHigh',
    YEAR_NEW: 'yearNew',
    YEAR_OLD: 'yearOld',
    POPULAR: 'popular',
  },

  // Employment Status
  EMPLOYMENT_STATUS: [
    'full-time',
    'part-time',
    'self-employed',
    'business-owner',
    'unemployed',
    'retired',
    'student',
    'other',
  ],

  // Import Countries
  IMPORT_COUNTRIES: [
    'USA',
    'Canada',
    'UAE',
    'Germany',
    'UK',
    'Japan',
  ],

  // Budget Ranges (Nigerian Naira)
  BUDGET_RANGES: [
    '5M-7M',
    '7M-10M',
    '10M-15M',
    '15M-20M',
    '20M+',
  ],

  // Delivery Timeline
  DELIVERY_TIMELINES: [
    '4-6',
    '6-8',
    '8-12',
    'flexible',
  ],

  // Importation Types
  IMPORTATION_TYPES: [
    'self-import',
    'assisted-import',
  ],

  // Pagination Defaults
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
  },

  // File Upload
  UPLOAD: {
    MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE) || 10485760, // 10MB
    MAX_FILES: parseInt(process.env.MAX_FILES) || 10,
    ALLOWED_MIME_TYPES: [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
    ],
  },

  // JWT
  JWT: {
    COOKIE_NAME: 'platinum_auth_token',
    COOKIE_OPTIONS: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  },

  // Rate Limiting
  RATE_LIMIT: {
    WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000, // 15 min
    MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    AUTH_MAX: parseInt(process.env.AUTH_RATE_LIMIT_MAX) || 5,
  },

  // Admin Roles
  ADMIN_ROLES: {
    SUPER_ADMIN: 'super_admin',
    ADMIN: 'admin',
    MANAGER: 'manager',
    VIEWER: 'viewer',
  },
};
