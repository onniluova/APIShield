import React from "react";

export default function Input({ className = "", ...props}) {
    return (
    <input 
        className={`px-5 w-full py-2 bg-blue-200 font-semibold rounded-lg shadow-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${className}`}
        type="text"
        {...props}
    >
    </input>
    )
}