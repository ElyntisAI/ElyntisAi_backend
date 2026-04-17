import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  onAuthStateChanged, User, signOut, GoogleAuthProvider, signInWithPopup,
  updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider
} from "firebase/auth";
import { auth } from "@/lib/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  updateUser: (displayName: string, photoURL?: string) => Promise<void>;
  updateUserPassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
  signInWithGoogle: async () => {},
  updateUser: async () => {},
  updateUserPassword: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (userAuth) => {
      if (userAuth) {
        const localAvatar = localStorage.getItem(`avatar_${userAuth.uid}`);
        if (localAvatar) {
          Object.defineProperty(userAuth, 'photoURL', { value: localAvatar, writable: false });
        }
      }
      setUser(userAuth);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Google Sign-In failed", error);
      throw error;
    }
  };

  const updateUser = async (displayName: string, photoURL?: string) => {
    if (!user) return;
    try {
      const params: any = { displayName };
      const updatedUserObj = { ...user, displayName } as any;

      if (photoURL !== undefined) {
        if (photoURL.startsWith("data:image")) {
          localStorage.setItem(`avatar_${user.uid}`, photoURL);
          updatedUserObj.photoURL = photoURL;
        } else {
          params.photoURL = photoURL;
          updatedUserObj.photoURL = photoURL;
        }
      }
      
      await updateProfile(user, params);
      // Refresh user state
      setUser(updatedUserObj);
    } catch (error) {
      console.error("Profile update failed", error);
      throw error;
    }
  };

  const updateUserPassword = async (currentPassword: string, newPassword: string) => {
    if (!user || !user.email) return;
    try {
      // Re-authenticate first (required by Firebase for sensitive operations)
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
    } catch (error) {
      console.error("Password update failed", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, loading, logout, signInWithGoogle, updateUser, updateUserPassword 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
