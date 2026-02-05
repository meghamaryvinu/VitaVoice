import { supabase } from '@/config/supabase'

export interface DoctorSignupData {
    full_name: string
    email: string
    phone: string
    password: string
    license_number: string
    specialization: string
    hospital_name: string
    hospital_address: string
    years_experience: number
}

export interface DoctorProfile {
    id: string
    user_id: string
    full_name: string
    email: string
    phone: string
    license_number: string
    specialization: string
    hospital_name: string
    hospital_address: string
    years_experience: number
    live_photo_url: string | null
    is_verified: boolean
    blue_tick: boolean
    about?: string
    qualifications?: string
    languages?: string
}

export const doctorAuthService = {
    async signup(data: DoctorSignupData, photoFile: File, licenseFile: File) {
        try {
            // 1. Create auth user
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: data.email,
                password: data.password,
                options: {
                    data: { full_name: data.full_name, user_type: 'doctor' }
                }
            })

            if (authError) throw authError
            if (!authData.user) throw new Error('User creation failed')

            const userId = authData.user.id

            // 2. Upload Profile Photo
            const photoPath = `${userId}/live_photo.jpg`
            const { error: photoError } = await supabase.storage
                .from('doctor-profiles')
                .upload(photoPath, photoFile)

            if (photoError) throw new Error(`Photo upload failed: ${photoError.message}`)

            // 3. Upload License
            const licensePath = `${userId}/${licenseFile.name}`
            const { error: licenseError } = await supabase.storage
                .from('doctor-licenses')
                .upload(licensePath, licenseFile)

            if (licenseError) throw new Error(`License upload failed: ${licenseError.message}`)

            // 4. Create Doctor Record
            const { data: doctor, error: doctorError } = await supabase
                .from('doctors')
                .insert({
                    user_id: userId,
                    full_name: data.full_name,
                    email: data.email,
                    phone: data.phone,
                    license_number: data.license_number,
                    specialization: data.specialization,
                    hospital_name: data.hospital_name,
                    hospital_address: data.hospital_address,
                    years_experience: data.years_experience,
                    live_photo_url: photoPath,
                    is_verified: false,
                    blue_tick: false
                })
                .select()
                .single()

            if (doctorError) throw doctorError

            // 5. Create Verification Record
            const { error: verifError } = await supabase
                .from('license_verifications')
                .insert({
                    doctor_id: doctor.id,
                    license_number: data.license_number,
                    status: 'pending',
                    verification_method: 'manual',
                    api_response: { license_file_url: licensePath }
                })

            if (verifError) throw verifError

            return { success: true, doctor }
        } catch (error: any) {
            console.error('Doctor signup error:', error)

            // Improve error message for duplicate user
            if (error.message?.includes('User already registered') || error.message?.includes('already registered')) {
                return { success: false, error: 'Account already exists with this email. Please log in.' }
            }

            return { success: false, error: error.message }
        }
    },

    async getDoctorProfile(userId: string) {
        const { data, error } = await supabase
            .from('doctors')
            .select('*')
            .eq('user_id', userId)
            .single()

        if (error) return null
        return data as DoctorProfile
    },

    async updateProfile(doctorId: string, updates: Partial<DoctorProfile>) {
        const { data, error } = await supabase
            .from('doctors')
            .update(updates)
            .eq('id', doctorId)
            .select()
            .single()

        if (error) throw error
        return data
    },

    async getCurrentDoctor() {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session?.user) return null
        return this.getDoctorProfile(session.user.id)
    }
}
