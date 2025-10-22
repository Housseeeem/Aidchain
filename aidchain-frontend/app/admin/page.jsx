"use client";

import { useState } from "react";
import API from "@/utils/api";
import Navbar from "@/components/Navbar";

export default function AdminPage() {
    const [fileId, setFileId] = useState("");
    const [userId, setUserId] = useState("");
    const [message, setMessage] = useState("");

    const handleApprove = async (e) => {
        e.preventDefault();
        if (!fileId || !userId) {
            setMessage("❌ Please enter both File ID and User ID");
            return;
        }

        try {
            const { data } = await API.post("/access/approve", {
                fileId,
                userId,
            });
            setMessage(`✅ ${data.message} - Access approved for User ${userId} on File ${fileId}`);
            setFileId("");
            setUserId("");
        } catch (error) {
            setMessage(`❌ ${error.response?.data?.error || "Approval failed"}`);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="max-w-2xl mx-auto p-8">
                <h1 className="text-3xl font-bold mb-6">Admin - Approve Access</h1>
                
                <form onSubmit={handleApprove} className="space-y-4">
                    <input
                        type="text"
                        placeholder="File ID"
                        value={fileId}
                        onChange={(e) => setFileId(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded"
                    />
                    <input
                        type="text"
                        placeholder="User ID"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded"
                    />
                    <button
                        type="submit"
                        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                    >
                        Approve Access
                    </button>
                </form>

                {message && (
                    <p className={`mt-4 ${message.includes("✅") ? "text-green-600" : "text-red-600"}`}>
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
}