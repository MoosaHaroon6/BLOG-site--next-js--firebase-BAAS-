"use client";
import { auth } from "@/firebase/firebaseauth";
import { db } from "@/firebase/firebasefirestore";
import { addDoc, collection } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState } from "react"

export default function CreateBlog() {
    const [title, setTitle] = useState('');
    const [caption, setCaption] = useState('');
    const [tag, setTag] = useState('');
    const router = useRouter();

    const savePostToFirestore = async (title: string, caption: string, tag?: string) => {
        try {
            let currentUserUID = auth.currentUser?.uid;
            if (!currentUserUID) {
                alert("User not authenticated");
                return;
            }
            const postsCollection = collection(db, "posts");

            await addDoc(postsCollection, {
                uid: currentUserUID,
                title: title,
                caption: caption,
                tag: tag || '',
                createdAt: new Date()
            })
        } catch (e) {
            console.error("Error");
        }
    }

    const handlePost = () => {
        if (!title && !caption) {
            alert("Fill out Tile and Caption");
        }

        savePostToFirestore(title, caption, tag);
        console.log(title, caption, tag);

        router.push("/home");

        setTitle('');
        setCaption('');
        setTag('');

    }

    return (
        <div className="flex flex-col items-center justify-center mt-20">
            <div className="card bg-base-100 w-96 shadow-xl">
                <h1 className="text-2xl text-center font-extrabold mt-10">Create Blog</h1>
                <div className="card-body">
                    <div className="card-actions justify-end">
                    </div>

                    <input
                        type="text"
                        value={title}
                        placeholder="Add Title"
                        onChange={(e) => setTitle(e.target.value)}
                        className="input input-bordered w-full max-w-xs"
                    />

                    <textarea
                        placeholder="Caption / Description"
                        className="textarea textarea-bordered textarea-md w-full max-w-xs"
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}></textarea>

                    <input
                        type="text"
                        value={tag}
                        placeholder="Add Tag"
                        onChange={(e) => setTag(e.target.value)}
                        className="input input-bordered w-full max-w-xs"
                    />
                    <button className="btn btn-primary text-purple" onClick={handlePost}>Post</button>
                </div>
            </div>
        </div>
    )
}