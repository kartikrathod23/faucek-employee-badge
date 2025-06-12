// src/pages/ThankYouPage.js
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaLinkedin, FaInstagram, FaTwitter } from "react-icons/fa";
import tiles from "../assets/tiles4.jpeg";

const ThankYouPage = () => {
    const location = useLocation();
    const userData = location.state?.userData;
    const badgeImageUrl = location.state?.badgeImageUrl;

    const fullName = `${userData?.firstName || "User"} ${userData?.lastName || ""}`;

    const handleDownloadAgain = () => {
        if (!badgeImageUrl) return;
        const link = document.createElement("a");
        link.href = badgeImageUrl;
        link.download = `${userData?.firstName}_${userData?.lastName}_badge.png`;
        link.click();
    };

    return (
        <div
            style={{
                backgroundImage: `url(${tiles})`,
                backgroundSize: "cover",
                backgroundBlendMode: "overlay",
                backgroundColor: "#1a1a2e",
                color: "#fff",
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: "2rem",
                textAlign: "center"
            }}
        >
            <h1 className="text-3xl font-bold mb-4">🎉 Congratulations, {fullName}!</h1>
            <h2 className="text-xl font-semibold mb-8">Now you are a certified FAUCEKER!</h2>

            <button
                onClick={handleDownloadAgain}
                className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-2 px-6 rounded-lg shadow-md transition-all mb-12"
            >
                Download Badge Again
            </button>

            <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Follow us on social media</h3>
                <div className="flex gap-4 justify-center text-2xl">
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
                </div>
            </div>
        </div>
    );
};

export default ThankYouPage;
