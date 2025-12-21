export default function Navbar({ children, className = "", ...props }) {
    return (
    <nav 
        className={`flex flex-row ${className}`}
        {...props}
    >
        <ol>
            {children}
        </ol>
    </nav>
    )
}