import React from 'react';
import { User, Palette, MessageCircle } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const BottomNav = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (path) => location.pathname === path;

    if (location.pathname === '/' || location.pathname === '/connect') return null;

    return (
        <div className="absolute bottom-6 left-4 right-4 bg-white/90 backdrop-blur-xl border border-white/20 rounded-3xl py-4 px-8 flex justify-between items-center z-50">
            <button
                onClick={() => navigate('/draw')}
                className={`flex flex-col items-center gap-1 transition-colors ${isActive('/draw') ? 'text-[#fa9a00]' : 'text-gray-400'}`}
            >
                <Palette size={24} />
                <span className="text-xs font-medium">Draw</span>
            </button>

            <button
                onClick={() => navigate('/messages')}
                className={`flex flex-col items-center gap-1 transition-colors ${isActive('/messages') ? 'text-[#fa9a00]' : 'text-gray-400'}`}
            >
                <MessageCircle size={24} />
                <span className="text-xs font-medium">Messages</span>
            </button>

            <button
                onClick={() => navigate('/settings')}
                className={`flex flex-col items-center gap-1 transition-colors ${isActive('/settings') ? 'text-[#fa9a00]' : 'text-gray-400'}`}
            >
                <User size={24} />
                <span className="text-xs font-medium">Profile</span>
            </button>
        </div>
    );
};

export default BottomNav;
