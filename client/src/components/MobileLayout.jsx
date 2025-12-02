import React from 'react';

const MobileLayout = ({ children }) => {
    return (
        <div className="min-h-screen w-full bg-gray-100 sm:flex sm:items-center sm:justify-center sm:p-4 md:p-8">
            <div className="w-full h-screen sm:max-w-[400px] sm:h-[850px] sm:max-h-[90vh] bg-white sm:rounded-[3rem] sm:border-[8px] sm:border-gray-900 sm:shadow-2xl overflow-hidden relative flex flex-col">
                {/* Notch (only visible on desktop/framed view) */}
                <div className="hidden sm:block absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-gray-900 rounded-b-2xl z-50"></div>

                {/* Content */}
                <div className="flex-1 w-full h-full overflow-hidden relative bg-white">
                    {children}
                </div>

                {/* Home Indicator (simulated - only on desktop) */}
                <div className="hidden sm:block absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-900/20 rounded-full z-50"></div>
            </div>
        </div>
    );
};

export default MobileLayout;
