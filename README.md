# SnapBuy Admin & Seller Dashboard

SnapBuy Admin & Seller Dashboard is a production-style web dashboard for managing a multi-seller e-commerce platform. It connects directly to Firebase Authentication and Cloud Firestore, supports role-based access, and gives admins and approved sellers separate workflows for products, orders, seller applications, users, and platform settings.

## Overview

This project exists to power the operational side of SnapBuy. Admins can review sellers, manage marketplace data, and monitor platform activity. Sellers can apply for access, manage their own products, review related orders, and update dashboard preferences after approval.

The dashboard is built with a responsive, dark-mode-ready UI and a Firebase-first data model so it can work with real marketplace data instead of mock records.

## Key Features

- Firebase Authentication with role-based redirects
- Admin, seller, pending, rejected, and unregistered access states
- Real Firestore products, orders, users, and seller applications
- Admin approval, rejection, and seller removal workflow
- Seller-owned product and order filtering
- Google Drive URL based product image handling
- Product add/edit forms with live image preview
- Order status updates written to Firestore
- Responsive dashboard layout with mobile sidebar drawer
- Global light/dark theme with localStorage persistence
- Search and filtering on data pages

## Admin Features

- View platform dashboard stats
- Review all products and orders
- Approve or reject seller applications
- Remove seller dashboard access while keeping buyer accounts
- View registered users
- Update order statuses
- Access admin-specific settings

## Seller Features

- Register with buyer profile and shop details
- Wait on pending approval before dashboard access
- View seller dashboard stats after approval
- Add and edit products owned by the seller
- View seller-related orders
- Use Google Drive product image links
- Access seller-specific settings and shop profile data

## Authentication And Role System

Role detection is based on Firebase Auth plus Firestore documents:

- `admins/{uid}` exists: admin
- `sellerApplications/{uid}.status == "approved"`: seller dashboard access
- `sellerApplications/{uid}.status == "pending"`: pending approval page
- `sellerApplications/{uid}.status == "rejected"`: rejected seller state
- No admin or seller application: seller registration flow

The auth context caches the current Firebase user, role, admin profile, seller profile, user profile, and seller context so layout components and pages do not repeatedly refetch role information.

## Firebase Database Structure

Main Firestore collections:

```text
admins/{uid}
users/{uid}
sellerApplications/{uid}
products/{productId}
orders/{orderId}
```

Important ownership fields:

```text
products.sellerId
products.sellerName
products.shopName
products.sellerEmail

orders.sellerIds
orders.sellerId
orders.items[].sellerId
orders.items[].sellerName
orders.items[].shopName
```

Legacy seller matching supports older products and orders that were saved with a shop name but no seller UID. New products store `sellerId`, `sellerName`, `shopName`, and `sellerEmail`.

## Product Image Handling

Product images are saved as Firestore `imageUrl` strings. The dashboard does not upload product images to Firebase Storage.

Supported Google Drive formats include:

```text
https://drive.google.com/file/d/FILE_ID/view
https://drive.google.com/open?id=FILE_ID
https://drive.google.com/uc?id=FILE_ID
https://drive.google.com/thumbnail?id=FILE_ID
```

The UI converts Google Drive share links into display candidates and falls back to a clean placeholder if an image cannot load.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui style components
- Firebase Authentication
- Cloud Firestore
- Firebase client SDK
- Lucide React icons

## Project Structure

```text
src/
  app/
    dashboard/
    login/
    orders/
    pending-approval/
    products/
    register-seller/
    sellers/
    settings/
    users/
    globals.css
    layout.tsx
    page.tsx
  components/
    common/
    dashboard/
    layout/
    orders/
    products/
    providers/
    sellers/
    settings/
    ui/
    users/
  hooks/
  lib/
  services/
  types/
scripts/
public/
```

## Environment Variables

Create `.env.local` in the project root and add your Firebase web app values:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

Do not commit `.env.local` or Firebase service account files.

## Setup

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

Build for production:

```bash
npm run build
```

Start the production build:

```bash
npm run start
```

Run TypeScript checks:

```bash
npm run lint
```

## Firestore Collections Used

- `admins`: admin access profiles
- `users`: buyer/general user profiles
- `sellerApplications`: seller application and shop profiles
- `products`: marketplace product catalog
- `orders`: customer order records

## Security Notes

- Firebase project values are read from public client environment variables, as required by the Firebase web SDK.
- Admin-only actions should also be protected by Firestore security rules.
- Seller removal deletes the seller application document and marks the user as no longer a seller; it does not delete Firebase Authentication users from the frontend.
- Product images are linked from Google Drive and remain owned by the uploader.
- Service account keys are for local/admin scripts only and must never be committed.

## Current Limitations

- Product images use Google Drive links only; there is no dashboard image upload flow.
- Some legacy seller ownership matching relies on normalized shop names for older records.
- Dashboard charts are intentionally lightweight and can be expanded later.
- Email notifications for seller approval are not implemented in this frontend.

## Future Improvements

- Add richer analytics and charting
- Add server-side admin tooling for account deletion if needed
- Add automated tests for role-based page access
- Add email notifications for seller application status changes
- Add pagination for very large products, orders, users, and seller application collections

## License

All rights reserved.

This project is provided for portfolio and demonstration purposes only. No permission is granted to copy, modify, distribute, use, or create derivative works from this project without written permission from the author.
