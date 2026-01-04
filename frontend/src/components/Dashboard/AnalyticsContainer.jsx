import { useEffect, useState } from "react";
import Header from "../ui/Title";
import { getEndpoints } from "../../services/endpointService";
import AnalyticsCard from "./AnalyticsCard";
import useEndpointMonitor from "../../hooks/useEndpointMonitor";
import LoadingState from "./LoadingState";
import EmptyState from "./EmptyState";
import AnalyticsGrid from "./AnalyticsGrid";
import toast from 'react-hot-toast';

export default function Analytics({ refreshTrigger, onCardClick, onDelete }) {
    const [endpoints, setEndpoints] = useState([]);
    const [loading, setLoading] = useState(true);

    const liveStats = useEndpointMonitor(endpoints);

    const safeEndpoints = endpoints || []; 

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getEndpoints();
                setEndpoints(response.data.endpoints || []); 
            } catch(error) {
                toast.error(error)
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [refreshTrigger]);
    
    return ( 
        <div className="w-full max-w-4xl mx-auto p-4 flex flex-col gap-6 h-full">

            <div className="text-center flex-shrink-0">
                <Header className="text-white/95 text-4xl font-bold tracking-wide">
                    Analytics
                </Header>
                <p className="text-white/95 text-xs mt-1">Manage and monitor your endpoints</p>
            </div>

            <div className="flex-grow flex flex-col relative min-h-[200px]">
                
                {loading && <LoadingState />}

                {!loading && safeEndpoints.length === 0 && (
                    <EmptyState title="No endpoints found" subtitle="Add one to get started!" />
                )}

                {!loading && safeEndpoints.length > 0 && (
                    <AnalyticsGrid itemCount={safeEndpoints.length}>
                        {safeEndpoints.map(endpoint => (
                            <div 
                                key={endpoint.id} 
                                onClick={() => onCardClick(endpoint.id)}
                                className={`cursor-pointer hover:scale-105 transition-transform duration-200 ${safeEndpoints.length < 3 ? 'w-full max-w-sm' : ''}`}
                            >
                                <AnalyticsCard
                                    endpoint={endpoint}
                                    liveStats={liveStats[endpoint.id]}
                                    onDelete={onDelete}
                                />
                            </div>
                        ))}
                    </AnalyticsGrid>
                )}
            </div>
        </div>
    );
}