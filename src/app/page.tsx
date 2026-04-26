"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FCM_RUNTIME_VAPID_KEY, FIREBASE_RUNTIME_CONFIG_KEY } from "@/lib/firebaseConfig";

type FirebaseFormState = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  vapidKey: string;
};

const EMPTY_FORM: FirebaseFormState = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  vapidKey: "",
};

export default function Home() {
  const [form, setForm] = useState<FirebaseFormState>(EMPTY_FORM);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    const raw = window.localStorage.getItem(FIREBASE_RUNTIME_CONFIG_KEY);
    const runtimeVapidKey = window.localStorage.getItem(FCM_RUNTIME_VAPID_KEY) ?? "";

    if (!raw) {
      setForm((prev) => ({ ...prev, vapidKey: runtimeVapidKey }));
      return;
    }

    try {
      const parsed = JSON.parse(raw) as Partial<FirebaseFormState>;
      setForm({
        apiKey: parsed.apiKey ?? "",
        authDomain: parsed.authDomain ?? "",
        projectId: parsed.projectId ?? "",
        storageBucket: parsed.storageBucket ?? "",
        messagingSenderId: parsed.messagingSenderId ?? "",
        appId: parsed.appId ?? "",
        vapidKey: runtimeVapidKey,
      });
    } catch {
      setStatusMessage("Fant ugyldig lokal Firebase-konfig. Fyll inn på nytt.");
    }
  }, []);

  const requiredMissing = useMemo(() => {
    return !(form.apiKey && form.authDomain && form.projectId && form.appId);
  }, [form.apiKey, form.authDomain, form.projectId, form.appId]);

  function setField<K extends keyof FirebaseFormState>(key: K, value: FirebaseFormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function saveRuntimeConfig() {
    const payload = {
      apiKey: form.apiKey.trim(),
      authDomain: form.authDomain.trim(),
      projectId: form.projectId.trim(),
      storageBucket: form.storageBucket.trim(),
      messagingSenderId: form.messagingSenderId.trim(),
      appId: form.appId.trim(),
    };

    if (!payload.apiKey || !payload.authDomain || !payload.projectId || !payload.appId) {
      setStatusMessage("Mangler obligatoriske felt: apiKey, authDomain, projectId eller appId.");
      return;
    }

    window.localStorage.setItem(FIREBASE_RUNTIME_CONFIG_KEY, JSON.stringify(payload));

    if (form.vapidKey.trim()) {
      window.localStorage.setItem(FCM_RUNTIME_VAPID_KEY, form.vapidKey.trim());
    } else {
      window.localStorage.removeItem(FCM_RUNTIME_VAPID_KEY);
    }

    setStatusMessage("Firebase-konfig lagret lokalt. Last siden på nytt i parent/child for å bruke den.");
  }

  function clearRuntimeConfig() {
    window.localStorage.removeItem(FIREBASE_RUNTIME_CONFIG_KEY);
    window.localStorage.removeItem(FCM_RUNTIME_VAPID_KEY);
    setForm(EMPTY_FORM);
    setStatusMessage("Lokal Firebase-konfig er fjernet.");
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-4 py-8 md:px-8 md:py-10">
      <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">ukelonn-public</p>
        <h1 className="mt-2 text-3xl font-black text-slate-900 md:text-4xl">Klar for deling og oppstart</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-600 md:text-base">
          Denne startsiden er inngangen for nye familier. Her finner du lenker til parent/child, en Firebase-guide og et valgfritt skjema for lokal runtime-konfig.
        </p>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Link
            className="rounded-xl bg-slate-900 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-slate-700"
            href="/parent"
          >
            Åpne parent
          </Link>
          <Link
            className="rounded-xl border border-slate-300 px-5 py-3 text-center text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
            href="/child"
          >
            Åpne child
          </Link>
        </div>
      </section>

      <section className="rounded-2xl border border-sky-200 bg-sky-50 p-5 md:p-8">
        <h2 className="text-xl font-bold text-sky-900">Kom i gang med Firebase</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-sky-950">
          <li>Opprett et Firebase-prosjekt i Firebase Console.</li>
          <li>Aktiver Authentication (Email/Password) og opprett minst én forelder-bruker.</li>
          <li>Aktiver Cloud Firestore (Production eller Test mode).</li>
          <li>Aktiver Cloud Messaging og kopier Web Push certificate (VAPID key).</li>
          <li>Opprett en Web App i prosjektet og kopier Firebase Web SDK-konfig.</li>
          <li>Deploy Cloud Functions fra functions-mappen for push-regler og påminnelser.</li>
        </ol>

        <div className="mt-4 rounded-xl border border-sky-200 bg-white p-4 text-sm text-slate-700">
          <p className="font-semibold text-slate-900">Hvor informasjonen brukes i koden</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Firebase app-konfig leses fra NEXT_PUBLIC_FIREBASE_* variabler eller lokal runtime-konfig.</li>
            <li>FCM VAPID key leses fra NEXT_PUBLIC_FCM_VAPID_KEY eller lokal runtime-konfig.</li>
            <li>Service worker for bakgrunnsvarsler leser firebase-config.json i public-mappen.</li>
            <li>Både parent og child bruker samme Firestore-struktur under families/family-default.</li>
          </ul>
        </div>
      </section>

      <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 md:p-8">
        <h2 className="text-xl font-bold text-emerald-900">Valgfritt: legg inn Firebase-konfig her</h2>
        <p className="mt-2 text-sm text-emerald-950">
          Dette lagrer konfig i nettleserens localStorage. For produksjon anbefales fortsatt NEXT_PUBLIC_ variabler i miljø.
        </p>

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          <input value={form.apiKey} onChange={(e) => setField("apiKey", e.target.value)} placeholder="apiKey *" className="rounded-lg border border-emerald-300 bg-white px-3 py-2 text-sm" />
          <input value={form.authDomain} onChange={(e) => setField("authDomain", e.target.value)} placeholder="authDomain *" className="rounded-lg border border-emerald-300 bg-white px-3 py-2 text-sm" />
          <input value={form.projectId} onChange={(e) => setField("projectId", e.target.value)} placeholder="projectId *" className="rounded-lg border border-emerald-300 bg-white px-3 py-2 text-sm" />
          <input value={form.storageBucket} onChange={(e) => setField("storageBucket", e.target.value)} placeholder="storageBucket" className="rounded-lg border border-emerald-300 bg-white px-3 py-2 text-sm" />
          <input value={form.messagingSenderId} onChange={(e) => setField("messagingSenderId", e.target.value)} placeholder="messagingSenderId" className="rounded-lg border border-emerald-300 bg-white px-3 py-2 text-sm" />
          <input value={form.appId} onChange={(e) => setField("appId", e.target.value)} placeholder="appId *" className="rounded-lg border border-emerald-300 bg-white px-3 py-2 text-sm" />
          <input value={form.vapidKey} onChange={(e) => setField("vapidKey", e.target.value)} placeholder="FCM VAPID key (valgfri her, anbefalt)" className="rounded-lg border border-emerald-300 bg-white px-3 py-2 text-sm md:col-span-2" />
        </div>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <button onClick={saveRuntimeConfig} className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-800">
            Lagre runtime-konfig
          </button>
          <button onClick={clearRuntimeConfig} className="rounded-lg border border-emerald-400 px-4 py-2 text-sm font-semibold text-emerald-900 hover:bg-emerald-100">
            Fjern runtime-konfig
          </button>
        </div>

        <p className="mt-2 text-xs text-emerald-900">
          {requiredMissing ? "Obligatoriske felt mangler." : "Obligatoriske felt ser utfylt ut."}
        </p>
        {statusMessage && <p className="mt-1 text-xs font-medium text-emerald-900">{statusMessage}</p>}
      </section>
    </main>
  );
}
