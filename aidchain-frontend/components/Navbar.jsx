"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { setAuthToken } from "@/utils/api";

export default function Navbar() {
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem("token");
        setAuthToken(null); // Clear Authorization header
        router.push("/login");
    };

    return (
        <nav className="flex gap-6 p-4 border-b border-gray-300 bg-gray-50">
            <Link href="/upload" className="hover:text-blue-600">Upload</Link>
            <Link href="/requests" className="hover:text-blue-600">Requests</Link>
            <Link href="/admin" className="hover:text-blue-600">Admin</Link>
            <button onClick={handleLogout} className="text-red-600 hover:text-red-800">
                Logout
            </button>
        </nav>
    );
}