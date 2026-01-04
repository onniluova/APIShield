import Button from "../ui/Button";
import { useNavigate } from "react-router";
import { HiOutlineLogout, HiCog, HiHome } from "react-icons/hi";
import toast from 'react-hot-toast';
import { useContext } from 'react';
import { UserContext } from "../../context/UserContext";
import { logoutAuth } from "../../services/authService";

export default function Navbar({ children, className = "", ...props }) {
    let navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);

    const handleLogoutClick = async () => {
        try {
            await logoutAuth();
        } catch (error) {
            console.error("Logout request failed", error);
        } finally {
            localStorage.clear();
            setUser(null);
            
            toast.success("Logged out successfully.");
            navigate("/");
        }
    };

    const handleSettingsClick = async () => {
        navigate("/settings")
        toast('This is a UI preview. Settings are not saved to the database.', {
                icon: '🚧',
            });
    };

    const handleDashboardClick = async () => {
        navigate("/dashboard");
    };

    return (
    <nav 
        className={`flex flex-row ${className}`}
        {...props}
    >
        <ol>
            {children}
            <div className="flex flex-row w-full items-center justify-center max-w-lg gap-3">
                <Button onClick={handleDashboardClick} className="flex items-center justify-center sm:justify-start w-full px-3 py-3 text-white bg-white/7 hover:bg-white/25 transition-all">
                    <HiHome className="text-xl" /> 
                    <span className="hidden sm:inline ml-2 lg:text-xl">Dashboard</span>
                </Button>

                <Button onClick={handleSettingsClick} className="flex items-center justify-center sm:justify-start w-full px-3 py-3 text-white bg-white/7 hover:bg-white/25 transition-all">
                    <HiCog className="text-xl" /> 
                    <span className="hidden sm:inline ml-2 lg:text-xl">Settings</span>
                </Button>

                <Button onClick={handleLogoutClick} className="flex items-center justify-center sm:justify-start w-full px-3 py-3 text-white bg-white/7 hover:bg-white/25 transition-all">
                    <HiOutlineLogout className="text-xl" /> 
                    <span className="hidden sm:inline ml-2 lg:text-xl">Logout</span>
                </Button>
            </div>
        </ol>
    </nav>
    )
}