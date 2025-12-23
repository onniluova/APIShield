import { useEffect, useState } from "react";
import { getEndpointStats } from "../services/endpointService";

export default function useEndpointMonitor(endpoints) {
    const [liveStats, setLiveStats] = useState({});

    useEffect(() => {
        const fetchStatuses = async () => {
            if (!endpoints || endpoints.length === 0) return;

            const promises = endpoints.map(async (ep) => {
                try {
                    const statsRes = await getEndpointStats(ep.id);
                    const responseData = statsRes.data;
                    const history = responseData.history;

                    const latest = (history && history.length > 0) ? history[history.length - 1] : null;

                    return {
                        id: ep.id,
                        stats: {
                            is_up: latest ? latest.is_up : null, 
                            status_code: latest ? latest.status_code : "Pending",
                            latency_ms: latest ? latest.latency_ms : "-",
                            checked_at: latest ? latest.checked_at : null,
                        }
                    };
                } catch(error) {
                    return null;
                }
            });

            const results = await Promise.all(promises);
            
            const newStats = {};
            results.forEach(res => {
                if (res) {
                    newStats[res.id] = res.stats;
                }
            });

            setLiveStats(prev => ({ ...prev, ...newStats }));
        };

        fetchStatuses();
        const interval = setInterval(fetchStatuses, 30000);
        return () => clearInterval(interval);

    }, [endpoints]);

    return liveStats;
}