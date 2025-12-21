import React, { use, useEffect, useState } from "react";
import Header from "./Header";
import Button from "./Button";
import { addEndpoint, getEndpoints } from "../services/endpointService";

export default function Analytics({}) {
    const [endpoints, setEndpoints] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
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
    }, [])

    return ( 
        <div className="flex flex-grow flex-col justify-center items-center gap-2 p-4 min-w-sm max-w-lg border-4 border-solid border-white rounded-md">
            <Header className="text-white sm:text-xs lg:text-3xl">Analytics</Header>
                <ul className="text-white sm:text-xs lg:text-xs">
                    {endpoints.map(endpoint =>
                        <li key={endpoint.id || endpoint.name}>{endpoint.name} - {endpoint.url}</li>
                    )}
                </ul>
            <Button className="text-white lg:text-xl sm:text-xs m-1 bg-white/7 hover:bg-white/25">Run status check</Button>
        </div>
        )
}