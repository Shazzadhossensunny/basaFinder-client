# 🏡 BasaFinder – Smart Rental & Housing Solution (Frontend)

Welcome to **BasaFinder**, a full-featured rental housing platform built with **Next.js (App Router)** and **TypeScript**, offering a seamless experience for landlords, tenants, and admins.

## 🌐 Live Website

**[Visit Now](https://basafinder-frontend-nextjs-project.vercel.app/)**

## 💻 GitHub Repository

**[Frontend GitHub Repo](https://github.com/Shazzadhossensunny/basaFinder-client)**

---

## 🚀 Features Overview

### 🔑 User Roles

- **Admin**: Manages users & listings.
- **Landlord**: Posts listings, reviews & approves requests.
- **Tenant**: Searches listings, submits rental requests & makes payments.

---

## 🏠 Home Page Highlights

- **Header** with logo & dynamic nav:
  - Home | About Us | All Rental Listings | Dashboard | Login/Register | My Profile
- **Hero Section**:
  - Catchy headline: _"Find Your Perfect Rental House Today!"_
  - “Post Rental House Info” CTA (for landlords)
  - Smart search: location, price, bedrooms
- **Listings Grid**: Each card shows image, description, rent, and a “View Details” button
- **Extras**: Testimonials, renting tips, informative footer

---

## 🔐 Authentication

- JWT-based login and registration
- User roles: Landlord or Tenant
- Form validation using React Hook Form and Zod

---

## 🧾 Forms and Pages

### ➕ Post Rental House Info (Landlord Only)

- Fields: location, description, rent, bedrooms, amenities, image upload

### 🧾 Rental House Details Page

- Full listing info with request button for tenants

### 📩 Rental Request Page (Tenant Only)

- Auto-filled user info + message + terms checkbox
- Submits request to landlord

### 💳 Payment Flow

- Landlord approves → Tenant sees payment option & landlord phone number
- Rejected → Request marked as “Rejected”

---

## 📊 Dashboards

### 🛡️ Admin Dashboard

- Manage users & listings (activate/deactivate/edit)

### 🏘️ Landlord Dashboard

- View/manage listings
- Approve/reject requests
- Initiate payment + share phone number

### 🧍 Tenant Dashboard

- View request statuses (pending, approved, rejected)
- Pay after approval, get landlord contact

---

## 👤 Common Features

- **Edit Profile**: Username, email, etc.
- **Change Password**: Securely update credentials

---

## 📘 About Us Page

- Mission, team, contact info

---

## 🔐 Routes Overview

### ✅ Public Routes:

- Home, About Us, Listings, FAQ, Terms, Privacy

### 🔒 Private Routes (Role-Based Access):

- Admin: Admin Dashboard
- Landlord: Dashboard, Post Listing, Manage Requests
- Tenant: Dashboard, Request Listings

---

## 🛠️ Tech Stack

- **Frontend**: Next.js (App Router), React, TypeScript, TailwindCSS
- **State Management**: Redux Toolkit, Redux Persist
- **Forms & Validation**: React Hook Form, Zod
- **Map Support**: React Leaflet, Leaflet
- **Charts**: Recharts
- **Auth**: JWT

---

## 📦 Installation

### 1. Clone the Repo

```bash
git clone https://github.com/Shazzadhossensunny/basaFinder-client.git
cd basaFinder-client
```

### 2. Install Dependencies

```bash
npm install
# or
yarn
```

### 3. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view in your browser.

---

## 🙌 Contributing

Pull requests are welcome. For major changes, please open an issue first.

---

## 📧 Contact

Maintained by **Shazzad Hossen Sunny**
Email: shazzadhossensunny@gmail.com
🌐 Website: [BasaFinder](https://basafinder-frontend-nextjs-project.vercel.app/)

---
