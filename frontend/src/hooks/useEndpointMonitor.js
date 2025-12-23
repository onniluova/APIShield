import { useEffect, useState } from "react";
import { runUrl } from "../services/endpointService";

export default function useEndpointMonitor(endpoints) {
    const [liveStats, setLiveStats] = useState([])

    useEffect(() => {
        const checkEndpoints = async () => {
            if (!endpoints || endpoints.length === 0) {
                return;
            }

            endpoints.forEach(async (ep) => {
                try {
                    const checkRes = await runUrl(ep.id);
                    
                    setLiveStats(prev => ({
                        ...prev,
                        [ep.id]: {
                            "is_up": checkRes.data.data.is_up,
                            "status_code": checkRes.data.data.status || "0",
                            "latency_ms": checkRes.data.data.latency_ms || "0ms",
                            "checked_at": checkRes.data.data.checked_at || "",
                        }
                    }))
                } catch(error) {
                setLiveStats(prev => ({
                    ...prev,
                    [ep.id]: {
                        is_up: false, 
                        status_code: "Err",
                        latency_ms: "0ms",
                        checked_at: new Date().toISOString()
                    }
                }))
            }
            });
        };
        checkEndpoints();
    }, [endpoints])

    return liveStats;
}