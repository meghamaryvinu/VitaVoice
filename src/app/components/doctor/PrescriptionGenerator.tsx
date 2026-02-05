import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { prescriptionService, Medication } from '@/services/doctor/prescriptionService';
import { Plus, Trash2, FileText, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const medicationSchema = z.object({
    name: z.string().min(1, "Medicine name required"),
    dosage: z.string().min(1, "Dosage required"),
    frequency: z.string().min(1, "Frequency required"),
    duration: z.string().min(1, "Duration required"),
});

const prescriptionSchema = z.object({
    diagnosis: z.string().min(1, "Diagnosis is required"),
    medications: z.array(medicationSchema).min(1, "Add at least one medication"),
});

type PrescriptionFormValues = z.infer<typeof prescriptionSchema>;

interface PrescriptionGeneratorProps {
    doctorName: string;
    specialization: string;
    licenseNumber: string;
    patientName: string;
    patientId: string;
    doctorId: string;
    onGenerated: (pdfBlob: Blob, pdfPath: string) => void;
    onCancel: () => void;
}

export function PrescriptionGenerator({
    doctorName,
    specialization,
    licenseNumber,
    patientName,
    doctorId,
    patientId,
    onGenerated,
    onCancel
}: PrescriptionGeneratorProps) {
    const [isGenerating, setIsGenerating] = useState(false);

    const { register, control, handleSubmit, formState: { errors } } = useForm<PrescriptionFormValues>({
        resolver: zodResolver(prescriptionSchema),
        defaultValues: {
            medications: [{ name: '', dosage: '', frequency: '', duration: '' }]
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "medications"
    });

    const onSubmit = async (data: PrescriptionFormValues) => {
        try {
            setIsGenerating(true);

            // 1. Generate PDF
            const pdfBlob = prescriptionService.generatePDF({
                doctorName,
                specialization,
                licenseNumber,
                patientName,
                diagnosis: data.diagnosis,
                medications: data.medications
            });

            // 2. Upload PDF
            const pdfPath = await prescriptionService.uploadPrescription(pdfBlob, doctorId, patientId);

            // 3. Save Record
            await prescriptionService.saveRecord(doctorId, patientId, data.diagnosis, data.medications, pdfPath);

            onGenerated(pdfBlob, pdfPath);
            toast.success('Prescription generated successfully');
        } catch (error) {
            console.error(error);
            toast.error('Failed to generate prescription');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Generate Prescription
                </h3>
                <span className="text-sm text-slate-500">Patient: {patientName}</span>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium mb-1">Diagnosis</label>
                    <input
                        {...register('diagnosis')}
                        className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2"
                        placeholder="e.g. Viral Fever"
                    />
                    {errors.diagnosis && <p className="text-red-500 text-xs mt-1">{errors.diagnosis.message}</p>}
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="block text-sm font-medium">Medications</label>
                        <button
                            type="button"
                            onClick={() => append({ name: '', dosage: '', frequency: '', duration: '' })}
                            className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium"
                        >
                            <Plus className="w-3 h-3" /> Add Med
                        </button>
                    </div>

                    {fields.map((field, index) => (
                        <div key={field.id} className="grid grid-cols-12 gap-2 items-start bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg">
                            <div className="col-span-4">
                                <input
                                    {...register(`medications.${index}.name`)}
                                    placeholder="Medicine Name"
                                    className="w-full text-sm rounded bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 px-2 py-1"
                                />
                                {errors.medications?.[index]?.name && <p className="text-red-500 text-[10px]">{errors.medications[index]?.name?.message}</p>}
                            </div>
                            <div className="col-span-3">
                                <input
                                    {...register(`medications.${index}.dosage`)}
                                    placeholder="Dosage (500mg)"
                                    className="w-full text-sm rounded bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 px-2 py-1"
                                />
                            </div>
                            <div className="col-span-2">
                                <input
                                    {...register(`medications.${index}.frequency`)}
                                    placeholder="Freq"
                                    className="w-full text-sm rounded bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 px-2 py-1"
                                />
                            </div>
                            <div className="col-span-2">
                                <input
                                    {...register(`medications.${index}.duration`)}
                                    placeholder="Dur"
                                    className="w-full text-sm rounded bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 px-2 py-1"
                                />
                            </div>
                            <div className="col-span-1 flex justify-center py-1">
                                <button type="button" onClick={() => remove(index)} className="text-red-500 hover:text-red-600">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                    {errors.medications && <p className="text-red-500 text-xs">{errors.medications.message}</p>}
                </div>

                <div className="flex gap-3 justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        disabled={isGenerating}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isGenerating}
                        className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
                    >
                        {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                        Generate & Send
                    </button>
                </div>
            </form>
        </div>
    );
}
