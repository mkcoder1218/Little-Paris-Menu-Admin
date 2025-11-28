import { collection, addDoc, serverTimestamp, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "./firebaseConfig";

export interface DishData {
  name: string;
  price: number;
  category: string;
  description: string;
  imageBase64: string; // Base64 encoded image
}

export interface UploadProgress {
  stage: 'encoding' | 'firestore';
  progress: number; // 0-100
  message: string;
}

/**
 * Compresses an image file to ensure it fits within Firestore limits (< 700KB base64).
 * It resizes the image if it's too large and adjusts JPEG quality.
 */
export const compressImage = (file: File, maxWidth = 800, maxSizeBytes = 700 * 1024): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Resize if larger than maxWidth
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);

        // Start with high quality
        let quality = 0.9;
        let base64 = canvas.toDataURL('image/jpeg', quality);

        // Reduce quality until it fits
        while (base64.length > maxSizeBytes && quality > 0.1) {
          quality -= 0.1;
          base64 = canvas.toDataURL('image/jpeg', quality);
        }

        resolve(base64);
      };
      
      img.onerror = (error) => reject(error);
    };
    
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Converts a File to base64 string (Legacy wrapper, prefer compressImage)
 */
export const fileToBase64 = (file: File, onProgress?: (progress: number) => void): Promise<string> => {
  // We use compressImage by default now to ensure safety
  if (onProgress) onProgress(50); // Fake progress for compatibility
  return compressImage(file).then(res => {
    if (onProgress) onProgress(100);
    return res;
  });
};


/**
 * Complete upload workflow: Convert to base64 → Save to Firestore
 * @param file The image file to upload
 * @param dishData Dish metadata (without imageBase64)
 * @param onProgress Callback for overall progress updates
 */
export const uploadDishWithBase64 = async (
  file: File,
  dishData: Omit<DishData, "imageBase64">,
  onProgress?: (update: UploadProgress) => void
): Promise<string> => {
  try {
    // Step 1: Convert to base64
    onProgress?.({
      stage: 'encoding',
      progress: 0,
      message: 'Encoding image...'
    });

    const base64String = await fileToBase64(file, (progress) => {
      onProgress?.({
        stage: 'encoding',
        progress,
        message: `Encoding image: ${progress}%`
      });
    });

    // Step 2: Save to Firestore
    onProgress?.({
      stage: 'firestore',
      progress: 0,
      message: 'Saving dish data...'
    });

    const docRef = await addDoc(collection(db, "dishes"), {
      ...dishData,
      imageBase64: base64String,
      createdAt: serverTimestamp(),
    });

    onProgress?.({
      stage: 'firestore',
      progress: 100,
      message: 'Dish added successfully!'
    });

    return docRef.id;
  } catch (error) {
    console.error("Error in upload workflow:", error);
    throw error;
  }
};

/**
 * Saves the dish data to the 'dishes' collection in Firestore.
 * @param data The dish data object.
 */
export const addDishToFirestore = async (data: DishData) => {
  try {
    const docRef = await addDoc(collection(db, "dishes"), {
      ...data,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding dish:", error);
    throw error;
  }
};

/**
 * Fetch all dishes from Firestore
 */
export const getAllDishes = async (): Promise<(DishData & { id: string })[]> => {
  try {
    const dishesQuery = query(collection(db, "dishes"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(dishesQuery);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as DishData)
    }));
  } catch (error) {
    console.error("Error fetching dishes:", error);
    throw error;
  }
};

