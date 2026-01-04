export default function Button({ children, onClick, className = "", ...props }) {
    return (
    <button 
        onClick={onClick}
        className={`px-4 py-2 font-semibold rounded-lg shadow-md cursor-pointer focus:outline-none transition-all ${className}`}
        {...props}
    >
        {children}
    </button>
    )
}