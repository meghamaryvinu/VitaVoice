import { supabase } from '@/config/supabase'

export interface VerificationRequest {
    id: string
    doctor_id: string
    license_number: string
    status: 'pending' | 'verified' | 'rejected'
    verification_method: string
    created_at: string
    doctor: {
        full_name: string
        specialization: string
        hospital_name: string
        live_photo_url: string
        email: string
        phone: string
    }
}

export const verificationService = {
    async getPendingVerifications() {
        const { data, error } = await supabase
            .from('license_verifications')
            .select(`
        *,
        doctor:doctors (
          full_name,
          specialization,
          hospital_name,
          live_photo_url,
          email,
          phone
        )
      `)
            .eq('status', 'pending')

        if (error) throw error
        return data as VerificationRequest[]
    },

    async verifyDoctor(doctorId: string, adminId: string) {
        // 1. Update Doctor Verified Status
        const { error: docError } = await supabase
            .from('doctors')
            .update({ is_verified: true, blue_tick: true })
            .eq('id', doctorId)

        if (docError) throw docError

        // 2. Update Verification Status
        const { error: verifError } = await supabase
            .from('license_verifications')
            .update({
                status: 'verified',
                verified_at: new Date().toISOString(),
                verified_by: adminId
            })
            .eq('doctor_id', doctorId)

        if (verifError) throw verifError

        return true
    },

    async rejectDoctor(doctorId: string, adminId: string, reason: string) {
        const { error } = await supabase
            .from('license_verifications')
            .update({
                status: 'rejected',
                verified_at: new Date().toISOString(),
                verified_by: adminId,
                api_response: { rejection_reason: reason }
            })
            .eq('doctor_id', doctorId)

        if (error) throw error
        return true
    },

    async getLicenseUrl(path: string) {
        const { data } = supabase.storage
            .from('doctor-licenses')
            .getPublicUrl(path)
        return data.publicUrl
    },

    async getLivePhotoUrl(path: string) {
        const { data } = supabase.storage
            .from('doctor-profiles')
            .getPublicUrl(path)
        return data.publicUrl
    }
}
