# Caching & Refresh Control

## Overview
To reduce Firestore reads and improve performance, caching has been implemented for both categories and menu items.

## How It Works

### Caching Duration
- **Cache Duration**: 30 seconds
- Data is cached in memory after the first fetch
- Subsequent requests within 30 seconds return cached data
- After 30 seconds, fresh data is fetched from Firestore

### Cache Invalidation
Cache is automatically invalidated when:
- A new item/category is added
- An item/category is updated
- An item/category is deleted
- Item order is changed

### Benefits
1. **Reduced Firestore Reads**: Saves on Firebase quota and costs
2. **Faster Load Times**: Cached data loads instantly
3. **Better UX**: Less waiting for data to load

## Console Logs
You'll see these logs in the browser console:
- `"Returning cached categories"` - Data served from cache
- `"Fetching categories from Firestore"` - Fresh data fetched
- `"Returning cached menu items"` - Items served from cache
- `"Fetching menu items from Firestore"` - Fresh items fetched

## Manual Cache Invalidation
If needed, you can manually clear the cache:

```typescript
import { invalidateCategoriesCache } from '@/lib/categoryService';
import { invalidateItemsCache } from '@/lib/menuService';

// Clear categories cache
invalidateCategoriesCache();

// Clear items cache
invalidateItemsCache();
```

## Refresh Control
A refresh control utility is available in `/src/lib/refreshControl.ts` that can be used to prevent excessive page refreshes (2-second cooldown between refreshes).

## Configuration
To change cache duration, edit these files:
- `/src/lib/categoryService.ts` - Line 17: `const CACHE_DURATION = 30000;`
- `/src/lib/menuService.ts` - Line 19: `const CACHE_DURATION = 30000;`

Value is in milliseconds (30000 = 30 seconds).
