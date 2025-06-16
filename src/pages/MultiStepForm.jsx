import React, { useState } from 'react';
import '../App.css';
import 'animate.css';
import logo from '../assets/Faucek_Logo.png';
import banner from '../assets/faucek_banner.jpg';
import BadgeModal from './BadgeModal';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
// import tiles from '../assets/tiles.jpeg';
import { url } from '../server';

const MultiStepForm = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        city: '',
        profileImage: null,
        heardFrom: '',
        selectedRole: '',
        futureVision: '',
        onboardingExperience: ''
    });
    const [isBadgeVisible, setIsBadgeVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = async (e) => {
        const { name, value, files, type } = e.target;

        if (type === 'file') {
            setFormData({
                ...formData,
                [name]: files && files.length > 0 ? files[0] : null
            });
        } else {
            setFormData({
                ...formData,
                [name]: value ?? ''
            });

            // Check for duplicate email when email field changes
            if (name === 'email' && value) {
                try {
                    const response = await fetch(`${url}/api/check-email`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email: value })
                    });
                    const data = await response.json();
                    if (data.exists) {
                        alert("This email is already registered. Please use a different email address.");
                        setFormData(prev => ({
                            ...prev,
                            email: ''
                        }));
                    }
                } catch (error) {
                    console.error("Error checking email:", error);
                }
            }
        }
    };

    const nextStep = async () => {
        if (step == 6) {
            e.preventDefault();
        }

        const requiredFields = {
            1: ['firstName', 'lastName', 'email', 'phone', 'city'],
            2: ['profileImage'],
            3: ['heardFrom'],
            4: ['selectedRole'],
            5: ['futureVision'],
            6: ['onboardingExperience']
        };

        const currentFields = requiredFields[step] || [];
        const isStepValid = currentFields.every((field) => {
            const value = formData[field];
            return value && (typeof value === 'string' ? value.trim() !== '' : true);
        });

        if (step === 2 && !formData.profileImage) {
            alert("No file chosen. Please upload a profile photo.");
            return;
        }

        if (!isStepValid) {
            alert('Please fill in all required fields.');
            return;
        }

        // Phone number validation for India
        if (step === 1) {
            const rawNumber = formData.phone.replace(/\D/g, ''); // Remove non-digits
            if (rawNumber.length < 10) {
                alert("Please enter a valid 10-digit Indian phone number");
                return;
            }
        }

        // Check for duplicate email in step 1
        if (step === 1) {
            try {
                const response = await fetch(`${url}/api/check-email`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: formData.email })
                });
                const data = await response.json();
                if (data.exists) {
                    alert("This email is already registered. Please use a different email address.");
                    return;
                }
            } catch (error) {
                console.error("Error checking email:", error);
                return;
            }
        }

        setStep((prev) => prev + 1);
    };

    const prevStep = () => setStep((prev) => prev - 1);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsLoading(true);

        const data = new FormData();

        data.append('formData', JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            city: formData.city,
            heardFrom: formData.heardFrom,
            selectedRole: formData.selectedRole,
            futureVision: formData.futureVision,
            onboardingExperience: formData.onboardingExperience,
        }));

        data.append('profileImage', formData.profileImage);

        try {
            const res = await fetch(`${url}/submit`, {
                method: 'POST',
                body: data
            });

            const result = await res.json();
            if (res.ok) {
                setIsBadgeVisible(true);
            } else {
                alert(result.message || "Error submitting form");
            }
        } catch (err) {
            console.error("Error:", err);
            alert("Error submitting form");
        } finally {
            setIsLoading(false);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate__animated animate__fadeInUp">
                        <div>
                            <input
                                name="firstName"
                                placeholder="First Name"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="p-3 w-full rounded-md border border-gray-400 bg-gray-800 text-white"
                                required
                            />
                        </div>
                        <div>
                            <input
                                name="lastName"
                                placeholder="Last Name"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="p-3 w-full rounded-md border border-gray-400 bg-gray-800 text-white"
                                required
                            />
                        </div>
                        <div>
                            <input
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                className="p-3 w-full rounded-md border border-gray-400 bg-gray-800 text-white"
                                required
                            />
                        </div>
                        <div>
                            <PhoneInput
                                country={'in'}
                                value={formData.phone}
                                onChange={(phone) => setFormData({ ...formData, phone })}
                                inputProps={{
                                    name: 'phone',
                                    required: true,
                                }}
                                inputClass=""
                                // containerClass="w-full"
                                buttonStyle={{
                                    borderTopLeftRadius: '8px',
                                    borderBottomLeftRadius: '8px',
                                    borderRight: '1px solid gray',
                                    backgroundColor: '#1f2937',
                                }}
                                inputStyle={{
                                    width: '100%',
                                    height: '48px',
                                    padding: '12px 12px 12px 58px',
                                    borderRadius: '8px',
                                    border: '1px solid gray',
                                    backgroundColor: '#1f2937',
                                    color: 'white',
                                }}
                                dropdownStyle={{
                                    backgroundColor: '#fff',
                                    color: 'black',
                                    borderRadius: '8px',
                                    maxHeight: '200px',
                                    minWidth: '180px',
                                    maxWidth: '100%',
                                    width: 'auto',
                                    overflowY: 'auto',

                                }}
                                buttonClass="!bg-[#1f2937]"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <input
                                name="city"
                                placeholder="City"
                                value={formData.city}
                                onChange={handleChange}
                                className="p-3 w-full rounded-md border border-gray-400 bg-gray-800 text-white"
                                required
                            />
                        </div>
                    </div>

                );
            case 2:
                return (
                    <div className="space-y-2 animate__animated animate__fadeIn">
                        <label htmlFor="profileImage" className="block text-lg font-medium text-white mb-2">
                            Upload Profile Photo
                        </label>

                        <div className="relative w-full">
                            <label className="w-full cursor-pointer flex items-center justify-center px-4 py-3 rounded-lg border border-gray-400 bg-gray-800 text-white hover:bg-gray-700 transition duration-200">
                                Choose File
                                <input
                                    id="profileImage"
                                    name="profileImage"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            if (file.size > 50 * 1024) {
                                                alert("File size must be 50KB or less.");
                                                e.target.value = ""; // Reset file input
                                                return;
                                            }
                                            setFormData({ ...formData, profileImage: file });
                                        }
                                    }}
                                    className="hidden"
                                />
                            </label>
                            <p className="text-sm text-gray-300 mt-2">
                                {formData.profileImage ? formData.profileImage.name : "No file chosen"}
                            </p>
                        </div>
                    </div>
                );


            case 3:
                return (
                    <div className="space-y-2 animate__animated animate__fadeIn">
                        <label htmlFor="heardFrom" className="block text-lg font-medium text-white">
                            How did you get to know about Faucek?
                        </label>
                        <textarea
                            id="heardFrom"
                            name="heardFrom"
                            value={formData.heardFrom}
                            onChange={handleChange}
                            className="w-full p-3 rounded-md focus:border-white border-1 border-gray-400 text-gray-300"
                            required
                        />
                    </div>
                );
            case 4:
                return (
                    <div className="space-y-2 animate__animated animate__fadeIn">
                        <label htmlFor="selectedRole" className="block text-lg font-medium text-white">
                            For which role have you been selected?
                        </label>
                        <input
                            id="selectedRole"
                            name="selectedRole"
                            value={formData.selectedRole}
                            onChange={handleChange}
                            className="w-full p-3 rounded-md focus:border-violet-whit border-1 border-gray-400 text-gray-300"
                            required
                        />
                    </div>
                );
            case 5:
                return (
                    <div className="space-y-2 animate__animated animate__fadeIn">
                        <label htmlFor="futureVision" className="block text-lg font-medium text-white">
                            Where do you see yourself in the next 2–3 years?
                        </label>
                        <textarea
                            id="futureVision"
                            name="futureVision"
                            value={formData.futureVision}
                            onChange={handleChange}
                            className="w-full p-3 rounded-md focus:border-violet-white border-1 border-gray-400 text-gray-300"
                            required
                        />
                    </div>
                );
            case 6:
                return (
                    <div className="space-y-2 animate__animated animate__fadeIn">
                        <label htmlFor="onboardingExperience" className="block text-lg font-medium text-white">
                            How was your onboarding experience?
                        </label>
                        <textarea
                            id="onboardingExperience"
                            name="onboardingExperience"
                            value={formData.onboardingExperience}
                            onChange={handleChange}
                            className="w-full p-3 rounded-md focus:border-violet-white border-1 border-gray-400 text-gray-300"
                        />
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen flex flex-col complex-background">
            {/* Navbar */}
            <nav className="w-full bg-white shadow-md backdrop-blur-sm sticky top-0 z-50 flex justify-center">
                <div className="max-w-7xl mx-auto px-6 py-1 flex items-center">
                    <img src={logo} alt="Faucek Logo" className="h-12" />
                </div>
            </nav>

            {/* Main Content */}
            <div className="flex-grow flex items-center justify-center px-6 py-12 md:py-28 ">
                <div className="flex flex-col md:flex-row max-w-5xl w-full rounded-xl shadow-2xl backdrop-blur-md bg-gradient-to-br from-gray-800 via-gray-900 to-black animate__animated animate__fadeInUp">

                    {/* Banner Section */}
                    <div className="relative w-full md:w-1/2 h-64 md:h-auto">
                        <img src={banner} alt="Team" className="absolute inset-0 w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center p-6">
                            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-2 animate__animated animate__zoomIn">
                                We are <span className="faucek-gradient font-bold">FAUCEK</span>
                            </h2>
                            <p className="text-lg md:text-xl text-gray-200 animate__animated animate__fadeInUp">
                                Empowering Innovation Together
                            </p>
                        </div>
                    </div>

                    {/* Form Section */}
                    <div className="w-full md:w-1/2 bg-gray-900 bg-opacity-80 p-8 space-y-6 text-white animate__animated animate__fadeInUp">
                        <p className="hidden md:block text-white text-5xl font-bold text-center">Welcome!</p>
                        <p className="text-center text-gray-300 mb-16">
                            Kindly fill in the complete details for generating your ID
                        </p>
                        <form
                            onSubmit={handleSubmit}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    if (step < 6) {
                                        nextStep();
                                    } else {
                                        handleSubmit(e);
                                    }
                                }
                            }}
                            className="space-y-4"
                        >
                            {renderStep()}
                            <div className="flex justify-between pt-4">
                                {step > 1 && !isLoading && (
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        className="px-6 py-3 text-white rounded-lg bg-gray-700 hover:bg-gray-600 transition"
                                    >
                                        Previous
                                    </button>
                                )}
                                {step < 6 ? (
                                    !isLoading && (
                                        <button
                                            type="button"
                                            onClick={nextStep}
                                            className="px-6 py-3 text-white rounded-lg bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 hover:opacity-90 transition"
                                        >
                                            Next
                                        </button>
                                    )
                                ) : (
                                    !isLoading && (
                                        <button
                                            type="submit"
                                            className="px-6 py-3 text-white rounded-lg bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 hover:opacity-90 transition"
                                        >
                                            Generate Badge
                                        </button>
                                    )
                                )}
                                {isLoading && <p className="text-white">Generating Badge...</p>}
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Badge Modal */}
            {isBadgeVisible && (
                <BadgeModal
                    isOpen={isBadgeVisible}
                    onClose={() => setIsBadgeVisible(false)}
                    userData={formData}
                />
            )}

            {/* Footer */}
            <footer className="w-full text-center py-2 text-gray-400 text-lg bg-black bg-opacity-70">
                © {new Date().getFullYear()} <span className="font-semibold text-white">Faucek</span>. All rights reserved.
            </footer>
        </div>
    );

};

export default MultiStepForm;
