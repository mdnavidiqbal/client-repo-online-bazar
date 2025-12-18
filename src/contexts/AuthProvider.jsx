import { createContext, useEffect, useState } from "react";
import { auth } from "../firebase/firebase.config";
import axios from "axios";
import { onAuthStateChanged } from "firebase/auth";

export const AuthContext = createContext();

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
});

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await api.post("/api/auth/login", {
          email: currentUser.email,
          role: "user"
        });
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
