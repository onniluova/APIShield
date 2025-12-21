import React, { useEffect, useState } from "react";
import Header from "./Header";
import Button from "./Button";
import { getEndpoints } from "../services/endpointService";
import { RotateLoader } from 'react-spinners';
import AnalyticsCard from "./AnalyticsCard";
import useEndpointMonitor from "../hooks/useEndpointMonitor";

export default function Analytics() {
    const [endpoints, setEndpoints] = useState([]);
    const [loading, setLoading] = useState(true);

    // determine screen width for the card responsivity
    const getInitialCount = () => window.innerWidth < 768 ? 6 : 9;
    const [visibleCount, setVisibleCount] = useState(getInitialCount());

    const liveStats = useEndpointMonitor(endpoints);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getEndpoints();
                setEndpoints(response.data.endpoints);
            } catch(error) {
                console.log("Error:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();

        const handleResize = () => {
             if (visibleCount < getInitialCount()) {
                 setVisibleCount(getInitialCount());
             }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [])

    const handleShowMore = () => {
        const step = window.innerWidth < 768 ? 6 : 9;
        
        if (visibleCount >= endpoints.length) {
            setVisibleCount(getInitialCount());
        } else {
            setVisibleCount(prev => prev + step);
        }
    };

    return ( 
        <div className="w-full max-w-4xl mx-auto p-4 flex flex-col gap-6">
            
            <div className="text-center">
                <Header className="text-white/95 text-4xl font-bold tracking-wide">
                    Analytics
                </Header>
                <p className="text-white/95 text-xs mt-1">
                    Manage and monitor your endpoints
                </p>
            </div>

            <div className="flex-grow min-h-[200px] flex flex-col">
                
                {loading && (
                    <div className="flex-grow flex flex-col items-center justify-center gap-4 py-10">
                        <RotateLoader color="#34d399" size={10} />
                        <span className="text-white/50 text-sm animate-pulse">Syncing data...</span>
                    </div>
                )}

                {!loading && endpoints.length === 0 && (
                    <div className="text-center py-10 border-2 border-dashed border-white/10 rounded-xl bg-white/5">
                        <p className="text-white/70">No endpoints found.</p>
                        <p className="text-white/30 text-xs mt-2">Add one to get started!</p>
                    </div>
                )}

                {!loading && endpoints.length > 0 && (
                    <>
                        <ul className="grid grid-cols-2 md:grid-cols-3 gap-3 transition-all duration-300">
                            {endpoints.slice(0, visibleCount).map(endpoint => (
                                <AnalyticsCard
                                    key={endpoint.id || endpoints.name}
                                    endpoint={endpoint}
                                    liveStats={liveStats[endpoint.id]}
                                >
                                </AnalyticsCard>
                            ))}
                        </ul>

                        {endpoints.length > getInitialCount() && (
                            <button 
                                onClick={handleShowMore}
                                className="mt-4 text-xs text-white/40 hover:text-white transition-colors self-center uppercase tracking-widest"
                            >
                                {visibleCount >= endpoints.length 
                                    ? "Last page" 
                                    : `Next page (${endpoints.length - visibleCount} remaining)`}
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}