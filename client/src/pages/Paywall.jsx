import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Heart, MessageCircle, Sparkles } from 'lucide-react';

const Paywall = () => {
    const navigate = useNavigate();
    const [selectedPlan, setSelectedPlan] = useState('lifetime');

    return (
        <div className="h-full flex flex-col bg-gray-50 overflow-y-auto">
            {/* Close Button */}
            <div className="flex justify-end p-4">
                <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-gray-600">
                    <X size={28} />
                </button>
            </div>

            {/* Logo */}
            <div className="flex justify-center mb-4">
                <img src="/logo.png" alt="Cardly Logo" className="w-32 h-32 object-contain" />
            </div>

            {/* Title */}
            <div className="text-center px-6 mb-6">
                <h1 className="text-3xl font-bold text-black mb-1">Get 33% off forever.</h1>
                <p className="text-lg italic text-gray-600">a christmas deal that lasts for life.</p>
            </div>

            {/* Features */}
            <div className="px-8 mb-6 space-y-3">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center flex-shrink-0">
                        <Heart size={20} className="text-[#fa9a00]" />
                    </div>
                    <p className="text-base text-gray-800">Free Pro for your partner (2 for 1)</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center flex-shrink-0">
                        <MessageCircle size={20} className="text-[#fa9a00]" />
                    </div>
                    <p className="text-base text-gray-800">Unlimited love letters</p>
                </div>
            </div>

            {/* Plans */}
            <div className="px-6 mb-6 space-y-4">
                {/* Lifetime Plan */}
                <button
                    onClick={() => setSelectedPlan('lifetime')}
                    className={`w-full p-4 rounded-2xl transition-all ${selectedPlan === 'lifetime'
                        ? 'bg-white border-2 border-[#fa9a00]'
                        : 'bg-white border-2 border-gray-200'
                        }`}
                >
                    <div className="flex items-center justify-between">
                        <div className="text-left">
                            <p className="font-bold text-lg text-black">Lifetime plan</p>
                            <div className="flex items-center gap-2">
                                <span className="text-gray-400 line-through">34,99 €</span>
                                <span className="font-bold text-lg text-black">22,99 €</span>
                                <span className="text-gray-600">one-time</span>
                            </div>
                        </div>
                        <div className="bg-[#fa9a00] text-white px-3 py-1 rounded-full text-sm font-semibold">
                            33% OFF
                        </div>
                    </div>
                </button>

                {/* Monthly Plan */}
                <button
                    onClick={() => setSelectedPlan('monthly')}
                    className={`w-full p-4 rounded-2xl transition-all ${selectedPlan === 'monthly'
                        ? 'bg-orange-100 border-2 border-[#fa9a00]'
                        : 'bg-orange-50 border-2 border-orange-200'
                        }`}
                >
                    <div className="flex items-center justify-between">
                        <div className="text-left">
                            <p className="font-bold text-lg text-black">Monthly plan</p>
                            <div className="flex items-center gap-2">
                                <span className="text-gray-400 line-through">6,99 €</span>
                                <span className="font-bold text-lg text-black">3,99 €</span>
                                <span className="text-gray-600">per month</span>
                            </div>
                        </div>
                        <div className="bg-[#fa9a00] text-white px-3 py-1 rounded-full text-sm font-semibold">
                            33% OFF
                        </div>
                    </div>
                </button>
            </div>

            {/* Footer Links */}
            <div className="flex justify-center gap-4 pb-8 text-sm text-gray-500">
                <button className="hover:text-gray-700">Restore</button>
                <button className="hover:text-gray-700">Terms of Use</button>
                <button className="hover:text-gray-700">Privacy Policy</button>
            </div>
        </div>
    );
};

export default Paywall;
