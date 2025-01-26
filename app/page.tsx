"use client"

import Image from "next/image";
import HomePage from './homepage'
import { useUser } from '@auth0/nextjs-auth0/client';
import { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import app from "@/firebase/config";

const db = getFirestore(app);

export default function Home() {
  const { user, error, isLoading } = useUser();
  const [analysis, setAnalysis] = useState(null);

  

  useEffect(() => {
    const checkUser = async () => {
      if (user && user.sub) { // Check if user and user.sub exist
        console.log("User exists");
        console.log(user);
        try {
          const userRef = doc(db, 'users', user.sub);
          const userDoc = await getDoc(userRef);
          
          if (!userDoc.exists()) {
            await setDoc(userRef, {
              email: user.email || '',
              name: user.name || '',
              createdAt: new Date()
            });
          }
        } catch (err) {
          console.error("Error checking/creating user:", err);
        }
      }
    };

    checkUser();
  }, [user]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    <div>
      <HomePage/>
    </div>
  );
}
