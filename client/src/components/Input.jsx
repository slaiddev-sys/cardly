import React from 'react';

const Input = ({ label, value, onChange, placeholder, type = "text" }) => {
    return (
        <div className="flex flex-col gap-2 w-full">
            {label && <label className="text-[#8B7355] font-bold text-sm ml-1 uppercase tracking-wider">{label}</label>}
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full p-4 rounded-2xl border-2 border-orange-100 bg-white/80 backdrop-blur-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#fa9a00] focus:ring-4 focus:ring-orange-100/50 transition-all"
            />
        </div>
    );
};

export default Input;
