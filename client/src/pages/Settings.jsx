import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Sparkles, LogOut, ChevronRight, User } from 'lucide-react';
import { useSocket } from '../context/SocketProvider';

const Settings = () => {
    const navigate = useNavigate();
    const { username, room } = useSocket();
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <div className="h-full flex flex-col pt-8 pb-24 px-6 overflow-y-auto bg-gray-50">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-black">Settings</h1>
            </div>

            {/* User Info Card */}
            <div className="bg-white rounded-3xl p-6 mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#fa9a00] rounded-full flex items-center justify-center">
                        <User size={24} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-black">{username || 'Guest'}</h2>
                        <p className="text-sm text-gray-500">Room: {room || 'Not connected'}</p>
                    </div>
                </div>
            </div>

            {/* Settings Options */}
            <div className="bg-white rounded-3xl overflow-hidden mb-6">
                {/* Notifications Toggle */}
                <div className="w-full flex items-center gap-4 p-4 border-b border-gray-100">
                    <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center">
                        <Bell size={20} className="text-[#fa9a00]" />
                    </div>
                    <div className="flex-1 text-left">
                        <p className="font-semibold text-black">Notifications</p>
                        <p className="text-xs text-gray-500">Receive drawing alerts</p>
                    </div>
                    <button
                        onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                        className={`relative w-12 h-6 rounded-full transition-colors ${notificationsEnabled ? 'bg-[#fa9a00]' : 'bg-gray-300'
                            }`}
                    >
                        <div
                            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${notificationsEnabled ? 'translate-x-6' : 'translate-x-0'
                                }`}
                        />
                    </button>
                </div>

                {/* Upgrade Plan */}
                <button onClick={() => navigate('/paywall')} className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                    <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center">
                        <Sparkles size={20} className="text-[#fa9a00]" />
                    </div>
                    <div className="flex-1 text-left">
                        <p className="font-semibold text-black">Upgrade plan</p>
                        <p className="text-xs text-gray-500">Get premium features</p>
                    </div>
                    <ChevronRight size={20} className="text-gray-400" />
                </button>
            </div>

            {/* Logout Button */}
            <button
                onClick={handleLogout}
                className="w-full bg-red-50 text-red-600 rounded-2xl py-4 px-6 font-semibold flex items-center justify-center gap-2 hover:bg-red-100 transition-colors mb-4"
            >
                <LogOut size={20} />
                Log Out
            </button>

            {/* Delete Account Text */}
            <button className="text-center text-sm text-gray-400 hover:text-red-500 transition-colors">
                Delete account
            </button>
        </div>
    );
};

export default Settings;
