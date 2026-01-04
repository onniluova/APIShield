import Button from "../ui/Button.jsx"
import { useState } from 'react';
import { deleteUser } from '../../services/authService.js';
import toast from 'react-hot-toast';
import { useNavigate } from "react-router";

export default function AccountTab({ user }) {
    const [loading, setLoading] = useState(false);
    let navigate = useNavigate();

    const handleDelete = async () => {
        setLoading(true);

        try {
            console.log(user)
            const response = await deleteUser(user.user_id)
            toast.success("Account deleted succesfully.")
            navigate("/")
        } catch(err) {
            toast.error(err?.message)
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-300">
            <h2 className="text-red-200 font-semibold text-lg border-b border-red-500/20 pb-2">Account</h2>
            <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/20 flex flex-col gap-4">
                <div className="text-sm text-red-200/80">
                    <p className="font-bold text-red-100 mb-1">Delete Account</p>
                    <p className="leading-relaxed">Permanently remove your account and all data. This action cannot be undone.</p>
                </div>
                <Button onClick={handleDelete} className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg shadow-lg shadow-red-900/20">
                    Delete Account
                </Button>
            </div>
        </div>
    )
}