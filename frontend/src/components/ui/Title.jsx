import React from "react";

export default function Button({ children, className = "", ...props }) {
    return (
    <h1 
        className={`px-4 py-2 bg-transparent transition-all ${className}`}
        {...props}
    >
        {children}
    </h1>
    )
}