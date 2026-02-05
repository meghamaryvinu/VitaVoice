import { supabase } from '@/config/supabase'
import jsPDF from 'jspdf'

export interface Medication {
    name: string
    dosage: string
    frequency: string
    duration: string
}

export interface PrescriptionData {
    doctorName: string
    specialization: string
    licenseNumber: string
    patientName: string
    diagnosis: string
    medications: Medication[]
    signatureImage?: string // Base64
}

export const prescriptionService = {
    generatePDF(data: PrescriptionData): Blob {
        const doc = new jsPDF()

        // Header
        doc.setFontSize(20)
        doc.text(`Dr. ${data.doctorName}`, 20, 20)
        doc.setFontSize(12)
        doc.text(data.specialization, 20, 28)
        doc.text(`License: ${data.licenseNumber}`, 20, 35)

        doc.line(20, 40, 190, 40)

        // Patient & Diagnosis
        doc.text(`Patient: ${data.patientName}`, 20, 50)
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 50)
        doc.text(`Diagnosis: ${data.diagnosis}`, 20, 60)

        // Medications Table Header
        doc.setFillColor(240, 240, 240)
        doc.rect(20, 70, 170, 10, 'F')
        doc.setFont('helvetica', 'bold')
        doc.text('Medication', 25, 77)
        doc.text('Dosage', 80, 77)
        doc.text('Frequency', 120, 77)
        doc.text('Duration', 160, 77)

        // List
        doc.setFont('helvetica', 'normal')
        let y = 90
        data.medications.forEach((med) => {
            doc.text(med.name, 25, y)
            doc.text(med.dosage, 80, y)
            doc.text(med.frequency, 120, y)
            doc.text(med.duration, 160, y)
            y += 10
        })

        // Instructions/Footer
        doc.line(20, 240, 190, 240)
        doc.setFontSize(10)
        doc.text('Digital Prescription generated via VitaVoice', 20, 250)

        if (data.signatureImage) {
            doc.addImage(data.signatureImage, 'PNG', 140, 220, 40, 15)
        }

        return doc.output('blob')
    },

    async uploadPrescription(file: Blob, doctorId: string, patientId: string) {
        const filename = `${doctorId}_${patientId}_${Date.now()}.pdf`
        const { data, error } = await supabase.storage
            .from('prescriptions')
            .upload(filename, file)

        if (error) throw error
        return data.path
    },

    async saveRecord(doctorId: string, patientId: string, diagnosis: string, medications: Medication[], pdfPath: string) {
        const { data, error } = await supabase
            .from('prescriptions')
            .insert({
                doctor_id: doctorId,
                patient_id: patientId,
                diagnosis,
                medications,
                pdf_url: pdfPath
            })
            .select()
            .single()

        if (error) throw error
        return data
    }
}
