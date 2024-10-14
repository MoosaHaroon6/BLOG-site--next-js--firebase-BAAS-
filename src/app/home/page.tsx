"use client";

import { useAuthContext } from "@/context/authcontext";
import { auth } from "@/firebase/firebaseauth";
import { db } from "@/firebase/firebasefirestore";
import { collection, doc, getDoc, onSnapshot, query, where } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type PostType = {
    id: string;
    uid: string;
    title: string;
    caption: string;
    tag?: string;
    time: { seconds: number };
    user?: {
        email: string;
        uid: string;
        username: string,
    };
}

export default function Home() {
    const router = useRouter();
    const { user } = useAuthContext()!;
    const [posts, setPosts] = useState<PostType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [usernames, setUsernames] = useState<{ [uid: string]: string }>({});

    const signupRouter = () => {
        router.push("./signup");
    };

    const loginRouter = () => {
        router.push("/login");
    };

    const handleAddBlog = () => {
        if (user) {
            router.push('/createblog');
        } else {
            alert("Please Sign Up or Log in to add a post.");
        }
    };

    useEffect(() => {
        const fetchDataRealTime = () => {
            const collectionRef = collection(db, "posts");
            const currentUserUID = auth.currentUser?.uid;
            const condition = where("uid", "==", currentUserUID);
            const q = query(collectionRef, condition);

            onSnapshot(q, async (querySnapshot) => {
                const fetchedPosts: PostType[] = [];
                const usernamePromises: Promise<void>[] = [];

                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    const postData = { id: doc.id, ...data } as PostType;
                    fetchedPosts.push(postData);

                    // Fetch username for each post author
                    const usernamePromise = getDoc(doc(db, "users", postData.uid)).then((userDoc) => {
                        if (userDoc.exists()) {
                            setUsernames((prev) => ({
                                ...prev,
                                [postData.uid]: userDoc.data().username || "Unknown User",
                            }));
                        }
                    });
                    usernamePromises.push(usernamePromise);
                });

                await Promise.all(usernamePromises); // Wait for all username fetches to complete
                setPosts(fetchedPosts);
                setLoading(false);
            });
        };

        fetchDataRealTime();
    }, []);

    return (
        <div>
            {/* nav-bar */}
            <div className="navbar bg-white-300 shadow-lg">
                <div className="flex-1 px-2 lg:flex-none">
                    <p className="text-2xl font-bold p-4 cursor-pointer size-30 hover:bg-gray-100">Free Blog</p>
                </div>
                <div className="flex flex-1 justify-end px-2">
                    <div className="flex items-stretch">
                        <button className="btn btn-ghost rounded-btn" onClick={handleAddBlog}>
                            Add Blog
                        </button>
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-ghost rounded-btn">
                                Get In
                            </div>
                            <ul tabIndex={0} className="menu dropdown-content bg-base-100 rounded-box z-[1] mt-4 w-52 p-2 shadow">
                                <li>
                                    <button className="btn" onClick={loginRouter}>Log In</button>
                                </li>
                                <li>
                                    <button className="btn" onClick={signupRouter}>Sign Up</button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            {/* nav-bar */}

            {loading ? (
                <p>Loading posts...</p>
            ) : posts.length === 0 ? (
                <p>No Posts To see</p>
            ) : (
                posts.map(({ id, title, caption, tag, uid }) => (
                    <div key={id} className="card bg-primary text-primary-content w-96 mb-4">
                        <div className="card-body">
                            <p>Posted By: {usernames[uid] || "Loading..."}</p>
                            <h2 className="card-title">{title}</h2>
                            <p>{caption}, {tag}</p>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
