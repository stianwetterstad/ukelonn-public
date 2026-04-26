import type { FirebaseOptions } from "firebase/app";

export const FIREBASE_RUNTIME_CONFIG_KEY = "ukelonn.firebaseConfig";
export const FCM_RUNTIME_VAPID_KEY = "ukelonn.fcmVapidKey";

type FirebaseRuntimeConfig = FirebaseOptions;

function readFirebaseRuntimeConfig(): FirebaseRuntimeConfig | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(FIREBASE_RUNTIME_CONFIG_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as FirebaseRuntimeConfig;
    return parsed;
  } catch {
    return null;
  }
}

function buildConfigFromEnv(): FirebaseOptions {
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };
}

function hasRequiredFields(config: FirebaseOptions): boolean {
  return Boolean(config.apiKey && config.authDomain && config.projectId && config.appId);
}

export function getFirebaseClientConfig(): FirebaseOptions {
  const runtimeConfig = readFirebaseRuntimeConfig();
  if (runtimeConfig && hasRequiredFields(runtimeConfig)) {
    return runtimeConfig;
  }

  const envConfig = buildConfigFromEnv();
  if (hasRequiredFields(envConfig)) {
    return envConfig;
  }

  throw new Error(
    "Firebase config mangler. Sett NEXT_PUBLIC_FIREBASE_* variabler eller lagre runtime-konfig fra startsiden.",
  );
}

export function getFirebaseVapidKey(): string | null {
  if (typeof window !== "undefined") {
    const runtimeVapidKey = window.localStorage.getItem(FCM_RUNTIME_VAPID_KEY);
    if (runtimeVapidKey) {
      return runtimeVapidKey;
    }
  }

  return process.env.NEXT_PUBLIC_FCM_VAPID_KEY ?? null;
}