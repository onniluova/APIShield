import React from "react";

export default function Button({ children, onClick, className = "", ...props }) {
    return (
    <button 
        onClick={onClick}
        className={`px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${className}`}
        {...props}
    >
        {children}
    </button>
    )
}