# Folder Structure

## Role-Based Page Organization

The application is organized by user roles, with separate page directories for each role while keeping components shared.

### Directory Structure

```
src/
├── app/
│   ├── page.tsx                    # Landing page (public)
│   ├── login/                      # Public login page
│   ├── register/                   # Public registration page
│   │
│   ├── staff/                      # STAFF ROLE PAGES
│   │   ├── layout.tsx              # Staff-specific layout & auth
│   │   ├── dashboard/              # Staff dashboard
│   │   │   └── page.tsx
│   │   ├── vehicles/               # Vehicle management
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   └── inquiries/              # Parts inquiries
│   │       └── page.tsx
│   │
│   ├── admin/                      # ADMIN ROLE PAGES (future)
│   │   ├── layout.tsx
│   │   └── dashboard/
│   │
│   └── manager/                    # MANAGER ROLE PAGES (future)
│       ├── layout.tsx
│       └── dashboard/
│
└── components/                     # SHARED COMPONENTS (all roles)
    ├── dashboard/                  # Dashboard components
    │   ├── Header.tsx
    │   ├── NavigationBar.tsx
    │   ├── StatusCard.tsx
    │   ├── AddVehicleCard.tsx
    │   ├── RaisePartsCard.tsx
    │   ├── JobsCard.tsx
    │   └── FloatingActionButton.tsx
    │
    ├── layout/                     # Layout components
    │   └── Sidebar.tsx
    │
    ├── overlays/                   # Modal overlays
    │   ├── RaiseDisputeOverlay.tsx
    │   └── RequestPartOverlay.tsx
    │
    ├── auth/                       # Authentication components
    │   └── (auth components)
    │
    └── ui/                         # Reusable UI components
        └── (UI components)
```

## Routing

### Public Routes
- `/` - Landing page
- `/login` - Login page
- `/register` - Registration page

### Staff Routes (requires staff authentication)
- `/staff/dashboard` - Staff dashboard
- `/staff/vehicles` - Vehicle list
- `/staff/vehicles/[id]` - Vehicle details
- `/staff/inquiries` - Parts inquiries

### Future Routes
- `/admin/*` - Admin pages
- `/manager/*` - Manager pages

## Adding New Roles

To add a new role:

1. Create a new directory under `src/app/` (e.g., `admin/`)
2. Add a `layout.tsx` file with role-specific authentication
3. Create role-specific pages as subdirectories
4. Reuse existing components from `src/components/`

## Component Reusability

All components in `src/components/` are shared across roles. This allows:
- Consistent UI/UX across different user types
- Easier maintenance and updates
- Code reusability and DRY principles

When creating role-specific behavior, use:
- Props to customize component behavior
- Context for role-based state management
- Conditional rendering based on user role
