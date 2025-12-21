import { useState } from 'react';
import Button from '../components/Button';
import Header from '../components/Header';
import Input from '../components/Input';

const Login = () => {
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
                        />
                    </div>

                    <div className="mt-4 flex flex-col gap-3">
                        <Button className="w-full py-3 text-white border border-gray-200 shadow-slate-500/30 hover:bg-slate-200 hover:text-gray-500">
                            Sign In
                        </Button>
                        
                        <div className="relative flex py-2 items-center">
                            <div className="flex-grow border-t border-gray-200"></div>
                            <span className="flex-shrink mx-4 text-white text-xs">OR</span>
                            <div className="flex-grow border-t border-gray-200"></div>
                        </div>

                        <Button className="w-full text-white border border-gray-200 hover:bg-slate-200 hover:text-gray-500 shadow-none">
                            Create Account
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