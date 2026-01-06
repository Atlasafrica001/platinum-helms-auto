# 🎨 PLATINUM HELMS FRONTEND

React + TypeScript frontend for Platinum Helms Autos car dealership platform.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env

# Start development server
npm run dev
```

**Runs at:** http://localhost:3000

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── Navigation.tsx  # Main navigation
│   ├── Footer.tsx      # Site footer
│   ├── *Form.tsx       # Form components
│   └── *Dialog.tsx     # Modal dialogs
│
├── pages/              # Page components
│   ├── HomePage.tsx
│   ├── CarPurchasePage.tsx
│   ├── CarFinancingPage.tsx
│   ├── CarImportationPage.tsx
│   ├── ContactPage.tsx
│   ├── AboutUsPage.tsx
│   └── AdminDashboard.tsx
│
├── lib/                # Utilities
│   ├── utils.ts        # Helper functions
│   └── use-mobile.ts   # Mobile detection hook
│
├── App.tsx             # Main app component
└── main.tsx            # Entry point
```

## 🎯 Key Features

### Public Pages
- **Home** - Hero section, featured cars, stats
- **Browse Cars** - Filterable car inventory
- **Car Details** - Image gallery, specs, contact
- **Financing** - 30+ field application form
- **Importation** - Custom car import requests
- **Contact** - General inquiries

### Admin Dashboard
- Authentication required
- Car management (CRUD)
- Image uploads
- Lead management
- Statistics overview

## 🔧 Configuration

### Environment Variables

```env
# .env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

For production:
```env
VITE_API_BASE_URL=https://your-backend.com/api/v1
```

## 📦 Dependencies

### Core
- React 18.3.1
- TypeScript
- Vite (build tool)

### UI Components
- shadcn/ui (Radix UI)
- Tailwind CSS
- Lucide React (icons)

### Forms & Validation
- React Hook Form
- Zod

### Other
- date-fns
- Recharts (charts)
- Sonner (toasts)

## 🎨 Styling

### Tailwind CSS
Global styles in `globals.css`:
- CSS variables for theming
- Custom utilities
- Responsive breakpoints

### Component Styling
All components use Tailwind utility classes:
```tsx
<div className="flex items-center gap-4 p-4">
  ...
</div>
```

## 📱 Responsive Design

Breakpoints:
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

All components are mobile-first and fully responsive.

## 🔌 API Integration

### API Service Example

```typescript
const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const getCars = async (filters) => {
  const response = await fetch(`${API_BASE}/cars?${params}`);
  const data = await response.json();
  return data;
};
```

### Current Integration Status
- ⚠️ Frontend currently uses mock localStorage data
- ✅ Backend API is ready and documented
- 🔄 Replace mock data with actual API calls

### Integration Steps

1. **Create API service layer:**
```typescript
// src/services/api.ts
const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const api = {
  cars: {
    getAll: (filters) => fetch(`${API_BASE}/cars?${filters}`),
    getById: (id) => fetch(`${API_BASE}/cars/${id}`),
  },
  leads: {
    submitFinancing: (data) => fetch(`${API_BASE}/leads/financing`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  },
};
```

2. **Replace localStorage calls:**
```typescript
// OLD
const cars = JSON.parse(localStorage.getItem('cars') || '[]');

// NEW
const { data: cars } = await api.cars.getAll(filters);
```

3. **Add loading states:**
```typescript
const [loading, setLoading] = useState(true);
const [cars, setCars] = useState([]);

useEffect(() => {
  const fetchCars = async () => {
    try {
      const data = await api.cars.getAll();
      setCars(data);
    } catch (error) {
      console.error('Failed to fetch cars:', error);
    } finally {
      setLoading(false);
    }
  };
  fetchCars();
}, []);
```

## 🎭 Components

### UI Components (shadcn/ui)
Located in `src/components/ui/`:
- `button.tsx`
- `dialog.tsx`
- `form.tsx`
- `input.tsx`
- `select.tsx`
- And 40+ more...

### Custom Components

**Navigation.tsx** - Main site navigation
- Responsive mobile menu
- Active link highlighting

**Footer.tsx** - Site footer
- Company info
- Social links

**Forms** - Lead capture forms
- `FinancialApplicationForm.tsx`
- `ImportationRequestForm.tsx`
- Full validation with React Hook Form

**Dialogs** - Modal windows
- `VehicleDetailsDialog.tsx`
- `LeadCaptureDialog.tsx`

## 🏗️ Development

### Adding New Components

```bash
# shadcn/ui components
npx shadcn@latest add button
npx shadcn@latest add dialog
```

### Code Style
- Use TypeScript for type safety
- Functional components with hooks
- Tailwind for styling (no CSS modules)
- Extract reusable logic to custom hooks

## 📊 Forms

### Financing Application
30+ fields including:
- Personal info
- Employment details
- Financial information
- Loan preferences
- Credit authorization

### Importation Request
- Contact details
- Desired vehicle
- Preferred country
- Budget range
- Timeline

### Validation
- All forms use Zod schemas
- Client-side validation
- Backend validation on submit

## 🔐 Authentication

### Admin Login
Located in `AdminDashboard.tsx`:
```typescript
const handleLogin = async (email, password) => {
  const response = await fetch(`${API_BASE}/admin/login`, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    credentials: 'include', // Important for cookies
  });
  const { token } = await response.json();
  localStorage.setItem('token', token);
};
```

### Protected Routes
Admin routes require authentication:
- Check for token in localStorage
- Redirect to login if missing
- Include token in API requests

## 🚀 Build & Deploy

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
# Output: dist/
```

### Preview Production Build
```bash
npm run preview
```

### Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Environment variables in Vercel dashboard:
# VITE_API_BASE_URL = https://your-backend.com/api/v1
```

### Deploy to Netlify
```bash
# Build command: npm run build
# Publish directory: dist
# Environment variables in Netlify dashboard
```

## 🐛 Troubleshooting

### CORS Errors
- Ensure backend CORS is configured
- Backend should allow frontend origin

### API Not Found
- Check VITE_API_BASE_URL in .env
- Verify backend is running
- Check network tab in browser DevTools

### Build Errors
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📝 TODO: Integration Tasks

To fully integrate with backend:

1. [ ] Create API service layer
2. [ ] Replace localStorage with API calls
3. [ ] Add loading states
4. [ ] Add error handling
5. [ ] Implement authentication flow
6. [ ] Add image upload UI
7. [ ] Test all forms
8. [ ] Update admin dashboard with real data

See `backend/PROJECT_COMPLETE.md` for backend integration examples.

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Vite Guide](https://vitejs.dev/guide/)

---

**Frontend Status:** ✅ Complete & Ready for Integration
