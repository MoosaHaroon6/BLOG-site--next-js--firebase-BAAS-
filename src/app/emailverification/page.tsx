"use client";

import Link from "next/link";
import style from "./Emailverification.module.css";
import { auth } from "@/firebase/firebaseauth";

export default function EmailVerification() {
    return (
        <div className={style.parent}>
            <p>verification link has been sent to <b>{auth.currentUser?.email}</b></p>
            <p>Login After verification, <b>Thank You!</b></p>
            <Link href={"/login"}>Login</Link>
        </div>
    )
}