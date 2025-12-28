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
        time: new Date(item.checked_at).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit', 
            hour12: false 
        }),
        latency: item.latency_ms
    }));

    const getGradientOffset = () => {
        if (formattedData.length === 0) return 0;
        
        const dataMax = Math.max(...formattedData.map((i) => i.latency));
        const dataMin = Math.min(...formattedData.map((i) => i.latency));
        
        const total = formattedData.reduce((sum, item) => sum + item.latency, 0);
        const avg = total / formattedData.length;

        const threshold = avg * 1.5;

        if (dataMax <= 0) return 0;
        if (dataMin >= dataMax) return 0;

        const offset = (dataMax - threshold) / (dataMax - dataMin);
        
        return Math.min(Math.max(offset, 0), 1);
    };

    const off = getGradientOffset();

    const axisColor = "#ffffff"; 
    const goodColor = "#34d399";
    const badColor = "#f87171";

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
                className="relative w-full max-w-2xl bg-gradient-to-br from-emerald-900/90 to-violet-900/90 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl"
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
                        <RotateLoader color={goodColor} size={10} />
                    </div>
                ) : (
                    <div className="h-64 w-full min-w-0">
                        {formattedData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                                <LineChart data={formattedData}>
                                    <defs>
                                        <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset={off} stopColor={badColor} stopOpacity={1} />
                                            <stop offset={off} stopColor={goodColor} stopOpacity={1} />
                                        </linearGradient>
                                    </defs>

                                    <XAxis dataKey="time" stroke={axisColor} opacity={0.5} tick={{fontSize: 12}} />
                                    <YAxis stroke={axisColor} opacity={0.5} tick={{fontSize: 12}} width={40}/>
                                    
                                    <Tooltip 
                                        contentStyle={{ 
                                            backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            borderRadius: '8px',
                                            color: '#fff'
                                        }}
                                        itemStyle={{ color: '#fff' }}
                                        labelStyle={{ color: '#ccc', marginBottom: '4px' }}
                                    />
                                    <Line 
                                        type="monotone" 
                                        dataKey="latency" 
                                        stroke="url(#splitColor)" 
                                        strokeWidth={3}
                                        dot={false}
                                        activeDot={{ r: 6, stroke: 'white', strokeWidth: 2 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex h-full items-center justify-center text-white/50">
                                No data available for this period.
                            </div>
                        )}
                        
                        <div className="text-white mt-2 text-center text-sm">
                            Uptime: {stats.uptime}%
                        </div>
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
};