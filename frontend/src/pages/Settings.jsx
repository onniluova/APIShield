import { useState, useContext, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import { useTheme } from '../context/ThemeContext';
import { saveSettings } from '../services/authService';
import toast from 'react-hot-toast';

import BackgroundGrid from '../components/ui/BackgroundGrid';
import Button from '../components/ui/Button';
import Title from '../components/ui/Title';

import Navbar from '../components/Layout/Navbar';
import ProfileTab from '../components/Settings/ProfileTab';
import MonitoringTab from '../components/Settings/MonitoringTab';
import AppTab from '../components/Settings/AppTab';
import AccountTab from '../components/Settings/AccountTab';

const Settings = () => {
    const { user, setUser } = useContext(UserContext);
    const { theme, toggleTheme } = useTheme();
    
    const defaultSettings = {
        checkInterval: 5,
        requestTimeout: 10,
        emailAlerts: false,
        autoRefreshDashboard: true,
        maxRetries: 3,
        ignoreSSL: false,
        latencyWarning: 500,
        keepHistoryDays: 30
    };

    const [settings, setSettings] = useState(() => ({
        ...defaultSettings,
        ...(user?.settings) || {}
    }))

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
        toast.dismiss();
        try {
            const response = await saveSettings(settings);

            if (response.data?.settings) {
                setUser(prev => ({
                    ...prev,
                    settings: response.data.settings
                }));
            }
            
            toast.success("Settings updated succesfully.");
            console.log(user)
        } catch(err) {
            toast.error(err?.message);

        } finally {
            setLoading(false);
        }
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
            <BackgroundGrid></BackgroundGrid>

            <div className="p-4 z-20">
                <Navbar />
            </div>

            <div className="flex-grow flex items-center justify-center w-full px-4 py-6 z-10 relative">
                
                <div className="w-full max-w-2xl h-[650px] bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl overflow-hidden flex flex-col">

                    <div className="p-6 border-b border-white/10 bg-black/10 flex flex-col items-center text-center flex-shrink-0">
                        <Title className='text-white font-bold text-2xl sm:text-3xl tracking-tight'>Settings</Title>
                        <p className="text-white/60 text-sm mt-1">Manage your account preferences and configurations.</p>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 w-full border-b border-white/10 flex-shrink-0" role="tablist">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                role="tab"
                                aria-selected={activeTab === tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    py-4 text-sm font-medium transition-colors duration-200 outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-400
                                    ${activeTab === tab.id 
                                        ? 'bg-white/10 text-white border-b-2 border-emerald-400' 
                                        : 'text-white/60 hover:bg-white/5 hover:text-white'
                                    }
                                `}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="p-6 flex-grow overflow-y-auto custom-scrollbar relative">
                        
                        {activeTab === 'profile' && (
                            <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                                <ProfileTab currentUser={user} />
                            </div>
                        )}

                        {activeTab === 'monitoring' && (
                            <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                                <MonitoringTab
                                    settings={settings}
                                    handleChange={handleChange}
                                />
                            </div>
                        )}

                        {activeTab === 'app' && (
                            <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                                <AppTab
                                    settings={settings}
                                    theme={theme}
                                    toggleTheme={toggleTheme}
                                />
                            </div>
                        )}

                        {activeTab === 'account' && (
                            <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                                <AccountTab user={user} />
                            </div>
                        )}
                    </div>

                    <div className="p-4 border-t border-white/10 bg-black/20 flex justify-end flex-shrink-0">
                        <Button 
                            onClick={handleSave}
                            disabled={loading}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Settings;