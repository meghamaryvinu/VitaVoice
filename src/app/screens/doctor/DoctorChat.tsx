import { useState, useEffect } from 'react';
import { DoctorLayout } from '@/app/components/doctor/DoctorLayout';
import { PrescriptionGenerator } from '@/app/components/doctor/PrescriptionGenerator';
import { doctorAuthService } from '@/services/doctor/doctorAuthService';
import { Search, Send, FilePlus, Paperclip, MoreVertical, Phone, Video, MessageSquare } from 'lucide-react';

export function DoctorChat() {
    const [selectedPatient, setSelectedPatient] = useState<any>(null);
    const [showPrescription, setShowPrescription] = useState(false);
    const [message, setMessage] = useState('');
    const [doctor, setDoctor] = useState<any>(null);

    useEffect(() => {
        doctorAuthService.getCurrentDoctor().then(setDoctor);
    }, []);

    // Mock Data
    const patients = [
        { id: '1', name: 'Sarah Johnson', lastMsg: 'Thanks doctor!', time: '10:30 AM', unread: 2 },
        { id: '2', name: 'Michael Chen', lastMsg: 'Is the dosage correct?', time: 'Yesterday', unread: 0 },
        { id: '3', name: 'Emma Davis', lastMsg: 'Okay, I will update you.', time: 'Yesterday', unread: 0 },
    ];

    const messages = [
        { id: 1, sender: 'patient', text: 'Hi Doctor, I have a fever.', time: '10:00 AM' },
        { id: 2, sender: 'doctor', text: 'Hello Sarah. How long have you had it?', time: '10:05 AM' },
        { id: 3, sender: 'patient', text: 'Since last night. About 101F.', time: '10:06 AM' },
    ];

    return (
        <DoctorLayout>
            <div className="flex h-[85vh] bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                {/* Sidebar List */}
                <div className="w-80 border-r border-slate-200 dark:border-slate-800 flex flex-col">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-800">
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                            <input className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border-none text-sm" placeholder="Search patients..." />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {patients.map(p => (
                            <div
                                key={p.id}
                                onClick={() => setSelectedPatient(p)}
                                className={`p-4 flex items-center gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 ${selectedPatient?.id === p.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                            >
                                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">
                                    {p.name[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h4 className="font-medium truncate">{p.name}</h4>
                                        <span className="text-xs text-slate-400">{p.time}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 truncate">{p.lastMsg}</p>
                                </div>
                                {p.unread > 0 && (
                                    <div className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center">
                                        {p.unread}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950">
                    {selectedPatient ? (
                        <>
                            <header className="p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                                        {selectedPatient.name[0]}
                                    </div>
                                    <div>
                                        <h3 className="font-bold">{selectedPatient.name}</h3>
                                        <p className="text-xs text-green-500 flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Online
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2 text-slate-400">
                                    <button className="p-2 hover:bg-slate-100 rounded-lg"><Phone className="w-5 h-5" /></button>
                                    <button className="p-2 hover:bg-slate-100 rounded-lg"><Video className="w-5 h-5" /></button>
                                    <button className="p-2 hover:bg-slate-100 rounded-lg"><MoreVertical className="w-5 h-5" /></button>
                                </div>
                            </header>

                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                {messages.map(m => (
                                    <div key={m.id} className={`flex ${m.sender === 'doctor' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[70%] p-3 rounded-2xl ${m.sender === 'doctor'
                                            ? 'bg-blue-600 text-white rounded-br-none'
                                            : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-bl-none'
                                            }`}>
                                            <p className="text-sm">{m.text}</p>
                                            <p className={`text-[10px] mt-1 ${m.sender === 'doctor' ? 'text-blue-100' : 'text-slate-400'}`}>{m.time}</p>
                                        </div>
                                    </div>
                                ))}

                                {showPrescription && doctor && (
                                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                                        <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                                            <PrescriptionGenerator
                                                doctorName={doctor.full_name}
                                                specialization={doctor.specialization}
                                                licenseNumber={doctor.license_number}
                                                patientName={selectedPatient.name}
                                                patientId={selectedPatient.id}
                                                doctorId={doctor.id}
                                                onGenerated={() => setShowPrescription(false)}
                                                onCancel={() => setShowPrescription(false)}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                                <div className="flex items-center gap-2">
                                    <button title="Attach File" className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg">
                                        <Paperclip className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => setShowPrescription(true)}
                                        title="Generate Prescription"
                                        className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg hover:text-blue-600"
                                    >
                                        <FilePlus className="w-5 h-5" />
                                    </button>
                                    <input
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        className="flex-1 bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                                        placeholder="Type a message..."
                                    />
                                    <button className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-600/20">
                                        <Send className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                <MessageSquare className="w-8 h-8 opacity-50" />
                            </div>
                            <p>Select a patient to start chatting</p>
                        </div>
                    )}
                </div>
            </div>
        </DoctorLayout>
    );
}
