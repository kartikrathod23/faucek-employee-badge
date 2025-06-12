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

    const handleChange = (e) => {
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
        }
    };

    const nextStep = () => {

        if(step==6){
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

        const rawNumber = formData.phone.replace(/\D/g, ''); // Remove non-digits
        if (rawNumber.length < 10) {
            alert("Please enter a valid 10-digit phone number");
            return;
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

        // const rawNumber = formData.phone.replace(/\D/g, ''); // Remove non-digits
        // if (rawNumber.length < 10) {
        //     alert("Please enter a valid 10-digit phone number");
        //     return;
        // }

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
                        <input name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} className="p-3 rounded-md border-1 border-gray-400 bg-gray-800" required />
                        <input name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} className="p-3 rounded-md border-1 border-gray-400 bg-gray-800" required />
                        <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="p-3 rounded-md border-1 border-gray-400 bg-gray-800" required />
                        <PhoneInput
                            country={'in'}
                            value={formData.phone}
                            onChange={(phone) => setFormData({ ...formData, phone })}
                            inputProps={{
                                name: 'phone',
                                required: true,
                            }}
                            inputClass="custom-phone-input"
                            containerClass="w-full"
                            buttonStyle={{
                                borderTopLeftRadius: '8px',
                                borderBottomLeftRadius: '8px',
                                borderRight: '1px solid gray',
                            }}
                            inputStyle={{
                                width: '100%',
                                height: '100%',
                                padding: '12px 12px 12px 58px', // extra left padding for country code
                                borderRadius: '8px',
                                border: '1px solid gray',
                                backgroundColor: '#1f2937', // matches Tailwind's bg-gray-800
                                color: 'white',
                            }}
                        />


                        <input name="city" placeholder="City" value={formData.city} onChange={handleChange} className="p-3 rounded-md border-1 border-gray-400 bg-gray-800" required />
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
                                    onChange={handleChange}
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
        <div className="min-h-screen px-6 py-4 flex items-center justify-center complex-background animate__animated animate__fadeIn">
            <nav className="w-full bg-white shadow-md backdrop-blur-sm fixed top-0 left-0 z-50 flex justify-center">
                <div className="max-w-7xl mx-auto px-6 py-3 flex items-center">
                    <img src={logo} alt="Faucek Logo" className="h-12" />
                </div>
            </nav>
            <div className="flex flex-col mt-14 md:flex-row max-w-6xl w-full rounded-xl overflow-hidden shadow-2xl backdrop-blur-md bg-gradient-to-br from-gray-800 via-gray-900 to-black  animate__animated animate__fadeInUp">
                <div className="relative w-full md:w-1/2 h-96 md:h-auto">
                    <img src={banner} alt="Team" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center p-6">
                        <h2 className="text-4xl md:text-5xl font-extrbold text-white mb-2 animate__animated animate__zoomIn">
                            We are <span className="faucek-gradient font-bold">FAUCEK</span>
                        </h2>
                        <p className="text-lg md:text-xl text-gray-200 animate__animated animate__fadeInUp">Empowering Innovation Together</p>
                    </div>
                </div>
                <div className="w-full md:w-1/2 bg-gray-900 bg-opacity-80 p-8 space-y-6 text-white animate__animated animate__fadeInUp">
                    <p className='hidden md:block text-white text-5xl font-bold text-center'>Welcome!</p>
                    <p className='text-center text-gray-300 mb-16'>Kindly fill in the complete details for generating your ID</p>
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
                        }} className="space-y-4">
                        {renderStep()}
                        <div className="flex justify-between pt-4">
                            {step > 1 && !isLoading && <button type="button" onClick={prevStep} className="px-6 py-3 text-white rounded-lg bg-gray-700 hover:bg-gray-600 transition">Previous</button>}
                            {step < 6
                                ? !isLoading && <button type="button" onClick={nextStep} className="px-6 py-3 text-white rounded-lg bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 hover:opacity-90 transition">Next</button>
                                : !isLoading && <button type="submit" className="px-6 py-3 text-white rounded-lg bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 hover:opacity-90 transition">Generate Badge</button>}
                            {isLoading && <p className="text-white">Generating Badge...</p>}
                        </div>
                    </form>
                </div>
            </div>
            {isBadgeVisible && (
                <BadgeModal
                    isOpen={isBadgeVisible}
                    onClose={() => setIsBadgeVisible(false)}
                    userData={formData}
                />
            )}
        </div>
    );
};

export default MultiStepForm;
