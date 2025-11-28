import * as admin from "firebase-admin";

if (!admin.apps.length) {
  try {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
    
    // Use the bucket name exactly as provided in the environment variable
    // Some newer Firebase projects use .firebasestorage.app exclusively
    let storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

    // Clean up bucket name if it contains protocols
    if (storageBucket) {
      storageBucket = storageBucket.replace('gs://', '').replace('https://', '');
      // Remove trailing slashes
      if (storageBucket.endsWith('/')) {
        storageBucket = storageBucket.slice(0, -1);
      }
    }
    
    console.log('Initializing Firebase Admin with storage bucket:', storageBucket);

    if (!projectId || !clientEmail || !privateKey || !storageBucket) {
      console.error("Missing Firebase Admin credentials:", {
        hasProjectId: !!projectId,
        hasClientEmail: !!clientEmail,
        hasPrivateKey: !!privateKey,
        hasStorageBucket: !!storageBucket,
      });
      throw new Error("Missing required Firebase Admin environment variables");
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
      storageBucket,
    });
    
    console.log("Firebase Admin initialized successfully with bucket:", storageBucket);
  } catch (error) {
    console.error("Failed to initialize Firebase Admin:", error);
    throw error;
  }
}

export const adminStorage = admin.storage();
export const adminDb = admin.firestore();
