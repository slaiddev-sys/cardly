import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Copy, ArrowRight, ArrowLeft } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import { useSocket } from '../context/SocketProvider';

const Connect = () => {
    const navigate = useNavigate();
    const { joinRoom, error } = useSocket();
    const [mode, setMode] = useState('landing'); // landing, create, join
    const [username, setUsername] = useState('');
    const [partnerCode, setPartnerCode] = useState('');
    const [generatedCode, setGeneratedCode] = useState('');
    const [copySuccess, setCopySuccess] = useState(false);

    useEffect(() => {
        if (mode === 'create' && !generatedCode) {
            const code = Math.random().toString(36).substring(2, 8).toUpperCase();
            setGeneratedCode(code);
        }
    }, [mode, generatedCode]);

    const handleCreate = () => {
        if (!username.trim()) return;
        joinRoom(generatedCode, username);
        navigate('/draw');
    };

    const handleJoin = () => {
        if (!username.trim() || !partnerCode.trim()) return;
        joinRoom(partnerCode, username);
        navigate('/draw');
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedCode);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };

    const renderLanding = () => (
        <div className="flex flex-col items-center justify-center h-full px-6 gap-8 animate-fade-in relative">
            <button
                onClick={() => navigate('/')}
                className="absolute top-4 left-4 text-gray-400 font-medium text-sm hover:text-gray-600 transition-colors"
            >
                Sign Out
            </button>

            <div className="flex flex-col items-center gap-6 mb-8 transform transition-all hover:scale-105 duration-500">
                <div className="bg-gradient-to-br from-orange-100 to-white p-8 rounded-[2rem] border border-white">
                    <img src="/logo.png" alt="Love Canvas Logo" className="w-16 h-16 object-contain" />
                </div>
                <div className="text-center">
                    <h1 className="text-6xl font-bold text-[#fa9a00] font-handwriting mb-2">Cardly</h1>
                    <p className="text-[#8B7355] text-lg font-medium tracking-wide">Stay connected through drawings</p>
                </div>
            </div>

            <div className="w-full max-w-xs flex flex-col gap-4">
                <Button onClick={() => setMode('create')} variant="primary" className="text-base py-5">
                    + Create Box Card
                </Button>
                <Button onClick={() => setMode('join')} variant="secondary" className="text-base py-5">
                    Join Box Card
                </Button>
            </div>
        </div>
    );

    const [wizardStep, setWizardStep] = useState(1);
    const [heartName, setHeartName] = useState('');

    const handleCreateHeart = () => {
        if (!username.trim() || !heartName.trim()) return;
        // In a real app, we'd save the heart name. For now, we just generate the code.
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();
        setGeneratedCode(code);
        setWizardStep(2);
    };

    const handleStartDrawing = () => {
        joinRoom(generatedCode, username);
        navigate('/draw?onboarding=true');
    };

    const renderCreate = () => (
        <div className="h-full px-6 pt-12 animate-slide-up flex flex-col">
            <button onClick={() => wizardStep === 1.5 ? setWizardStep(1) : setMode('landing')} className="flex items-center text-[#fa9a00] font-bold mb-4 hover:-translate-x-1 transition-transform">
                <ArrowLeft size={24} className="mr-2" /> Back
            </button>

            {wizardStep === 1 && (
                <div className="flex flex-col items-center flex-1">
                    <div className="bg-orange-50 p-6 rounded-full mb-6">
                        <img src="/logo.png" alt="Box card" className="w-20 h-20 object-contain" />
                    </div>
                    <h2 className="text-3xl font-bold text-black mb-2">Create Your Box card</h2>
                    <p className="text-gray-500 text-center mb-8 max-w-xs">This will create a shared space for you and your partner</p>

                    <div className="w-full max-w-sm flex flex-col gap-6">
                        <Input
                            label="Box card Name"
                            placeholder="e.g., Me & Sarah"
                            value={heartName}
                            onChange={(e) => setHeartName(e.target.value)}
                        />
                    </div>

                    <div className="mt-auto w-full max-w-sm mb-4">
                        <Button onClick={() => setWizardStep(1.5)} disabled={!heartName} variant="primary" className="bg-[#5D4037] text-white hover:bg-[#4E342E] shadow-none">
                            Next
                        </Button>
                    </div>
                </div>
            )}

            {wizardStep === 1.5 && (
                <div className="flex flex-col items-center flex-1">
                    <div className="bg-orange-50 p-6 rounded-full mb-6">
                        <img src="/logo.png" alt="User" className="w-20 h-20 object-contain" />
                    </div>
                    <h2 className="text-3xl font-bold text-black mb-2">What's your name?</h2>
                    <p className="text-gray-500 text-center mb-8 max-w-xs">So your partner knows it's you</p>

                    <div className="w-full max-w-sm flex flex-col gap-6">
                        <Input
                            label="Your Name"
                            placeholder="Enter your name"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div className="mt-auto w-full max-w-sm mb-4">
                        <Button onClick={handleCreateHeart} disabled={!username} variant="primary" className="bg-[#5D4037] text-white hover:bg-[#4E342E] shadow-none">
                            Create Box card
                        </Button>
                    </div>
                </div>
            )}

            {wizardStep === 2 && (
                <div className="flex flex-col items-center flex-1 justify-center">
                    <div className="bg-[#fa9a00] p-6 rounded-full mb-6 text-white">
                        <ArrowRight size={40} className="rotate-[-45deg]" />
                        {/* Using a checkmark icon would be better, but ArrowRight is imported. Let's stick to simple for now or import Check if needed. 
                           Actually, let's use a simple checkmark using SVG or just the text for now to avoid import errors if Check isn't imported. 
                           Wait, I can import Check. Let's assume I'll add it to imports later. For now, I'll use a placeholder or just the text.
                           Let's use the existing imports. Heart is good.
                        */}
                    </div>
                    <h2 className="text-3xl font-bold text-black mb-2">Box card Created!</h2>
                    <p className="text-gray-500 text-center mb-8">Share this code with your partner</p>

                    <div className="bg-[#F5F0EB] py-4 px-12 rounded-2xl mb-8">
                        <span className="text-4xl font-bold text-[#5D4037] tracking-widest">{generatedCode}</span>
                    </div>

                    <div className="w-full max-w-sm flex flex-col gap-4">
                        <Button onClick={copyToClipboard} variant="primary" className="bg-[#fa9a00] text-white hover:bg-[#e08a00] shadow-none flex items-center justify-center gap-2">
                            <Copy size={20} /> {copySuccess ? 'Copied!' : 'Copy Code'}
                        </Button>
                        <Button
                            onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`Join my Box card on Cardly! Code: ${generatedCode}`)}`, '_blank')}
                            variant="secondary"
                            className="border-[#25D366] text-[#25D366] hover:bg-green-50 flex items-center justify-center gap-2"
                        >
                            Share via WhatsApp
                        </Button>
                        <Button onClick={() => setWizardStep(3)} variant="text" className="text-[#fa9a00] hover:bg-orange-50">
                            Next
                        </Button>
                    </div>
                </div>
            )}

            {wizardStep === 3 && (
                <div className="flex flex-col items-center flex-1 justify-center">
                    <div className="mb-8">
                        {/* Pencil Icon - I need to import Pencil. For now, I'll use Heart as placeholder or just text. 
                            Actually, I will add Pencil to the imports in a separate call or just use what I have.
                            Let's use a simple SVG for the pencil to avoid import issues in this block.
                         */}
                        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#fa9a00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-black mb-2 text-center">Draw Your First<br />Love Doodle</h2>
                    <p className="text-gray-500 text-center mb-12 max-w-xs">Create a doodle to share with your partner along with your invite code!</p>

                    <div className="w-full max-w-sm flex flex-col gap-4 mt-auto mb-8">
                        <Button onClick={handleStartDrawing} variant="primary" className="bg-[#5D4037] text-white hover:bg-[#4E342E] shadow-none">
                            Start Drawing
                        </Button>
                        <button onClick={() => navigate('/draw')} className="text-gray-400 font-medium py-2">
                            Skip
                        </button>
                    </div>
                </div>
            )}
        </div>
    );

    const renderJoin = () => (
        <div className="h-full px-6 pt-12 animate-slide-up">
            <button onClick={() => setMode('landing')} className="flex items-center text-[#fa9a00] font-bold mb-8 hover:-translate-x-1 transition-transform">
                <ArrowLeft size={24} className="mr-2" /> Back
            </button>

            <div className="flex flex-col items-center mb-10">
                <div className="bg-orange-50 p-4 rounded-full mb-4">
                    <Heart size={40} className="text-[#fa9a00]" fill="#fa9a00" />
                </div>
                <h2 className="text-3xl font-bold text-[#fa9a00]">Join Partner</h2>
                <p className="text-[#8B7355] text-center mt-2 max-w-xs">Enter the code your partner shared with you</p>
            </div>

            <div className="flex flex-col gap-6 max-w-sm mx-auto">
                <Input
                    label="Your Name"
                    placeholder="Enter your name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <Input
                    label="Couple Code"
                    placeholder="Enter 6-character code"
                    value={partnerCode}
                    onChange={(e) => setPartnerCode(e.target.value.toUpperCase())}
                />

                <div className="mt-4">
                    <Button onClick={handleJoin} disabled={!username || !partnerCode} variant="primary">
                        Join <ArrowRight size={20} />
                    </Button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="h-full w-full overflow-y-auto">
            {mode === 'landing' && renderLanding()}
            {mode === 'create' && renderCreate()}
            {mode === 'join' && renderJoin()}
        </div>
    );
};

export default Connect;
