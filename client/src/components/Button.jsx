import React from 'react';

const Button = ({ children, onClick, variant = 'primary', className = '', type = 'button', disabled = false }) => {
    const baseStyles = "w-full py-4 px-6 rounded-2xl font-semibold text-base transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";

    const variants = {
        primary: "bg-gradient-to-r from-[#fa9a00] to-[#ffb347] text-white hover:-translate-y-1",
        secondary: "bg-white text-[#fa9a00] border-2 border-[#fa9a00] hover:bg-orange-50",
        text: "bg-transparent text-[#fa9a00] hover:bg-orange-50/50"
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${variants[variant]} ${className}`}
        >
            {children}
        </button>
    );
};

export default Button;
