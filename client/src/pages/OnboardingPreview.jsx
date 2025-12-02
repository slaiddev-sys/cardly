import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { MessageCircle } from 'lucide-react';

const OnboardingPreview = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { drawing } = location.state || {};

    const handleFinish = () => {
        navigate('/messages');
    };

    const handleShare = () => {
        // In a real app, this would use the Web Share API
        alert('Sharing functionality would open here!');
    };

    if (!drawing) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-6">
                <p>No drawing found.</p>
                <Button onClick={() => navigate('/draw')}>Go Back</Button>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col items-center pt-12 px-6 bg-white animate-fade-in">
            <h1 className="text-2xl font-bold text-black mb-8">Your Love Doodle</h1>

            <div className="w-full max-w-xs aspect-square bg-white rounded-3xl border border-gray-100 p-4 mb-8 transform rotate-[-2deg]">
                <img src={drawing} alt="Your Doodle" className="w-full h-full object-contain" />
            </div>

            <p className="text-gray-400 text-center mb-8 text-sm px-8">
                Share this with your partner to invite them!
            </p>

            <div className="w-full max-w-sm flex flex-col gap-4 mt-auto mb-8">
                <Button onClick={handleShare} variant="primary" className="bg-[#5D4037] text-white hover:bg-[#4E342E] shadow-none flex items-center justify-center gap-2">
                    <MessageCircle size={20} /> Share via iMessage
                </Button>
                <button onClick={handleFinish} className="text-gray-400 font-medium py-4">
                    Finish
                </button>
            </div>
        </div>
    );
};

export default OnboardingPreview;
