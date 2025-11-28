# System Architecture - Firebase + Cloudinary Integration

## 🏗️ Complete System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER INTERFACE                            │
│                                                                   │
│  ┌──────────────────┐              ┌──────────────────┐         │
│  │  Admin Upload    │              │   Menu Display    │         │
│  │   /admin/add-dish│              │      /menu        │         │
│  └──────────────────┘              └──────────────────┘         │
│         │                                    │                    │
│         │                                    │                    │
└─────────┼────────────────────────────────────┼───────────────────┘
          │                                    │
          ▼                                    ▼
┌─────────────────────┐              ┌─────────────────────┐
│  DishUploadForm.tsx │              │   DishCard.tsx      │
│                     │              │                     │
│  - Image picker     │              │  - Cloudinary URL   │
│  - Form validation  │              │  - Lazy Loading     │
│  - Progress tracker │              │  - Animations       │
└─────────────────────┘              │  - Hover Effects    │
          │                          └─────────────────────┘
          │                                    ▲
          ▼                                    │
┌─────────────────────────────────────────────────────────┐
│                  uploadDishWithCloudinary()              │
│                                                          │
│  Stage 1: Firebase Storage ────────────────────┐       │
│     └─ Upload original image                   │       │
│     └─ Get downloadURL                         │       │
│                                                 │       │
│  Stage 2: Cloudinary CDN ──────────────────────┤       │
│     └─ Upload file (unsigned)                  │       │
│     └─ Auto-optimize (WebP, compress)          │       │
│     └─ Get secure_url + public_id              │       │
│                                                 │       │
│  Stage 3: Firestore Database ──────────────────┘       │
│     └─ Save both URLs + metadata                       │
└─────────────────────────────────────────────────────────┘
          │
          │  Saves to:
          ▼
┌──────────────────────────────────────────────────────────────┐
│                      DATA STORAGE LAYER                        │
│                                                                │
│  ┌────────────────────┐  ┌──────────────────┐  ┌────────────┐│
│  │  Firebase Storage  │  │  Cloudinary CDN  │  │  Firestore ││
│  │                    │  │                  │  │            ││
│  │  Original Images   │  │  Optimized       │  │  Metadata  ││
│  │  (Full Quality)    │  │  - WebP format   │  │            ││
│  │  - Backup          │  │  - Compressed    │  │ {          ││
│  │  - Archival        │  │  - Resized       │  │   name     ││
│  │                    │  │  - CDN cached    │  │   price    ││
│  │  gs://bucket/      │  │                  │  │   category ││
│  │    dishes/xxx.jpg  │  │  res.cloudinary  │  │   imageUrl ││
│  │                    │  │    .com/...      │  │   cloudURL ││
│  └────────────────────┘  └──────────────────┘  │   publicId ││
│                                                 │   created  ││
│                                                 │ }          ││
│                                                 └────────────┘│
└──────────────────────────────────────────────────────────────┘
          │
          │  Fetched by:
          ▼
┌──────────────────────────────────────────────────────────────┐
│                  DATA FETCHING LAYER                          │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐  │
│  │        React Query (@tanstack/react-query)             │  │
│  │                                                         │  │
│  │  useQuery({                                            │  │
│  │    queryKey: ['dishes'],                               │  │
│  │    queryFn: getAllDishes,                              │  │
│  │    staleTime: 5 min,                                   │  │
│  │    cache: true                                         │  │
│  │  })                                                    │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                                │
│  getAllDishes() → Firestore.getDocs('dishes')                │
└──────────────────────────────────────────────────────────────┘
          │
          │  Renders to:
          ▼
┌──────────────────────────────────────────────────────────────┐
│                    RENDERING LAYER                            │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐  │
│  │              Next.js Image Component                   │  │
│  │                                                         │  │
│  │  <Image                                                │  │
│  │    src={cloudinaryUrl}  ← Optimized CDN URL            │  │
│  │    loading="lazy"       ← Viewport detection           │  │
│  │    sizes="..."          ← Responsive sizing            │  │
│  │    fill                 ← Fills container              │  │
│  │  />                                                    │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                                │
│  Framer Motion Animations:                                    │
│  - Float (Y-axis): [0, -10, 0]                                │
│  - Hover Scale: 1.0 → 1.1                                     │
│  - Fade In: opacity 0 → 1                                     │
└──────────────────────────────────────────────────────────────┘
```

## 🔄 Upload Workflow Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                       UPLOAD FLOW                             │
└──────────────────────────────────────────────────────────────┘

Step 1: User Action
   │
   ├─ Select image file (max 10MB)
   ├─ Fill name, price, category, description
   └─ Click "Upload Dish"
   │
   ▼

Step 2: Client-Side Upload
   │
   ├─ Validate file type (image/*)
   ├─ Validate file size (<10MB)
   └─ Create preview (blob URL)
   │
   ▼

Step 3: Firebase Storage Upload [Progress: 0-33%]
   │
   ├─ Generate unique filename
   ├─ Upload to gs://bucket/dishes/
   ├─ Get downloadURL
   │
   │  Progress Callback:
   │  ┌────────────────────────────────┐
   │  │ Firebase Storage: 15% ████░░░░ │
   │  └────────────────────────────────┘
   │
   ▼

Step 4: Cloudinary Upload [Progress: 33-66%]
   │
   ├─ Send file to Cloudinary API
   ├─ Uses unsigned upload preset
   ├─ Cloudinary auto-optimizes:
   │  • Converts to WebP
   │  • Compresses (quality: auto)
   │  • Resizes if needed
   │  • Stores in CDN
   │
   │  Progress Callback:
   │  ┌────────────────────────────────┐
   │  │ Cloudinary CDN: 45% █████░░░░░ │
   │  └────────────────────────────────┘
   │
   ├─ Returns secure_url
   └─ Returns public_id
   │
   ▼

Step 5: Firestore Save [Progress: 66-100%]
   │
   ├─ Create document in 'dishes' collection
   ├─ Save data:
   │  {
   │    name: "Truffle Pasta",
   │    price: 24.99,
   │    category: "Mains",
   │    description: "...",
   │    imageUrl: "https://firebasestorage...",
   │    cloudinaryUrl: "https://res.cloudinary...",
   │    cloudinaryPublicId: "dishes/xxx",
   │    createdAt: serverTimestamp()
   │  }
   │
   │  Progress Callback:
   │  ┌────────────────────────────────┐
   │  │ Database: 100% ████████████████│
   │  │ ✓ Dish added successfully!     │
   │  └────────────────────────────────┘
   │
   ▼

Step 6: Success
   │
   ├─ Show success message
   ├─ Reset form
   └─ Clear preview
```

## 🌐 Display & Fetching Flow

```
┌──────────────────────────────────────────────────────────────┐
│                      DISPLAY FLOW                             │
└──────────────────────────────────────────────────────────────┘

Step 1: Page Load (/menu)
   │
   ├─ MenuPage component mounts
   └─ QueryProvider wraps app
   │
   ▼

Step 2: React Query Hook
   │
   useQuery({
     queryKey: ['dishes'],
     queryFn: getAllDishes
   })
   │
   ├─ Check cache (5 min stale time)
   │  ├─ If fresh: Return cached data ⚡️
   │  └─ If stale: Fetch new data
   │
   ▼

Step 3: Firestore Query
   │
   getAllDishes()
   │
   ├─ Query Firestore collection('dishes')
   ├─ Order by createdAt DESC
   └─ Return array of dishes
   │
   ▼

Step 4: Render Grid
   │
   dishes.map((dish) => 
     <DishCard dish={dish} />
   )
   │
   ├─ Grid: 1 col (mobile)
   ├─ Grid: 2 cols (tablet)
   └─ Grid: 3 cols (desktop)
   │
   ▼

Step 5: DishCard Component
   │
   For each dish:
   │
   ├─ Select URL:
   │  ├─ cloudinaryUrl? → Use it (optimized) ✅
   │  └─ else → Use imageUrl (Firebase)
   │
   ├─ Build Cloudinary URL:
   │  buildCloudinaryUrl(publicId, {
   │    width: 400,
   │    quality: 'auto',
   │    format: 'auto'
   │  })
   │  Result: "...w_400,q_auto,f_auto/dishes/xxx"
   │
   ├─ Next.js <Image>:
   │  • Lazy loading (viewport detection)
   │  • Responsive sizes
   │  • Optimization
   │
   └─ Framer Motion:
      • Fade in on mount
      • Floating animation
      • Scale on hover
   │
   ▼

Step 6: User Interaction
   │
   ├─ Scroll: Lazy load more images
   ├─ Hover: Show animations
   └─ Click: Order button action
```

## 🔐 Security Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                            │
└──────────────────────────────────────────────────────────────┘

Client Side (Browser)
   │
   ├─ Environment Variables:
   │  • NEXT_PUBLIC_* (exposed to client) ✅
   │  • No secrets exposed
   │
   ├─ Cloudinary:
   │  • Unsigned upload preset (no secret needed)
   │  • Upload limits enforced by Cloudinary
   │
   ├─ Firebase:
   │  • Public config (safe to expose)
   │  • Security rules on Firestore/Storage
   │
   └─ Upload Validation:
      • File type check (image/*)
      • File size limit (10MB)
      • Client-side sanitization

Server Side (Next.js)
   │
   ├─ Environment Variables:
   │  • CLOUDINARY_API_SECRET (server-only)
   │  • FIREBASE_PRIVATE_KEY (server-only)
   │
   ├─ API Routes:
   │  • Optional server-side operations
   │  • Admin authentication
   │
   └─ Firebase Admin SDK:
      • Server-side verification
      • Enhanced security

Firebase Security Rules
   │
   ├─ Storage Rules:
   │  // Allow reads to all
   │  match /dishes/{image} {
   │    allow read;
   │    allow write: if request.auth != null; // Future
   │  }
   │
   └─ Firestore Rules:
      // Allow reads to all
      match /dishes/{dish} {
        allow read;
        allow create, update, delete: if request.auth != null; // Future
      }

Cloudinary Security
   │
   ├─ Unsigned Preset:
   │  • No API secret exposed
   │  • Upload limits configured in dashboard
   │  • Folder restrictions
   │
   └─ Transformations:
      • CDN-based (no server processing)
      • Automatic format/quality
```

## 📊 Data Flow Summary

```
Upload: Browser → Firebase → Cloudinary → Firestore → Success
         │         │          │            │
         File      Original   Optimized    Both URLs
                   Backup     CDN          + Metadata

Display: Browser → React Query → Firestore → Cloudinary CDN
         │         │             │            │
         Request   Cache Check   Metadata     Optimized Image
```

## ⚡ Performance Optimizations

```
┌──────────────────────────────────────────────────────────────┐
│              PERFORMANCE OPTIMIZATION LAYERS                  │
└──────────────────────────────────────────────────────────────┘

Level 1: Network
   │
   ├─ Cloudinary CDN
   │  • Global edge caching
   │  • Automatic compression
   │  • WebP format (~70% smaller)
   │
   └─ Firebase Firestore
      • Document-level caching
      • Indexed queries

Level 2: Application
   │
   ├─ React Query
   │  • 5 min cache
   │  • Deduplication
   │  • Background refetch
   │
   └─ Next.js
      • Static optimization
      • Code splitting
      • Tree shaking

Level 3: Image
   │
   ├─ Lazy Loading
   │  • Viewport detection
   │  • Progressive loading
   │  • Skeleton placeholders
   │
   └─ Responsive Images
      • Multiple sizes
      • Device-appropriate
      • Bandwidth-aware

Level 4: Rendering
   │
   ├─ Framer Motion
   │  • GPU acceleration
   │  • Transform optimizations
   │  • Layout animations
   │
   └─ CSS Animations
      • Hardware-accelerated
      • Will-change hints
      • Efficient keyframes
```

---

**This architecture ensures:**
- ✅ Scalability (CDN + Cloud Storage)
- ✅ Performance (Optimized images + Caching)
- ✅ Reliability (Dual storage: Firebase + Cloudinary)
- ✅ Security (Unsigned uploads + Firebase rules)
- ✅ User Experience (Progress tracking + Animations)

