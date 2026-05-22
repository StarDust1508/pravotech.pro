import { useState, useEffect, useCallback } from "react";

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
}

const LS_KEYS = {
  name: "user_profile_name",
  email: "user_profile_email",
  phone: "user_profile_phone",
  deviceId: "user_device_id",
  greetingShown: "user_greeting_shown",
} as const;

function getDeviceId(): string {
  let id = localStorage.getItem(LS_KEYS.deviceId);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(LS_KEYS.deviceId, id);
  }
  return id;
}

function readLocal(): UserProfile {
  return {
    name: localStorage.getItem(LS_KEYS.name) || "",
    email: localStorage.getItem(LS_KEYS.email) || "",
    phone: localStorage.getItem(LS_KEYS.phone) || "",
  };
}

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile>(readLocal);

  /* Background sync from API on mount */
  useEffect(() => {
    const deviceId = getDeviceId();
    fetch(`/api/user-profile?device_id=${deviceId}`)
      .then((r) => r.json())
      .then((remote: UserProfile) => {
        if (remote.name || remote.email || remote.phone) {
          localStorage.setItem(LS_KEYS.name, remote.name);
          localStorage.setItem(LS_KEYS.email, remote.email);
          localStorage.setItem(LS_KEYS.phone, remote.phone);
          setProfile(remote);
        }
      })
      .catch(() => {});
  }, []);

  const save = useCallback(async (data: UserProfile) => {
    localStorage.setItem(LS_KEYS.name, data.name);
    localStorage.setItem(LS_KEYS.email, data.email);
    localStorage.setItem(LS_KEYS.phone, data.phone);
    setProfile(data);

    const deviceId = getDeviceId();
    await fetch("/api/user-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ device_id: deviceId, ...data }),
    }).catch(() => {});
  }, []);

  const greeting = (() => {
    const h = new Date().getHours();
    if (h >= 5 && h < 12) return "Доброе утро";
    if (h >= 12 && h < 17) return "Добрый день";
    if (h >= 17 && h < 22) return "Добрый вечер";
    return "Доброй ночи";
  })();

  const isGreetingShown = localStorage.getItem(LS_KEYS.greetingShown) === "1";
  const markGreetingShown = useCallback(() => {
    localStorage.setItem(LS_KEYS.greetingShown, "1");
  }, []);

  return {
    ...profile,
    greeting,
    save,
    isGreetingShown,
    markGreetingShown,
  };
}
