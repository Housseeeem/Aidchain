"use client";

import { useState, useEffect } from "react";
import API from "@/utils/api";
import Navbar from "@/components/Navbar";

export default function UploadPage() {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch uploaded files on component mount
    useEffect(() => {
        fetchFiles();
    }, []);

    const fetchFiles = async () => {
        try {
            const { data } = await API.get("/files");
            setFiles(data);
        } catch (error) {
            console.error("Error fetching files:", error);
            setMessage("Error loading files");
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            setMessage("Please select a file");
            return;
        }

        setLoading(true);
        setMessage("");

        const formData = new FormData();
        formData.append("file", file);

        try {
            const { data } = await API.post("/files/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setMessage(`✅ ${data.message} - File ID: ${data.fileId}`);
            setFile(null);
            // Reset file input
            e.target.reset();
            // Refresh file list
            fetchFiles();
        } catch (error) {
            setMessage(`❌ ${error.response?.data?.error || "Upload failed"}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="max-w-2xl mx-auto p-8">
                <h1 className="text-3xl font-bold mb-6">Upload File</h1>
                
                <form onSubmit={handleUpload} className="mb-8">
                    <input
                        type="file"
                        onChange={handleFileChange}
                        className="block w-full mb-4 p-2 border border-gray-300 rounded"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                    >
                        {loading ? "Uploading..." : "Upload"}
                    </button>
                </form>

                {message && (
                    <p className={`mb-4 ${message.includes("✅") ? "text-green-600" : "text-red-600"}`}>
                        {message}
                    </p>
                )}

                {/* Display uploaded files */}
                <div className="mt-8">
                    <h2 className="text-2xl font-bold mb-4">Your Uploaded Files</h2>
                    {files.length === 0 ? (
                        <p className="text-gray-500">No files uploaded yet.</p>
                    ) : (
                        <div className="space-y-2">
                            {files.map((file) => (
                                <div key={file.id} className="p-4 border border-gray-200 rounded bg-gray-50">
                                    <p className="font-semibold">📄 {file.filename}</p>
                                    <p className="text-sm text-gray-600">File ID: {file.id}</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Hash: {file.file_hash.substring(0, 16)}...
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {new Date(file.created_at).toLocaleString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}