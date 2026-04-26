import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import {
  getMessaging,
  onBackgroundMessage,
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-messaging-sw.js";

async function loadFirebaseConfig() {
  try {
    const configUrl = new URL("./firebase-config.json", self.location.href);
    const response = await fetch(configUrl.toString(), { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Could not load ${configUrl}`);
    }
    return await response.json();
  } catch (error) {
    console.error("[FCM SW] Failed to load firebase-config.json", error);
    return null;
  }
}

console.log("[FCM SW] module service worker loaded at", self.location.pathname);

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

const firebaseConfig = await loadFirebaseConfig();
const messaging = firebaseConfig ? getMessaging(initializeApp(firebaseConfig)) : null;

function resolveNotificationLink(data) {
  const rawLink = typeof data?.link === "string" ? data.link : null;
  if (!rawLink) {
    return "/ukelonn/";
  }

  if (rawLink.startsWith("http://") || rawLink.startsWith("https://")) {
    return rawLink;
  }

  return rawLink.startsWith("/") ? rawLink : `/ukelonn/${rawLink}`;
}

if (messaging) {
  onBackgroundMessage(messaging, (payload) => {
    console.log("[FCM SW] Background message received:", payload);

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
}

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetLink = resolveNotificationLink(event.notification.data);
  const targetUrl = new URL(targetLink, self.location.origin).href;

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(async (windowClients) => {
      for (const client of windowClients) {
        if (!client.url.startsWith(self.location.origin)) {
          continue;
        }

        await client.navigate(targetUrl);
        await client.focus();
        return;
      }

      if (self.clients.openWindow) {
        await self.clients.openWindow(targetUrl);
      }
    })
  );
});
