importScripts("https://www.gstatic.com/firebasejs/12.10.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/12.10.0/firebase-messaging-compat.js");

async function loadFirebaseConfig() {
  try {
    const configUrl = new URL("./firebase-config.json", self.location.href);
    const response = await fetch(configUrl.toString(), { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Could not load ${configUrl}`);
    }
    return await response.json();
  } catch (error) {
    console.error("[FCM SW DEV] Failed to load firebase-config.json", error);
    return null;
  }
}

loadFirebaseConfig().then((firebaseConfig) => {
  if (!firebaseConfig) {
    return;
  }

  firebase.initializeApp(firebaseConfig);

  const messaging = firebase.messaging();
  messaging.onBackgroundMessage((payload) => {
    console.log("[FCM SW DEV] Background message:", payload);

    const title = payload.notification?.title ?? "Ukelonn";
    const body = payload.notification?.body ?? "";
    const icon = payload.notification?.icon ?? "/ukelonn/icon-192.png";

    self.registration.showNotification(title, {
      body,
      icon,
      badge: "/ukelonn/icon-192.png",
      data: payload.data ?? {},
    });
  });
});
