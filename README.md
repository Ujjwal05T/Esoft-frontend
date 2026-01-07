# ETNA Spares - Frontend

Vehicle management system for workshop staff.

## Quick Links

- 🏠 **Landing Page**: [http://localhost:3000](http://localhost:3000)
- 🔐 **Login**: [http://localhost:3000/login](http://localhost:3000/login)
- 📝 **Register**: [http://localhost:3000/register](http://localhost:3000/register)
- 🎨 **Component Playground**: [http://localhost:3000/playground](http://localhost:3000/playground) ⭐

### Staff Routes
- 📊 **Dashboard**: [http://localhost:3000/staff/dashboard](http://localhost:3000/staff/dashboard)
- 🚗 **Vehicles**: [http://localhost:3000/staff/vehicles](http://localhost:3000/staff/vehicles)
- 📋 **Inquiries**: [http://localhost:3000/staff/inquiries](http://localhost:3000/staff/inquiries)

## Development

```bash
npm run dev
```

## Documentation

- 📁 [Folder Structure](./FOLDER_STRUCTURE.md) - Role-based organization
- 🔄 [Migration Summary](./MIGRATION_SUMMARY.md) - Recent changes
- 🎨 [Component Playground](./src/app/playground/README.md) - Testing components

## Component Playground

The playground is an interactive environment to test components with different:
- Data values (vehicles, inquiries, jobs)
- Layout configurations (with/without sidebar)
- Role-based scenarios (staff, manager, admin)
- Grid layouts (2, 3, 4 columns)

**Access**: Navigate to `/playground` or click the link above.

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── login/                # Authentication
│   ├── register/
│   ├── playground/           # 🎨 Component testing
│   └── staff/                # Staff role pages
│       ├── dashboard/
│       ├── vehicles/
│       └── inquiries/
│
└── components/               # Shared components
    ├── dashboard/
    ├── layout/
    ├── overlays/
    ├── auth/
    └── ui/
```

## Adding New Roles

To add a new role (e.g., admin, manager):

1. Create `app/[role]/` directory
2. Add `layout.tsx` with role-specific auth
3. Create role-specific pages
4. Reuse components from `components/`
5. Test in the playground

See [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md) for details.

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components (shared across roles)

## Features

- ✅ Role-based routing (staff, admin, manager)
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Component playground for testing
- ✅ Shared component library
- ✅ Authentication flow
- ✅ Vehicle management
- ✅ Parts inquiry system
- ✅ Job card processing
