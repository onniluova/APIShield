import { useEffect, useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { useTheme } from '../context/ThemeContext';
import Header from "../components/Header"
import Navbar from "../components/Navbar"
import Button from "../components/Button"
import Input from "../components/Input"
import toast from 'react-hot-toast';

const Settings = () => {
    const { user } = useContext(UserContext);
    const { theme, toggleTheme } = useTheme();
    
    const [settings, setSettings] = useState({
        checkInterval: 5,
        requestTimeout: 10,
        emailAlerts: true,
        autoRefreshDashboard: true
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSave = async () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            toast('This is a UI preview. Settings were not saved to the database.', {
                icon: '🚧',
            });
        }, 800);
    };
    const [activeTab, setActiveTab] = useState('profile');

    const tabs = [
        { id: 'profile', label: 'Profile' },
        { id: 'monitoring', label: 'Monitoring' },
        { id: 'app', label: 'App' },
        { id: 'account', label: 'Account' }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-emerald-700 to-violet-700 dark:bg-none dark:bg-slate-900">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

            <div className="p-4 z-20">
                <Navbar />
            </div>

            <div className="flex-grow flex items-center justify-center w-full px-4 z-10 relative">
                
                <div className="w-full max-w-lg flex flex-col gap-4">
                    
                    <div className="flex flex-col gap-1 mb-2 text-center sm:text-left">
                        <Header className='text-white font-bold text-3xl tracking-tight'>Settings (UI Preview)</Header>
                        <p className="text-white/60 text-sm">Manage your account preferences.</p>
                    </div>

                    <div className="flex justify-center sm:justify-start overflow-x-auto gap-2 pb-2 scrollbar-hide">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                                    activeTab === tab.id 
                                    ? 'bg-white text-emerald-900 shadow-lg scale-105' 
                                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl p-6 h-[500px] flex flex-col justify-between">
                        
                        {activeTab === 'profile' && (
                            <div className="flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-300">
                                <h2 className="text-white font-semibold text-lg border-b border-white/10 pb-2">Profile Information</h2>
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-medium text-white/80 uppercase tracking-wider">Username</label>
                                        <div className="bg-black/20 text-white/90 px-4 py-3 rounded-lg border border-white/5">
                                            {user?.username || "Guest"}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-medium text-white/80 uppercase tracking-wider">Role</label>
                                        <div className="bg-black/20 text-white/90 px-4 py-3 rounded-lg border border-white/5">
                                            {user?.role || "User"}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'monitoring' && (
                            <div className="flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-300 h-full">
                                <h2 className="text-white font-semibold text-lg border-b border-white/10 pb-2">Monitoring Defaults</h2>
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-medium text-white/80 uppercase tracking-wider">Check Interval (Min)</label>
                                        <Input 
                                            type="number"
                                            name="checkInterval"
                                            value={settings.checkInterval}
                                            onChange={handleChange}
                                            className="bg-white/5 border-white/10 focus:bg-white/10 text-white"
                                            min="3"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-medium text-white/80 uppercase tracking-wider">Timeout (Sec)</label>
                                        <Input 
                                            type="number" 
                                            name="requestTimeout"
                                            value={settings.requestTimeout}
                                            onChange={handleChange}
                                            className="bg-white/5 border-white/10 focus:bg-white/10 text-white"
                                            min="5"
                                            max="60"
                                        />
                                    </div>
                                </div>
                                <div className="mt-auto pt-4">
                                    <Button 
                                        onClick={handleSave} 
                                        disabled={loading}
                                        className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-semibold py-3 rounded-xl shadow-lg transition-all active:scale-95"
                                    >
                                        {loading ? "Saving..." : "Save Changes"}
                                    </Button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'app' && (
                            <div className="flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-300">
                                <h2 className="text-white font-semibold text-lg border-b border-white/10 pb-2">App Preferences</h2>
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center justify-between p-2">
                                        <span className="text-white text-sm">Dark Mode</span>
                                        <button 
                                            onClick={toggleTheme}
                                            className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${theme === 'dark' ? 'bg-emerald-500' : 'bg-slate-600'}`}
                                        >
                                            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`} />
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between p-2">
                                        <span className="text-white text-sm">Auto-Refresh</span>
                                        <button 
                                            onClick={() => setSettings(p => ({...p, autoRefreshDashboard: !p.autoRefreshDashboard}))}
                                            className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${settings.autoRefreshDashboard ? 'bg-emerald-500' : 'bg-slate-600'}`}
                                        >
                                            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${settings.autoRefreshDashboard ? 'translate-x-6' : 'translate-x-0'}`} />
                                        </button>
                                    </div>
                                    
                                    <div className="flex items-center justify-between p-2 opacity-50">
                                        <span className="text-white text-sm">Email Alerts</span>
                                        <div className="w-12 h-6 rounded-full p-1 bg-slate-600">
                                            <div className="bg-white w-4 h-4 rounded-full shadow-md" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'account' && (
                            <div className="flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-300">
                                <h2 className="text-red-200 font-semibold text-lg border-b border-red-500/20 pb-2">Account</h2>
                                <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/20 flex flex-col gap-4">
                                    <div className="text-sm text-red-200/80">
                                        <p className="font-bold text-red-100 mb-1">Delete Account</p>
                                        <p className="leading-relaxed">Permanently remove your account and all data. This action cannot be undone.</p>
                                    </div>
                                    <Button className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg shadow-lg shadow-red-900/20">
                                        Delete Account
                                    </Button>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Settings;