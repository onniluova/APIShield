import Navbar from "../components/Navbar";
import Button from "../components/Button";
import Analytics from "../components/Analytics";
import { useState } from 'react';
import AddEndpointModal from "../components/AddEndpointModal";
import DetailedAnalyticsModal from "../components/DetailedAnalyticsModal";
import { AnimatePresence } from "framer-motion";

const Dashboard = () => {
    const [onAddEndpoint, setOnAddEndpoint] = useState(false);
    const [selectedEndpointId, setSelectedEndpointId] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleSuccess = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <div className="relative font-mono min-h-screen bg-gradient-to-br from-emerald-700 to-violet-700 flex flex-col p-4 gap-5 overflow-hidden">
            <Navbar />

            <div className="flex flex-grow flex-col justify-center items-center gap-6 z-10">
                <Analytics refreshTrigger={refreshTrigger} onCardClick={(id) => setSelectedEndpointId(id)}/>
                
                <Button 
                    onClick={() => setOnAddEndpoint(true)}
                    className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border border-white/30 px-8 py-3 rounded-xl shadow-lg transition-all"
                >
                    + Add New Endpoint
                </Button>
            </div>

            <AnimatePresence>
                {onAddEndpoint && (
                    <AddEndpointModal 
                        onClose={() => setOnAddEndpoint(false)} 
                        onSuccess={handleSuccess}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {selectedEndpointId && (
                    <DetailedAnalyticsModal 
                        endpoint_id={selectedEndpointId}
                        onClose={() => setSelectedEndpointId(false)} 
                    />
                )}
            </AnimatePresence>

            <div className="text-center mt-auto text-white/50 text-xs py-4">
                © 2025 APIShield - Created by Onni Luova
            </div>
        </div>
    );
}

export default Dashboard;