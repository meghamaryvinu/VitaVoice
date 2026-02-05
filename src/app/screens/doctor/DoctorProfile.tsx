import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { DoctorLayout } from '@/app/components/doctor/DoctorLayout';
import { doctorAuthService, DoctorProfile } from '@/services/doctor/doctorAuthService';
import { CapturePhoto } from '@/app/components/doctor/CapturePhoto';
import { Save, Camera, Mail, Phone, Award, MapPin, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';

export function DoctorProfileScreen() {
    const [profile, setProfile] = useState<DoctorProfile | null>(null);
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showCamera, setShowCamera] = useState(false);

    const { register, handleSubmit, reset } = useForm();

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        const data = await doctorAuthService.getCurrentDoctor();
        setProfile(data);
        if (data) reset(data);
        setLoading(false);
    };

    const onSubmit = async (data: any) => {
        if (!profile) return;
        try {
            await doctorAuthService.updateProfile(profile.id, {
                years_experience: Number(data.years_experience),
                skills: data.skills, // Assuming we add skills to DB schema later, currently not in interface but in UI
                qualifications: data.qualifications,
                languages: data.languages,
                about: data.about
            } as any);
            toast.success("Profile updated");
            setEditing(false);
            loadProfile();
        } catch (error) {
            toast.error("Failed to update profile");
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <DoctorLayout doctorName={profile?.full_name || ''} isVerified={profile?.is_verified || false}>
            <div className="grid grid-cols-12 gap-8">
                {/* Left Column: Avatar & Basic Info */}
                <div className="col-span-12 md:col-span-4 space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 text-center shadow-sm border border-slate-200 dark:border-slate-800 relative overflow-hidden">
                        <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-white shadow-lg mb-4 relative group">
                            <img
                                src={profile?.live_photo_url ? `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/doctor-profiles/${profile.live_photo_url}` : 'https://via.placeholder.com/150'}
                                alt={profile?.full_name}
                                className="w-full h-full object-cover"
                            />
                            <button
                                onClick={() => setShowCamera(true)}
                                className="absolute inset-0 bg-black/50 items-center justify-center flex opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            >
                                <Camera className="w-8 h-8 text-white" />
                            </button>
                        </div>

                        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center justify-center gap-2">
                            {profile?.full_name}
                            {profile?.is_verified && <span className="bg-blue-500 text-white p-0.5 rounded-full"><Award className="w-3 h-3" /></span>}
                        </h2>
                        <p className="text-blue-600 font-medium">{profile?.specialization}</p>

                        <div className="mt-6 flex flex-col gap-3 text-sm text-left px-4">
                            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                                <Mail className="w-4 h-4" />
                                <span className="truncate">{profile?.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                                <Phone className="w-4 h-4" />
                                <span>{profile?.phone}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                                <Briefcase className="w-4 h-4" />
                                <span>{profile?.hospital_name}, {profile.years_experience}y Exp</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                                <MapPin className="w-4 h-4" />
                                <span className="truncate">{profile?.hospital_address}</span>
                            </div>
                        </div>
                    </div>

                    {/* Non-editable License Info */}
                    <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/20">
                        <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Medical License</p>
                        <p className="font-mono text-slate-700 dark:text-blue-100">{profile?.license_number}</p>
                        <div className="mt-2 flex items-center gap-2 text-xs text-green-600 font-medium">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            Status: Verified
                        </div>
                    </div>
                </div>

                {/* Right Column: Editable Details */}
                <div className="col-span-12 md:col-span-8">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Professional Profile</h3>
                            {!editing ? (
                                <button
                                    onClick={() => setEditing(true)}
                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium transition-colors"
                                >
                                    Edit Profile
                                </button>
                            ) : (
                                <button
                                    onClick={() => setEditing(false)}
                                    className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">About Me</label>
                                <textarea
                                    {...register("about")}
                                    disabled={!editing}
                                    rows={4}
                                    className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 disabled:opacity-60"
                                    placeholder="Write a short bio about your medical practice..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Qualifications</label>
                                <textarea
                                    {...register("qualifications")}
                                    disabled={!editing}
                                    rows={2}
                                    className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 disabled:opacity-60"
                                    placeholder="MBBS, MD - Cardiology, etc."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Languages Spoken</label>
                                <input
                                    {...register("languages")}
                                    disabled={!editing}
                                    className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 disabled:opacity-60"
                                    placeholder="English, Hindi, Kannada..."
                                />
                            </div>

                            {editing && (
                                <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <button
                                        type="submit"
                                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium flex items-center gap-2 shadow-lg shadow-blue-600/20"
                                    >
                                        <Save className="w-4 h-4" /> Save Changes
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>

            {/* Camera Modal */}
            {showCamera && (
                <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
                        <CapturePhoto onCapture={(file) => {
                            // Upload logic would go here
                            toast.success("Photo updated! (Simulated)");
                            setShowCamera(false);
                        }} />
                        <button onClick={() => setShowCamera(false)} className="mt-4 w-full py-2 text-slate-500">Cancel</button>
                    </div>
                </div>
            )}
        </DoctorLayout>
    );
}
