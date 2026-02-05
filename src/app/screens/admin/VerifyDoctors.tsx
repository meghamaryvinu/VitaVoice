import { useEffect, useState } from 'react';
import { verificationService, VerificationRequest } from '@/services/doctor/verificationService';
import { Check, X, ExternalLink, FileText, Ban, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '@/config/supabase';

export function VerifyDoctors() {
    const [pending, setPending] = useState<VerificationRequest[]>([]);
    const [selected, setSelected] = useState<VerificationRequest | null>(null);
    const [adminId, setAdminId] = useState<string>('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
        // Simulate admin check or fetch current user
        supabase.auth.getSession().then(({ data }) => {
            if (data.session) setAdminId(data.session.user.id);
        });
    }, []);

    const loadData = async () => {
        try {
            const data = await verificationService.getPendingVerifications();
            setPending(data);
        } catch (error) {
            console.error("Failed to load verifications", error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async () => {
        if (!selected) return;
        try {
            await verificationService.verifyDoctor(selected.doctor_id, adminId);
            toast.success(`Verified Dr. ${selected.doctor.full_name}`);
            setPending(prev => prev.filter(p => p.id !== selected.id));
            setSelected(null);
        } catch (error) {
            toast.error("Verification failed");
        }
    };

    const handleReject = async () => {
        if (!selected) return;
        const reason = prompt("Enter rejection reason:");
        if (!reason) return;

        try {
            await verificationService.rejectDoctor(selected.doctor_id, adminId, reason);
            toast.success(`Rejected application`);
            setPending(prev => prev.filter(p => p.id !== selected.id));
            setSelected(null);
        } catch (error) {
            toast.error("Rejection failed");
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900 p-8">
            <h1 className="text-3xl font-bold mb-8 text-slate-800 dark:text-white">Admin Verification Console</h1>

            <div className="grid grid-cols-12 gap-6 h-[80vh]">
                {/* List */}
                <div className="col-span-4 bg-white dark:bg-slate-950 rounded-xl shadow overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                        <h2 className="font-semibold text-slate-700 dark:text-slate-300">Pending Requests ({pending.length})</h2>
                    </div>
                    <div className="overflow-y-auto flex-1 p-2 space-y-2">
                        {loading && <p className="p-4 text-center text-slate-500">Loading...</p>}
                        {!loading && pending.length === 0 && <p className="p-4 text-center text-slate-500">No pending verifications</p>}

                        {pending.map(req => (
                            <div
                                key={req.id}
                                onClick={() => setSelected(req)}
                                className={`p-4 rounded-lg cursor-pointer border transition-all ${selected?.id === req.id
                                    ? 'bg-blue-50 border-blue-500 shadow-md'
                                    : 'bg-white border-slate-200 hover:border-blue-300'
                                    }`}
                            >
                                <p className="font-medium text-slate-900">Dr. {req.doctor.full_name}</p>
                                <div className="flex justify-between text-xs text-slate-500 mt-1">
                                    <span>{req.license_number}</span>
                                    <span>{new Date(req.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Detail View */}
                <div className="col-span-8 bg-white dark:bg-slate-950 rounded-xl shadow flex flex-col">
                    {selected ? (
                        <>
                            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-start">
                                <div>
                                    <h2 className="text-2xl font-bold">Dr. {selected.doctor.full_name}</h2>
                                    <p className="text-slate-500">{selected.doctor.specialization} • {selected.doctor.hospital_name}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleReject}
                                        className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-medium flex items-center gap-2"
                                    >
                                        <Ban className="w-4 h-4" /> Reject
                                    </button>
                                    <button
                                        onClick={handleApprove}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center gap-2 shadow-lg shadow-green-600/20"
                                    >
                                        <Check className="w-4 h-4" /> Approve & Verify
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-2 gap-8">
                                {/* Left: Info */}
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-slate-400 uppercase text-xs tracking-wider">Professional Details</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-slate-50 p-3 rounded">
                                                <p className="text-xs text-slate-500">License Number</p>
                                                <p className="font-mono font-medium">{selected.license_number}</p>
                                            </div>
                                            <div className="bg-slate-50 p-3 rounded">
                                                <p className="text-xs text-slate-500">Phone</p>
                                                <p className="font-medium">{selected.doctor.phone}</p>
                                            </div>
                                            <div className="bg-slate-50 p-3 rounded col-span-2">
                                                <p className="text-xs text-slate-500">Email</p>
                                                <p className="font-medium">{selected.doctor.email}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="font-semibold text-slate-400 uppercase text-xs tracking-wider">Verification Actions</h3>
                                        <a
                                            href="https://www.nmc.org.in/information-desk/indian-medical-register/"
                                            target="_blank"
                                            rel="noreferrer"
                                            className="block p-4 border border-blue-200 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-between"
                                        >
                                            <span className="font-medium">Check NMC Registry</span>
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    </div>
                                </div>

                                {/* Right: Evidence */}
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="font-semibold text-slate-400 uppercase text-xs tracking-wider mb-2">Live Photo Capture</h3>
                                        <div className="aspect-video bg-black rounded-lg overflow-hidden border border-slate-200">
                                            {/* We would need to resolve the signed URL here usually, assuming public for this demo or handled by image component */}
                                            <img
                                                src={selected.doctor.live_photo_url ? `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/doctor-profiles/${selected.doctor.live_photo_url}` : ''}
                                                alt="Live Capture"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-slate-400 uppercase text-xs tracking-wider mb-2">License Document</h3>
                                        <div className="p-4 border border-slate-200 rounded-lg flex items-center justify-between hover:bg-slate-50">
                                            <div className="flex items-center gap-3">
                                                <FileText className="w-8 h-8 text-slate-400" />
                                                <div>
                                                    <p className="text-sm font-medium">Medical_License.pdf</p>
                                                    <p className="text-xs text-slate-400">verification_doc</p>
                                                </div>
                                            </div>
                                            <button className="text-sm text-blue-600 font-medium hover:underline">View</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                            <ShieldCheck className="w-16 h-16 mb-4 opacity-50" />
                            <p>Select a verification request to review</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
