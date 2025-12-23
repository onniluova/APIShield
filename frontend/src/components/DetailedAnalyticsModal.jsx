import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { RotateLoader } from "react-spinners";
import { IoClose } from "react-icons/io5";
import toast from 'react-hot-toast';
import Header from "./Header";
import { getEndpointStats } from "../services/endpointService";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
};

const modalVariants = {
    hidden: { opacity: 0, y: -20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 }
};

export default function DetailedAnalyticsModal({ onClose, endpoint_id }) {
    const [loading, setLoading] = useState(true);
    const [history, setHistory] = useState([]);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const loadAnalytics = async () => {
            setLoading(true);
            try {
                const response = await getEndpointStats(endpoint_id);
                setHistory(response.data.history || []);
                setStats(response.data);
            } catch(error) {
                toast.error("Failed to load stats.");
                onClose();
            } finally {
                setLoading(false);
            }
        }
        
        if (endpoint_id) loadAnalytics();
    }, [endpoint_id]);

    const formattedData = history.map(item => ({
        time: new Date(item.checked_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        latency: item.latency_ms
    }));

    return (
        <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
        >
            <motion.div 
                className="relative w-full max-w-2xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl"
                variants={modalVariants}
                onClick={(e) => e.stopPropagation()}
            >
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
                >
                    <IoClose size={24} />
                </button>

                <div className="mb-6 text-center">
                    <Header className="text-white text-2xl font-bold">
                        {stats?.endpoint_name || "Analytics"}
                    </Header>
                    {stats?.endpoint_url && (
                        <p className="text-white/50 text-xs mt-1">{stats.endpoint_url}</p>
                    )}
                </div>

                {loading ? (
                    <div className="h-64 flex items-center justify-center">
                        <RotateLoader color="#ffffff" size={10} />
                    </div>
                ) : (
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={formattedData}>
                                <XAxis dataKey="time" stroke="#ffffff" opacity={0.5} tick={{fontSize: 12}} />
                                <YAxis stroke="#ffffff" opacity={0.5} tick={{fontSize: 12}} width={40}/>
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#222', border: '1px solid #444' }}
                                    itemStyle={{ color: '#fff' }}
                                    labelStyle={{ color: '#ccc' }}
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="latency" 
                                    stroke="#10b981" 
                                    strokeWidth={3}
                                    dot={false}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
};