"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { app } from "@/firebase/firebaseconfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

type UserType = {
    email: string | null;
    uid: string | null;
}
type AuthContextType = { user: UserType | null; setUser: (user: UserType | null) => void; }

const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthContextProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserType | null>(null);
    const router = useRouter();

    useEffect(() => {
        const auth = getAuth(app);
        onAuthStateChanged(auth, (loggedInUser) => {
            if (loggedInUser) {
                const { email, uid } = loggedInUser;
                setUser({ email, uid });
                router.push('/home');
            } else {
                setUser(null);
                router.push('/home');
            }
        });
    }, [router]);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuthContext = () => useContext(AuthContext);
