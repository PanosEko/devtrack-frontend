"use client";
import Header from "@/components/Header";
import React, {useEffect, useState} from "react";
import Board from "@/components/Board";
import {useRouter} from "next/navigation";
import {toast, Toaster} from "react-hot-toast";
import {refreshToken} from "@/lib/api/authApi";
import {LoadingScreen} from "@/components/LoadingScreen";

export default function Home() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        refreshToken().then(() =>{
            setLoading(false);
        } )
            .catch(() =>{
                router.push('/login');
                setTimeout(() => {
                    toast.error("You are not logged in!");
                }, 1000);
            })
        const interval = setInterval(() => {
            refreshToken().then(() =>{} )
                .catch(() =>{
                    router.push('/login');
                })
        }, 14 * 60 * 1000);
        // Clean up the interval when the component is unmounted
        return () => {
            clearInterval(interval);
        };
    }, []);

if(loading){
    return (
        <div>
            <LoadingScreen/>
        </div>
    );
}

    return (
        <main>
            {/* Header */}
            <Header />
            <div><Toaster/></div>
            {/* Board */}
            <Board />
        </main>
    );
}


