# Stash Space

A production-grade film gear and equipment management platform for producers, vendors, camera crew, and drivers.

## Tech Stack

- **Framework**: React 18 + TypeScript + Vite
- **UI**: shadcn/ui + Tailwind CSS
- **Auth & Backend**: Firebase
- **State**: Redux Toolkit
- **Routing**: React Router v6
- **Charts**: Recharts
- **Maps**: Leaflet / React Leaflet

## Getting Started

### 1. Clone the repository

```sh
git clone <YOUR_GIT_URL>
cd stash-space
```

### 2. Install dependencies

```sh
npm install
```

### 3. Configure environment variables

```sh
cp .env.example .env
# Then fill in your Firebase project values in .env
```

### 4. Start the development server

```sh
npm run dev
```

### 5. Build for production

```sh
npm run build
# Output goes to /dist
```

## Deployment

The project includes deployment config for both **Netlify** (`netlify.toml`) and **Vercel** (`vercel.json`) out of the box. Both handle the SPA redirect rule required for React Router.

### Environment Variables

Set all `VITE_FIREBASE_*` variables from `.env.example` on your deployment platform's environment settings.

### Firebase Auth

After deploying, add your deployment domain to **Firebase Console → Authentication → Settings → Authorized domains**.

## User Roles

| Role | Entry Path |
|------|-----------|
| Producer / Admin | `/producer/login` |
| Vendor | `/producer/vendor/login` |
| Camera Crew | `/producer/cameraman/login` |
| Driver | `/producer/driver/login` |
| Customer | `/customer/login` |
