import { useState, useEffect, useCallback } from "react";
import { api, User } from "@/lib/api";

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
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  const isAuthenticated = !!authUser;

  /* Check user_token auth on mount */
  useEffect(() => {
    const token = localStorage.getItem("user_token");
    if (!token) {
      setAuthChecked(true);
      // Fall back to device_id profile
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
      return;
    }

    api.userAuth
      .me()
      .then((user) => {
        setAuthUser(user);
        const p: UserProfile = {
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
        };
        localStorage.setItem(LS_KEYS.name, p.name);
        localStorage.setItem(LS_KEYS.email, p.email);
        localStorage.setItem(LS_KEYS.phone, p.phone);
        setProfile(p);
      })
      .catch(() => {
        localStorage.removeItem("user_token");
        // Fall back to device_id
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
      })
      .finally(() => {
        setAuthChecked(true);
      });
  }, []);

  const save = useCallback(
    async (data: UserProfile) => {
      localStorage.setItem(LS_KEYS.name, data.name);
      localStorage.setItem(LS_KEYS.email, data.email);
      localStorage.setItem(LS_KEYS.phone, data.phone);
      setProfile(data);

      if (authUser) {
        // Authenticated: update via user-auth API
        try {
          const updated = await api.userAuth.updateMe({
            name: data.name,
            phone: data.phone,
          });
          setAuthUser(updated);
        } catch {
          // silent fail
        }
      } else {
        // Guest: update via device_id API
        const deviceId = getDeviceId();
        await fetch("/api/user-profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ device_id: deviceId, ...data }),
        }).catch(() => {});
      }
    },
    [authUser]
  );

  const login = useCallback(
    async (data: { email: string; password: string }) => {
      const result = await api.userAuth.login(data);
      localStorage.setItem("user_token", result.token);
      setAuthUser(result.user);
      const p: UserProfile = {
        name: result.user.name || "",
        email: result.user.email || "",
        phone: result.user.phone || "",
      };
      localStorage.setItem(LS_KEYS.name, p.name);
      localStorage.setItem(LS_KEYS.email, p.email);
      localStorage.setItem(LS_KEYS.phone, p.phone);
      setProfile(p);

      // Link device_id to account
      const deviceId = getDeviceId();
      api.userAuth.linkDevice(deviceId).catch(() => {});

      return result;
    },
    []
  );

  const register = useCallback(
    async (data: {
      email: string;
      password: string;
      name?: string;
      phone?: string;
    }) => {
      const result = await api.userAuth.register(data);
      localStorage.setItem("user_token", result.token);
      setAuthUser(result.user);
      const p: UserProfile = {
        name: result.user.name || "",
        email: result.user.email || "",
        phone: result.user.phone || "",
      };
      localStorage.setItem(LS_KEYS.name, p.name);
      localStorage.setItem(LS_KEYS.email, p.email);
      localStorage.setItem(LS_KEYS.phone, p.phone);
      setProfile(p);

      // Link device_id to account
      const deviceId = getDeviceId();
      api.userAuth.linkDevice(deviceId).catch(() => {});

      return result;
    },
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem("user_token");
    setAuthUser(null);
    // Keep local profile data in localStorage, just disconnect from auth
  }, []);

  const greeting = (() => {
    const h = new Date().getHours();
    if (h >= 5 && h < 12) return "Доброе утро";
    if (h >= 12 && h < 17) return "Добрый день";
    if (h >= 17 && h < 22) return "Добрый вечер";
    return "Доброй ночи";
  })();

  const isGreetingShown =
    localStorage.getItem(LS_KEYS.greetingShown) === "1";
  const markGreetingShown = useCallback(() => {
    localStorage.setItem(LS_KEYS.greetingShown, "1");
  }, []);

  return {
    ...profile,
    greeting,
    save,
    login,
    register,
    logout,
    isAuthenticated,
    authUser,
    authChecked,
    isGreetingShown,
    markGreetingShown,
  };
}
