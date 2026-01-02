import { useState } from "react";
import { motion } from "framer-motion";
import { RotateLoader } from "react-spinners";
import { IoClose } from "react-icons/io5";
import toast from 'react-hot-toast';
import Button from "./Button";
import Header from "./Header";
import Input from "./Input";
import { addEndpoint } from "../services/endpointService";

const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
};

const modalVariants = {
    hidden: { opacity: 0, y: -20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 }
};

export default function AddEndpointModal({ onClose, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [endpointName, setEndpointName] = useState("");
    const [endpointUrl, setEndpointUrl] = useState("");

    const onCreateClick = async () => {
        if (!endpointName || !endpointUrl) {
            toast.error("Please fill in all fields");
            return;
        }

        setLoading(true);
        try {
            await addEndpoint(endpointName, endpointUrl);
            toast.success(`${endpointName} endpoint created successfully!`);
            
            if (onSuccess) onSuccess(); 
            onClose(); 
        } catch(error) {
            toast.error(error.response?.data?.message || "Endpoint creation failed.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
        >
            <motion.div 
                className="relative w-full dark:bg-slate-900/50 dark:bg-none max-w-md bg-gradient-to-br from-emerald-900/45 to-violet-900/45 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl"
                variants={modalVariants}
                onClick={(e) => e.stopPropagation()}
            >
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
                >
                    <IoClose size={24} />
                </button>

                <div className="flex flex-col gap-5">
                    <Header className="text-white text-2xl font-bold text-center mb-2">
                        Add endpoint
                    </Header>

                    <div>
                        <p className="text-white text-sm mb-1 ml-1">Name</p>
                        <Input 
                            className="bg-white/5 border-white/10 focus:bg-white/10 text-white placeholder:text-white/30"
                            placeholder="API Service name"
                            value={endpointName}
                            onChange={(e) => setEndpointName(e.target.value)}
                        />
                    </div>

                    <div>
                        <p className="text-white text-sm mb-1 ml-1">Target URL</p>
                        <Input 
                            className="bg-white/5 border-white/10 focus:bg-white/10 text-white placeholder:text-white/30"
                            placeholder="https://api.example.com"
                            value={endpointUrl}
                            onChange={(e) => setEndpointUrl(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-3 mt-4">
                        <Button 
                            onClick={onClose}
                            className="flex-1 bg-transparent border border-white/20 text-white hover:bg-white/10"
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={onCreateClick} 
                            disabled={loading} 
                            className="flex-1 bg-white text-emerald-900 hover:bg-gray-100 font-bold shadow-lg"
                        >
                            {loading ? <RotateLoader color="#064e3b" size={6} margin={2} /> : "Create"}
                        </Button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}