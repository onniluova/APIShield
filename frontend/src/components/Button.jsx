import React from "react";

export default function Button({ children, onClick, className = "", ...props }) {
    return (
    <button 
        onClick={onClick}
        className={`px-4 py-2 font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none transition-all ${className}`}
        {...props}
    >
        {children}
    </button>
    )
}