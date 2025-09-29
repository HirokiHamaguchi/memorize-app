import { useState, useEffect } from 'react'
import type { User } from 'firebase/auth'
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, provider, db } from '../config/firebase'

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            console.log(user)
            if (user) {
                console.log("ログイン中:", user.uid)
                const userDocRef = doc(db, "users", user.uid)
                console.log(userDocRef)
                console.log(user);
                // Firestoreに保存
                await setDoc(userDocRef, {
                    lastLogin: new Date().toISOString(),
                    displayName: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL
                }, { merge: true })
                console.log("ユーザーデータを保存しました")

                // Firestoreから読み込み
                const snap = await getDoc(userDocRef)
                console.log(snap)
                if (snap.exists()) {
                    console.log("ユーザーデータ:", snap.data())
                }
            } else {
                console.log("ログアウト中")
            }
            setUser(user)
            setLoading(false)
        })

        return () => unsubscribe()
    }, [])

    const signInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, provider)
        } catch (error) {
            console.error("ログインエラー:", error)
        }
    }

    const logout = async () => {
        try {
            await signOut(auth)
        } catch (error) {
            console.error("ログアウトエラー:", error)
        }
    }

    return {
        user,
        loading,
        signInWithGoogle,
        logout
    }
}