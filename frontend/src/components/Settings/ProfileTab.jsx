import Button from "../../components/Button"

export default function ProfileTab({ currentUser, handleSave, loading }) {
    return (
        <div className="flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-300">
            <h2 className="text-white font-semibold text-lg border-b border-white/10 pb-2">Profile Information</h2>
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-medium text-white/80 uppercase tracking-wider">Username</label>
                    <div className="bg-black/20 text-white/90 px-4 py-3 rounded-lg border border-white/5">
                        {currentUser?.username || "Guest"}
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-medium text-white/80 uppercase tracking-wider">Role</label>
                    <div className="bg-black/20 text-white/90 px-4 py-3 rounded-lg border border-white/5">
                        {currentUser?.role || "User"}
                    </div>
                </div>
            </div>
        </div>
    )
}