import { useState } from 'react';
import { useNavigate } from "react-router";
import Button from '../components/Button';
import Header from '../components/Header';
import Input from '../components/Input';
import { RotateLoader } from 'react-spinners';
import { loginAuth, registerAuth } from '../services/authService';

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    let navigate = useNavigate();

    const handleLoginClick = async () => {
        setLoading(true)

        try {
            const response = await loginAuth(username, password);
            const { token, role } = response.data;

            localStorage.setItem("authToken", token);
            localStorage.setItem("userRole", role);

            console.log("Success", response.data)
        } catch(error) {
            console.log("Login failed:", error);
        } finally {
            setLoading(false);
            navigate("/home");
        }
    };

    const handleRegisterClick = async () => {
        setLoading(true)

        try {
            const response = await registerAuth(username, password);
            console.log("Success", response.data)

        } catch(error) {
            console.log("Registering failed:", error);
        } finally {
            setLoading(false);
            navigate("/home");
        }
    };

    return (
        <div className="font-mono min-h-screen bg-gradient-to-br from-emerald-700 to-violet-700 flex items-center justify-center p-4">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl w-full max-w-md p-8 border border-white/20">
                
                <div className="text-center mb-8">
                    <p className="text-white text-sm">
                        APIShield
                    </p>
                    <Header className="text-4xl font-bold text-white mb-2">
                        Login
                    </Header>
                </div>

                <div className="flex flex-col gap-4">
                    <div>
                        <label className="block text-xs font-medium text-white mb-1 ml-1">
                            Username
                        </label>
                        <Input 
                            placeholder="Enter your username" 
                            className="bg-gray-50 focus:bg-white transition-colors"
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    
                    <div>
                        <label className="block text-xs font-medium text-white mb-1 ml-1">
                            Password
                        </label>
                        <Input 
                            type="password"
                            placeholder="••••••••" 
                            className="bg-gray-50 focus:bg-white transition-colors"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="mt-4 flex flex-col gap-3">
                        <Button onClick={handleLoginClick} disabled={loading}
                            className="w-full py-3 text-white border border-gray-200 shadow-slate-500/30 hover:bg-slate-200 hover:text-gray-500"
                        >
                            {loading ? (
                                <RotateLoader color="white" loading={loading} size={8} margin={2} />
                            ) : (
                                "Sign In"
                            )}
                        </Button>
                        
                        <div className="relative flex py-2 items-center">
                            <div className="flex-grow border-t border-gray-200"></div>
                            <span className="flex-shrink mx-4 text-white text-xs">OR</span>
                            <div className="flex-grow border-t border-gray-200"></div>
                        </div>

                        <Button onClick={handleRegisterClick} disabled={loading} 
                            className="w-full text-white border border-gray-200 hover:bg-slate-200 hover:text-gray-500 shadow-none"
                        >
                            {loading ? (
                                <RotateLoader color="white" loading={loading} size={8} margin={2} />
                            ) : (
                                "Create Account"
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-6 text-white text-xs">
                © 2025 APIShield - Created by Onni Luova
            </div>
        </div>
    );
}

export default Login;