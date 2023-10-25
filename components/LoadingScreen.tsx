// import React from 'react';
// import '@/app/globals.css'
//
// export const LoadingScreen = () => {
//     return (
//         <div className="loading-screen">
//             <div className="dot"></div>
//             <div className="dot"></div>
//             <div className="dot"></div>
//             <div className="dot"></div>
//             <div className="dot"></div>
//         </div>
//     );
// };
import Image from "next/image";
import React from "react";

export const LoadingScreen = () => {
    return (

        <div className="absolute right-1/2 bottom-1/2 transform translate-x-1/2 translate-y-1/2">
            <div className="p-4 bg-gradient-to-tr animate-spin from-pink-400 to-blue-500 via-purple-500 rounded-full">
                <div className="bg-white rounded-full">
                    <div className="w-24 h-24 rounded-full"></div>
                </div>
            </div>
        </div>
);
};