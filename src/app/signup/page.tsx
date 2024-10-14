"use client";

import { auth, signupWithEmailPassword } from "@/firebase/firebaseauth";
import { db, saveUser } from "@/firebase/firebasefirestore";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from './Signup.module.css';
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";

export default function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loader, setLoader] = useState(false);
    const router = useRouter();

    const signupHandler = async () => {
        setError('');
        setMessage('');
        setLoader(true);
        try {
            const UserCredential = await signupWithEmailPassword(email, password);
            const user = UserCredential;

            await saveUser({
                email: user.email || '',
                uid: user.uid,
                username: username
            });

            setMessage('A verification email has been sent to your email address. Please verify before logging in.');

            setEmail('');
            setPassword('');
            setUsername('');

            router.push('/emailverification');
        } catch (error: any) {
            setError(error.message || 'Sign Up Failed');
        } finally {
            setLoader(false);
        }
    };

    return (
        <div className={styles.parent}>
            <div className={styles.container}>
                <h1 className={styles.heading}>Sign Up</h1>

                {message && <p className={styles.success}>{message}</p>}
                {error && <p className={styles.error}>{error}</p>}

                <label className={styles.label}>Username:
                    <input
                        type="text"
                        className={styles.input}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </label>
                <br />
                <label className={styles.label}>Email:
                    <input
                        type="email"
                        className={styles.input}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </label>
                <br />
                <label className={styles.label}>Password:
                    <input
                        type="password"
                        className={styles.input}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </label>
                <br />
                <button className={styles.button} onClick={signupHandler} disabled={loader}>
                    {loader ? "Signing Up" : "Sign Up"}
                </button>
                <br />
                <span>Already have an account?</span>
                <Link href={'/login'} className={styles.link}>Login</Link>
            </div>
        </div>
    );
}
