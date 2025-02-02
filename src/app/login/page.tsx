"use client";

import { loginWithEmailPassword } from "@/firebase/firebaseauth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from './Login.module.css';
import Link from "next/link";

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const loginHandler = async () => {
        if (!email || !password) {
            setError('Please Fill Required Fields');
            setTimeout(() => setError(''), 3000);
            return;
        }

        setLoading(true); 
        try {
            const user = await loginWithEmailPassword(email, password);

            if (user.emailVerified) {
                router.replace('/home'); 
            } else {
                setError('Please verify your email before logging in.');
            }
        } catch (error) {
            setError('Login Failed');
            setTimeout(() => setError(''), 3000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.parent}>
            <div className={styles.container}>
                <h1 className={styles.heading}>Log in</h1>
                {error && <p className={styles.error}>{error}</p>}

                <label className={styles.label}>Email:
                    <input
                        type="email"
                        className={styles.input}
                        value={email}
                        required
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </label>

                <label className={styles.label}>Password:
                    <input
                        type="password"
                        className={styles.input}
                        value={password}
                        required
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </label>

                <button className={styles.button} onClick={loginHandler} disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>

                <p>Don't Have an account? Create One</p>
                <Link href="/signup" className={styles.link}>Sign up</Link>
            </div>
        </div>
    );
}
