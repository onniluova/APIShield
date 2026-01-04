import Input from "../../components/Input"
import Button from "../../components/Button"

const MonitoringTab = ({ settings, handleChange, handleSave, loading }) => {
    return (
        <div className="flex flex-col h-full">
            <h3 className="text-xl font-bold text-white mb-4">Monitoring Logic</h3>
            
            <div className="flex-grow overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                <div className="flex flex-col gap-1">
                    <label className="text-white/80 text-sm">Max Retries (before alerting)</label>
                    <input 
                        type="number" 
                        name="maxRetries"
                        min="0"
                        max="10"
                        value={settings.maxRetries} 
                        onChange={handleChange}
                        className="bg-white/5 border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                    />
                    <p className="text-xs text-white/40">Prevents false alarms from blips.</p>
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-white/80 text-sm">Latency Warning Threshold (ms)</label>
                    <input 
                        type="number" 
                        name="latencyWarning"
                        step="100"
                        min={200}
                        value={settings.latencyWarning} 
                        onChange={handleChange}
                        className="bg-white/5 border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                    />
                </div>

                <div className="flex items-center justify-between bg-white/5 p-3 rounded border border-white/10">
                    <span className="text-white/80 text-sm">Ignore SSL Errors</span>
                    <input 
                        type="checkbox" 
                        name="ignoreSSL"
                        checked={settings.ignoreSSL} 
                        onChange={handleChange}
                        className="accent-emerald-500 w-5 h-5"
                    />
                </div>
                <div className="flex items-center justify-between bg-white/5 p-3 rounded border border-white/10">
                    <span className="text-white/80 text-sm">Email Alerts</span>
                    <input 
                        type="checkbox" 
                        name="emailAlerts"
                        disabled={true}
                        checked={settings.emailAlerts} 
                        onChange={handleChange}
                        className="accent-emerald-500 w-5 h-5"
                    />
                </div>
            </div>
        </div>
    );
};

export default MonitoringTab;