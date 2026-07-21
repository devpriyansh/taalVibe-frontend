# Core UI Boilerplate

This repository contains the foundational React (Vite) frontend for our new projects. All unrelated business UI has been stripped out, leaving a robust infrastructure centered around authentication, user profiles, Google OAuth, layouts, and state management.

---

## 🏗️ Architecture & State Guide

The frontend is structured to promote reusability and clean separation of concerns.

```text
my-project/
├── src/
│   ├── assets/           # Global static assets (Images, SVGs, etc.)
│   ├── components/       # Reusable UI components
│   │   ├── auth/         # Core auth components (e.g. GoogleAuthButton)
│   │   ├── common/       # Global components (Navbar, Loaders, ProtectedRoute)
│   │   └── 🟢 ADD YOUR DOMAIN COMPONENTS HERE
│   ├── contexts/         # React Contexts for global state management
│   │   └── AuthContext.jsx # Handles user login, registration, and sessions
│   ├── layouts/          # Layout wrappers
│   │   └── RootLayout.jsx  # Primary layout applied to protected routes
│   ├── pages/            # Page-level components
│   │   ├── Dashboard/    # Protected dashboard and profile settings
│   │   ├── Landing/      # Public landing page
│   │   ├── Login/        # Public login page
│   │   ├── Signup/       # Public signup page
│   │   └── 🟢 ADD YOUR DOMAIN PAGES HERE
│   ├── services/         # API configurations and axios instances
│   │   └── api.js        # Core API interceptors and configs
│   └── App.jsx           # Main router config 
└── index.html            # Entry HTML file
```

### Adding New Protected Pages
To add new features or pages that require authentication without disrupting the core flow, follow this workflow:

1. **Create the Page**: Create your new page component in `src/pages/<YourPageName>/index.jsx`.
2. **Setup Routing**: Open `src/App.jsx`.
3. **Lazy Load**: Import your component at the top of the file: 
   ```javascript
   const YourPageName = lazy(() => import('./pages/YourPageName'))
   ```
4. **Mount Route**: Add your new route inside the `<ProtectedRoute>` and `<RootLayout>` hierarchy:
   ```javascript
   <Route element={<ProtectedRoute />}>
     <Route element={<RootLayout />}>
       <Route path="/dashboard" element={<Dashboard />} />
       {/* 🟢 Add your new route here */}
       <Route path="/your-new-route" element={<YourPageName />} />
     </Route>
   </Route>
   ```
5. **Access Auth State**: Inside your new component, simply import and use the global `AuthContext` to get the current user data:
   ```javascript
   import { useAuth } from '../../contexts/AuthContext';
   const { user } = useAuth();
   ```

---

## ⚙️ Environment Variables (.env)

Create a `.env` file in the root of this `my-project/` directory using the following template:

```env
# API Base URL (must point to your backend API, e.g., http://localhost:8080/api/v1)
VITE_API_BASE_URL=

# Google OAuth Client ID (Get this from Google Cloud Console)
VITE_GOOGLE_CLIENT_ID=
```

---

## 🚀 Setup Instructions

Follow these exact steps in your terminal to get the frontend development server running locally.

**1. Clone the repository and navigate to the frontend folder**
```bash
git clone https://github.com/your-org/your-repo-name.git
cd your-repo-name/my-project
```

**2. Install Dependencies**
```bash
npm install
```

**3. Configure Environment Variables**
Create a new `.env` file and configure your API URL and secrets.
```bash
touch .env
# Open .env in your editor and paste the template variables provided above
```

**4. Start the Development Server**
```bash
npm run dev
```

The app will start and be available at `http://localhost:5173`.
