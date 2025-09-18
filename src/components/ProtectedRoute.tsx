"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loader from "./Loader/Loader";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login"); // redirect to login if not logged in
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return <Loader isLoading={true} loaderFullScreen={true}/>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
