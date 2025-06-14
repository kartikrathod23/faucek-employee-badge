import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import { FaLinkedin, FaInstagram, FaTwitter } from "react-icons/fa";
import faucekLogo from "../assets/Faucek_Logo.png";
import tiles from "../assets/tiles4.jpeg";
import { useNavigate } from "react-router-dom";
import { url } from "../server";

const BadgeModal = ({ isOpen, onClose, userData }) => {

    const navigate = useNavigate();

    const badgeRef = useRef();

    const handleClose = () => {
        onClose();
        navigate("/thank-you", { state: { userData, badgeImageUrl: profileImgUrl } });
    };


    const downloadBadge = async () => {
    const badgeElement = badgeRef.current;
    if (!badgeElement) return;

    try {
        const clone = badgeElement.cloneNode(true);
        document.body.appendChild(clone);
        clone.style.position = "absolute";
        clone.style.top = "-1000000px";

        clone.style.backgroundColor = '#1a1a2e';
        clone.style.backgroundImage = `linear-gradient(to top right, rgba(176, 108, 244, 0.5), rgba(176, 108, 244, 0.5), rgba(244, 72, 207, 0.5)), url(${tiles})`;
        clone.style.backgroundRepeat = "no-repeat, repeat";
        clone.style.backgroundSize = "cover, contain";

        const canvas = await html2canvas(clone, {
            useCORS: true,
            allowTaint: true,
            scale: 2,
            backgroundColor: null,
        });

        document.body.removeChild(clone);

        // Convert to blob for download and dataURL for preview
        canvas.toBlob((blob) => {
            if (blob) {
                const badgeUrl = URL.createObjectURL(blob);
                saveAs(blob, `${userData.firstName}_${userData.lastName}_badge.png`);
                navigate("/thank-you", {
                    state: {
                        userData,
                        badgeImageUrl: badgeUrl,
                    },
                });
            }
        });
    } catch (error) {
        console.error("Badge download failed:", error);
    }
};


    // useEffect(() => {
    //     const badge = badgeRef.current;
    //     if (badge) {
    //         const allElements = badge.querySelectorAll("*");
    //         allElements.forEach(el => {
    //             const style = window.getComputedStyle(el);
    //             if (style.backgroundColor.includes("oklab") || style.color.includes("oklab")) {
    //                 console.log("Found oklab in element:", el, style.color, style.backgroundColor);
    //             }
    //         });
    //     }
    // }, []);


    if (!isOpen) return null;

    const fullName = `${userData.firstName} ${userData.lastName}`;
    const [officialEmail, setOfficialEmail] = useState(userData.email || "");
    const [empID, setEmpID] = useState(userData.employeeId || "FAC-EMP-001");
    const designation = userData.selectedRole;
    const phone = userData.phone;

    const profileImgUrl =
        typeof userData.profileImage === "string"
            ? userData.profileImage
            : userData.profileImage instanceof File
                ? URL.createObjectURL(userData.profileImage)
                : "";

    useEffect(() => {
        const generateDetails = async () => {
            if (!userData.firstName || !userData.lastName) return;

            try {
                // Generate email
                const emailRes = await axios.post(`${url}/api/generate-email`, {
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                });

                if (emailRes.data.email) {
                    setOfficialEmail(emailRes.data.email);
                }

                // Generate employee ID
                const empIdRes = await axios.get(`${url}/api/generate-empid`);
                if (empIdRes.data.employeeId) {
                    setEmpID(empIdRes.data.employeeId);
                }

            } catch (err) {
                console.error("Error generating badge details:", err);
            }
        };

        if (isOpen) {
            generateDetails();
        }
    }, [isOpen, userData.firstName, userData.lastName]);


    return (
        <div style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }} className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="relative max-w-[420px] animate-slideUp">
                <button
                    onClick={handleClose}
                    style={{ color: "#ffffff" }}
                    className="absolute top-0 z-10 right-2 text-3xl hover:scale-110 transition"
                >
                    &times;
                </button>

                <div
                    ref={badgeRef}
                    style={{
                        fontFamily: "'Inter'",
                        backgroundImage: `url(${tiles}), linear-gradient(to top right, rgba(220, 187, 253, 0.6), rgba(220, 187, 253, 0.6), rgba(230, 150, 220, 0.6))`,
                        backgroundBlendMode: 'overlay',
                        backgroundSize: 'contain',
                        backgroundRepeat: 'repeat, no-repeat',
                        color: '#ffffff'
                    }}
                    className="w-[392px] h-[520px] rounded-xl relative overflow-hidden border-4 border-black p-4 flex flex-col justify-between"
                >
                    {/* Top Section: Title and Logo */}
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', marginBottom: '-1.5rem' }}>
                        <div
                            style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                backdropFilter: 'blur(24px)',
                                borderRadius: '1rem',
                                boxShadow: '0 10px 15px rgba(255, 255, 255, 0.5)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                marginLeft: '16rem',
                                marginTop: '0rem',
                                width: '100px',
                                height: '40px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}

                        >
                            <img src={faucekLogo} alt="Logo" style={{ height: '40px', width: '100px', objectFit: 'contain', padding: '4px' }} />
                        </div>
                        {/* <div style={{ flex: 1, textAlign: 'center', fontWeight: 'bold', fontSize: '1.6rem', letterSpacing: '2px', marginTop: '0.5rem' }}>
                            EMPLOYEE ID CARD
                        </div> */}
                    </div>

                    {/* Main Info Section */}
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: '1.5rem', marginTop: '0rem' }}>
                        {/* Photo and Employee ID */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '120px' }}>
                            <div style={{ border: '3px solid #6b21a8', width: '140px', height: '170px', overflow: 'hidden', borderRadius: '8px', background: '#222', marginTop: '10px' }}>
                                {profileImgUrl ? (
                                    <img src={profileImgUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', fontSize: '0.9rem' }}>PHOTO</div>
                                )}
                            </div>
                            <div className="text-[#fff] font-extrabold mt-1">
                                {empID}
                            </div>
                        </div>
                        {/* Info Fields */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '1rem', justifyContent: 'flex-start' }}>
                            <div><span style={{ fontWeight: 'bold', color: '#fff' }}>Name</span><br /><span style={{ color: '#ddd' }}>{fullName}</span></div>
                            <div><span style={{ fontWeight: 'bold', color: '#fff' }}>Designation</span><br /><span style={{ color: '#ddd' }}>{designation}</span></div>
                            <div><span style={{ fontWeight: 'bold', color: '#fff' }}>Email</span><br /><span style={{ color: '#ddd' }}>{officialEmail}</span></div>
                            <div><span style={{ fontWeight: 'bold', color: '#fff' }}>Contact</span><br /><span style={{ color: '#ddd' }}>+{phone}</span></div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div style={{
                        borderTop: '0.3rem solid #fff',
                        marginTop: '0.1rem',
                        borderRadius: '1rem',
                        width: '100%',
                    }} />

                    {/* Company Info Section */}
                    <div style={{ fontSize: '1rem', color: '#fff', padding: '0rem', marginTop: '0.1rem' }}>
                        <div><span style={{ fontWeight: 'bold', color: '#fff' }}>Company Name : </span> <span style={{ color: '#ddd' }}>Faucek</span></div>
                        <div><span style={{ fontWeight: 'bold', color: '#fff' }}>Official Email : </span> <span style={{ color: '#ddd' }}>admin@faucek.com</span></div>
                        <div><span style={{ fontWeight: 'bold', color: '#fff' }}>Official Contact : </span> <span style={{ color: '#ddd' }}>+91-9782040668</span></div>
                        <div><span style={{ fontWeight: 'bold', color: '#fff' }}>Address : </span> <span style={{ color: '#ddd' }}>Second Floor, AF-6, Khatipura Rd, Shilp Colony, Jhotwara, Jaipur, Rajasthan 302012</span></div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '1.5rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.1rem', justifyContent: 'center' }}>
                                <span className="social-icons" style={{ display: 'flex', gap: '0.3rem', color: '#fff', fontSize: '1.2rem' }}>
                                    <FaLinkedin />
                                    <FaInstagram />
                                    <FaTwitter />
                                </span>
                                <a href="https://faucek.com" style={{ color: '#fff', textDecoration: 'underline', fontWeight: 'bold', fontSize: '1rem' }}>www.faucek.com</a>
                                {/* <span style={{ color: '#fff', fontSize: '1.1rem' }}>|</span> */}
                            </div>
                        </div>
                    </div>
                </div>

                <button
                    onClick={downloadBadge}
                    className="mt-4 w-full bg-[#fcd34d] hover:bg-[#fde68a] text-black font-bold py-2 px-4 rounded-lg shadow-md transition-all"
                >
                    Download Badge
                </button>

                <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(60px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
 
        .animate-slideUp {
          animation: slideUp 0.5s ease-out;
        }
      `}</style>
            </div>
        </div>
    );
};

export default BadgeModal;
