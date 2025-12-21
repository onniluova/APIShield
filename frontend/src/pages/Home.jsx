import Navbar from "../components/Navbar";
import Button from "../components/Button";
import Analytics from "../components/Analytics";
import { useNavigate } from "react-router";

const Home = () => {
    let navigate = useNavigate();

    const handleLogoutClick = async () => {
        localStorage.clear()
        navigate("/");
    };

    return (
        <div className="font-mono min-h-screen bg-gradient-to-br from-emerald-700 to-violet-700 flex flex-col p-4 gap-5">

            <div className="max-w-md">
                <Navbar>
                    <div className="flex gap-4">
                        <Button className="text-white lg:text-xl sm:text-xs m-1 bg-white/7 hover:bg-white/25">Profile</Button>
                        <Button className="text-white lg:text-xl sm:text-xs m-1 bg-white/7 hover:bg-white/25">Manage</Button>
                        <Button onClick={handleLogoutClick} className="text-white lg:text-xl sm:text-xs m-1 bg-white/7 hover:bg-white/25">Logout</Button>
                    </div>
                </Navbar>
            </div>

            <div className="flex flex-grow flex-col justify-center items-center gap-2">
                <Analytics></Analytics>
            </div>

            <div className="text-center bottom-6 text-white text-xs">
                © 2025 APIShield - Created by Onni Luova
            </div>
        </div>
    );
}

export default Home;