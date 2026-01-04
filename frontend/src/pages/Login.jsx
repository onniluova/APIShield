import { useEffect, useState, useContext } from 'react';
import { useNavigate } from "react-router";
import Button from '../components/Button';
import Header from '../components/Header';
import Input from '../components/Input';
import { BeatLoader } from 'react-spinners';
import { UserContext } from '../context/UserContext';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { useGoogleLogin } from '@react-oauth/google';
import { loginAuth, registerAuth, googleAuth } from '../services/authService';

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { user, setUser } = useContext(UserContext);
    const { theme, toggleTheme } = useTheme()
    let navigate = useNavigate();

    const loginWithGoogle = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setLoading(true);
            try {
                const response = await googleAuth(tokenResponse.access_token);
                
                const { token, role, user_id, username } = response.data;

                localStorage.setItem("authToken", token);
                localStorage.setItem("userDetails", JSON.stringify({ user_id, username, role }));
                setUser({ user_id, username, role });
                
                toast.success(`Welcome ${username}`);
                navigate("/dashboard");
            } catch (error) {
                console.error("Google Login Error:", error);
                toast.error("Google authentication failed.");
            } finally {
                setLoading(false);
            }
        },
        onError: () => toast.error("Google Login Failed"),
    });

    const handleGoogleClick = () => {
        toast.dismiss();
        loginWithGoogle();
    };

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }) {
        let { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    useEffect(() => {
        localStorage.clear();
    }, []);

    const handleLoginClick = async () => {
        toast.dismiss();
        setLoading(true)

        try {
            const response = await loginAuth(username, password);
            const { token, role, user_id } = response.data;

            localStorage.setItem("authToken", token);
            localStorage.setItem("userDetails", JSON.stringify({ user_id, username, role }));

            setUser({ user_id, username, role });

            toast.success(`Welcome back, ${username}`);
            navigate("/dashboard");
        } catch(error) {
            const message = error.response?.data?.message || "Login failed. Please try again.";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterClick = async () => {
        toast.dismiss();
        setLoading(true)

            try {
                const response = await registerAuth(username, password);
                toast.success("Account created succesfully!");
            } catch(error) {
                const feedback = error.response?.data?.error?.warning;
                const suggestions = error.response?.data?.error?.suggestions;

                console.log(error.data)
                
                toast.error(
                    <div>
                        {feedback}
                        {suggestions}
                    </div>
                )
        } finally {
            setLoading(false);
        }
    };

    return (
        <div 
            onMouseMove={handleMouseMove}
            className="min-h-screen dark:bg-slate-900 dark:bg-none bg-gradient-to-br from-emerald-700 to-violet-700 flex items-center justify-center p-4 relative overflow-hidden"
        >
            <Button 
                onClick={toggleTheme}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all border border-white/10 text-white shadow-lg cursor-pointer z-50"
                aria-label="Toggle Dark Mode"
            >
                {theme === 'dark' ? <p>Dark</p> : <p>Light</p>}
            </Button>
            <motion.div 
                style={{
                    maskImage: useMotionTemplate`radial-gradient(350px circle at ${mouseX}px ${mouseY}px, black, transparent)`,
                    WebkitMaskImage: useMotionTemplate`radial-gradient(350px circle at ${mouseX}px ${mouseY}px, black, transparent)`,
                }}
                className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff20_1px,transparent_1px),linear-gradient(to_bottom,#ffffff20_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"
            />
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl w-full max-w-md p-8 border border-white/20 relative z-10">
                
                <div className="text-center mb-8">
                    <p className="text-white text-sm">
                        Vahti
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
                                <BeatLoader color="white" loading={loading} size={8} margin={2} />
                            ) : (
                                "Sign In"
                            )}
                        </Button>

                        <Button onClick={handleRegisterClick} disabled={loading} 
                            className="w-full text-white border border-gray-200 hover:bg-slate-200 hover:text-gray-500 shadow-none"
                        >
                            {loading ? (
                                <BeatLoader color="white" loading={loading} size={5} margin={2} />
                            ) : (
                                "Create Account"
                            )}
                        </Button>
                        
                        <div className="relative flex py-2 items-center">
                            <div className="flex-grow border-t border-gray-200"></div>
                            <span className="flex-shrink mx-4 text-white text-xs">OR</span>
                            <div className="flex-grow border-t border-gray-200"></div>
                        </div>

                        <Button 
                            onClick={handleGoogleClick}
                            className="w-full bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 flex items-center justify-center gap-2"
                        >
                            <img 
                                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                                alt="Google" 
                                className="w-5 h-5" 
                            />
                            <span>Sign in with Google</span>
                        </Button>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-6 text-white text-xs">
                © 2025 Vahti - Created by Onni Luova
            </div>
        </div>
    );
}

export default Login;