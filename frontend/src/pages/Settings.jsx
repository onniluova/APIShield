import { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { useTheme } from '../context/ThemeContext';
import Header from "../components/Header"
import Navbar from "../components/Navbar"
import toast from 'react-hot-toast';

import ProfileTab from '../components/Settings/ProfileTab';
import MonitoringTab from '../components/Settings/MonitoringTab';
import AppTab from '../components/Settings/AppTab';
import AccountTab from '../components/Settings/AccountTab.jsx';

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
                            <ProfileTab
                            currentUser={user}
                            ></ProfileTab>
                        )}

                        {activeTab === 'monitoring' && (
                            <MonitoringTab
                            settings={settings}
                            handleChange={handleChange}
                            handleSave={handleSave}
                            loading={loading}
                            ></MonitoringTab>
                        )}

                        {activeTab === 'app' && (
                            <AppTab
                            settings={settings}
                            theme={theme}
                            toggleTheme={toggleTheme}
                            ></AppTab>
                        )}

                        {activeTab === 'account' && (
                            <AccountTab
                            user={user}
                            ></AccountTab>
                        )}

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Settings;