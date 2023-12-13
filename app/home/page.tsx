"use client";
import Header from "@/components/Header";
import React, { useEffect, useState } from "react";
import Board from "@/components/Board";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import { refreshToken } from "@/lib/api/authApi";
import { LoadingScreen } from "@/components/LoadingScreen";


export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Refresh access token if refresh token is valid or redirect to log in if not
    refreshToken()
      .then(() => {
        setLoading(false);
      })
      .catch(() => {
        router.push("/login");
        setTimeout(() => {
          toast("Please log in to continue");
        }, 1000);
      });
    // Set interval to refresh access token every 14 minutes
    const interval = setInterval(
      () => {
        refreshToken()
          .then(() => {})
          .catch(() => {
            router.push("/login");
          });
      },
      14 * 60 * 1000,
    );
    return () => {
      clearInterval(interval);
    };
  }, []);

  if (loading) {
    return (
      <div>
        <LoadingScreen />
      </div>
    );
  }

  return (
    <main>
      <Header />
      <div>
        <Toaster />
      </div>
        <Board />
    </main>
  );
}
