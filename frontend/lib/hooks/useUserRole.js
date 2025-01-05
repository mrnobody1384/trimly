"use client";
import { readLocalStorageValue } from "@mantine/hooks";
// import useLocalStorage from "use-local-storage";

import { useState, useEffect } from "react";

function useUserRole() {
  // const [token, setToken] = useLocalStorage("token");
  const token = readLocalStorageValue({ key: "token" });
  const role = readLocalStorageValue({ key: "role" });
  // let token = await window?.localStorage.getItem("token");
  let t = token;
  if (token) {
    return role;
  }
}

export const useLocalStorage = (key, initialValue) => {
  // State to store value
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === "undefined") {
      // If running on the server, return the initial value
      return initialValue;
    }

    try {
      // Get from localStorage by key
      const item = window.localStorage.getItem(key);
      // Parse stored JSON or return initialValue if none exists
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("Error reading localStorage key:", key, error);
      return initialValue;
    }
  });

  // Function to update localStorage and state
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;

      // Save state
      setStoredValue(valueToStore);

      // Save to localStorage
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error("Error setting localStorage key:", key, error);
    }
  };

  return [storedValue, setValue];
};

export default useUserRole;
