import { doc, getFirestore, setDoc } from "firebase/firestore";
import { app } from "./firebaseconfig";

export const db = getFirestore(app);

type UserType = {
    email: string;
    uid: string;
    username: string;
}

export async function saveUser(user: UserType) {
    try {
        const docRef = doc(db, "users", user.uid);
        await setDoc(docRef, {
            email: user.email,
            uid: user.uid,
            username: user.username,
        });
    }
    catch (e) {
        console.log(e);
    }
}