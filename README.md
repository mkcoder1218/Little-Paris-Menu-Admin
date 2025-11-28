# QR Menu System - Base64 Image Integration

A modern restaurant menu system with base64 image storage in Firestore, built with Next.js 13 App Router, TypeScript, and TailwindCSS.

## ✨ Features

### 🔥 Firebase Integration
- **Firestore Database**: Stores complete dish metadata including base64 images
- **Real-time sync**: Automatic updates across all clients

### 🎨 Frontend Features
- **Responsive grid**: Beautiful dish display on all devices
- **Lazy loading**: Images load only when visible
- **Anti-gravity effects**: Smooth floating animations
- **Hover interactions**: Scale and shadow effects
- **Next.js Image**: Optimized image component
- **React Query**: Efficient data fetching and caching
- **Premium Design**: Modern glassmorphism and gradients

### 📤 Upload Workflow
1. Admin uploads image + metadata
2. Image converted to Base64 string
3. Base64 string + metadata saved to Firestore
4. Real-time progress tracking with visual feedback

## 🚀 Tech Stack

- **Framework**: Next.js 13 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Backend**: Firebase (Firestore)
- **Data Fetching**: React Query (@tanstack/react-query)
- **Animations**: Framer Motion
- **Icons**: Lucide React

## 📋 Prerequisites

1. **Node.js** (v18 or higher)
2. **Firebase Account** with a project created

## 🛠️ Setup Instructions

### 1. Clone and Install

```bash
cd /Users/apple/Documents/QRSystem
npm install
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing
3. Enable **Firestore Database**:
   - Go to Firestore Database → Create Database
   - Start in production mode
4. Get your Firebase config:
   - Project Settings → General
   - Copy the config values

### 3. Environment Variables

Create a `.env.local` file in the root directory with:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/
│   ├── admin/
│   │   └── add-dish/         # Admin upload page
│   ├── menu/
│   │   └── page.tsx          # Public menu page
│   └── layout.tsx            # Root layout with providers
├── components/
│   ├── admin/
│   │   └── DishUploadForm.tsx  # Upload form with progress
│   ├── menu/
│   │   └── DishCard.tsx       # Dish card with animations
│   └── providers/
│       └── QueryProvider.tsx   # React Query provider
└── lib/
    ├── firebaseConfig.ts      # Firebase initialization
    └── uploadUtils.ts         # Base64 upload workflow
```

## 🎯 Usage

### Admin Upload

1. Navigate to `/admin/add-dish`
2. Click to upload an image (max 700KB)
3. Fill in dish details:
   - Name
   - Price
   - Category
   - Description
4. Click "Upload Dish"
5. Watch the progress:
   - ✓ Image Encoding
   - ✓ Firestore Database

### View Menu

1. Navigate to `/menu`
2. See all dishes in a responsive grid
3. Hover over dishes for anti-gravity effect
4. Images are lazy-loaded as you scroll

## 📝 License

MIT

---

Built with ❤️ using Next.js and Firebase
