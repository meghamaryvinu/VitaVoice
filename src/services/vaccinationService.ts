// Vaccination tracking service for VitaVoice

export interface Vaccine {
    id: string;
    name: string;
    ageMonths: number; // Age when vaccine should be given
    description: string;
    doses: number; // Number of doses required
    category: 'infant' | 'child' | 'adult' | 'pregnancy';
}

export interface VaccinationRecord {
    id: string;
    vaccineId: string;
    familyMemberId: string;
    dateGiven: Date;
    doseNumber: number;
    batchNumber?: string;
    location?: string;
    nextDueDate?: Date;
    notes?: string;
}

// Indian National Immunization Schedule
const VACCINATION_SCHEDULE: Vaccine[] = [
    // Birth
    { id: 'bcg', name: 'BCG', ageMonths: 0, description: 'Tuberculosis vaccine', doses: 1, category: 'infant' },
    { id: 'opv_0', name: 'OPV (Birth dose)', ageMonths: 0, description: 'Polio vaccine', doses: 1, category: 'infant' },
    { id: 'hep_b_0', name: 'Hepatitis B (Birth dose)', ageMonths: 0, description: 'Hepatitis B vaccine', doses: 1, category: 'infant' },

    // 6 weeks
    { id: 'opv_1', name: 'OPV 1', ageMonths: 1.5, description: 'Polio vaccine - 1st dose', doses: 1, category: 'infant' },
    { id: 'pentavalent_1', name: 'Pentavalent 1', ageMonths: 1.5, description: 'DPT+HepB+Hib - 1st dose', doses: 1, category: 'infant' },
    { id: 'rotavirus_1', name: 'Rotavirus 1', ageMonths: 1.5, description: 'Rotavirus vaccine - 1st dose', doses: 1, category: 'infant' },
    { id: 'pcv_1', name: 'PCV 1', ageMonths: 1.5, description: 'Pneumococcal vaccine - 1st dose', doses: 1, category: 'infant' },

    // 10 weeks
    { id: 'opv_2', name: 'OPV 2', ageMonths: 2.5, description: 'Polio vaccine - 2nd dose', doses: 1, category: 'infant' },
    { id: 'pentavalent_2', name: 'Pentavalent 2', ageMonths: 2.5, description: 'DPT+HepB+Hib - 2nd dose', doses: 1, category: 'infant' },
    { id: 'rotavirus_2', name: 'Rotavirus 2', ageMonths: 2.5, description: 'Rotavirus vaccine - 2nd dose', doses: 1, category: 'infant' },
    { id: 'pcv_2', name: 'PCV 2', ageMonths: 2.5, description: 'Pneumococcal vaccine - 2nd dose', doses: 1, category: 'infant' },

    // 14 weeks
    { id: 'opv_3', name: 'OPV 3', ageMonths: 3.5, description: 'Polio vaccine - 3rd dose', doses: 1, category: 'infant' },
    { id: 'pentavalent_3', name: 'Pentavalent 3', ageMonths: 3.5, description: 'DPT+HepB+Hib - 3rd dose', doses: 1, category: 'infant' },
    { id: 'rotavirus_3', name: 'Rotavirus 3', ageMonths: 3.5, description: 'Rotavirus vaccine - 3rd dose', doses: 1, category: 'infant' },
    { id: 'pcv_3', name: 'PCV 3', ageMonths: 3.5, description: 'Pneumococcal vaccine - 3rd dose', doses: 1, category: 'infant' },
    { id: 'ipv_1', name: 'IPV 1', ageMonths: 3.5, description: 'Injectable Polio vaccine', doses: 1, category: 'infant' },

    // 9 months
    { id: 'measles_1', name: 'Measles 1', ageMonths: 9, description: 'Measles vaccine - 1st dose', doses: 1, category: 'infant' },

    // 12 months
    { id: 'pcv_booster', name: 'PCV Booster', ageMonths: 12, description: 'Pneumococcal booster', doses: 1, category: 'child' },

    // 16-24 months
    { id: 'dpt_booster_1', name: 'DPT Booster 1', ageMonths: 18, description: 'DPT booster - 1st', doses: 1, category: 'child' },
    { id: 'opv_booster', name: 'OPV Booster', ageMonths: 18, description: 'Polio booster', doses: 1, category: 'child' },
    { id: 'measles_2', name: 'Measles 2 (MR)', ageMonths: 18, description: 'Measles-Rubella - 2nd dose', doses: 1, category: 'child' },

    // 5-6 years
    { id: 'dpt_booster_2', name: 'DPT Booster 2', ageMonths: 60, description: 'DPT booster - 2nd', doses: 1, category: 'child' },

    // 10 years
    { id: 'tdap', name: 'Tdap', ageMonths: 120, description: 'Tetanus-Diphtheria-Pertussis', doses: 1, category: 'child' },

    // Pregnancy
    { id: 'td_1', name: 'TD 1', ageMonths: 0, description: 'Tetanus-Diphtheria - 1st dose (Pregnancy)', doses: 1, category: 'pregnancy' },
    { id: 'td_2', name: 'TD 2', ageMonths: 0, description: 'Tetanus-Diphtheria - 2nd dose (Pregnancy)', doses: 1, category: 'pregnancy' },
];

class VaccinationService {
    private records: VaccinationRecord[] = [];

    /**
     * Initialize service
     */
    async init(): Promise<void> {
        const saved = localStorage.getItem('vitavoice_vaccinations');
        if (saved) {
            this.records = JSON.parse(saved, (key, value) => {
                if (key === 'dateGiven' || key === 'nextDueDate') {
                    return value ? new Date(value) : value;
                }
                return value;
            });
        }
    }

    /**
     * Get vaccination schedule
     */
    getSchedule(category?: 'infant' | 'child' | 'adult' | 'pregnancy'): Vaccine[] {
        if (category) {
            return VACCINATION_SCHEDULE.filter(v => v.category === category);
        }
        return VACCINATION_SCHEDULE;
    }

    /**
     * Add vaccination record
     */
    addRecord(record: Omit<VaccinationRecord, 'id'>): VaccinationRecord {
        const newRecord: VaccinationRecord = {
            ...record,
            id: Date.now().toString(),
        };

        this.records.push(newRecord);
        this.saveRecords();

        return newRecord;
    }

    /**
     * Get vaccination records for a family member
     */
    getRecords(familyMemberId: string): VaccinationRecord[] {
        return this.records.filter(r => r.familyMemberId === familyMemberId);
    }

    /**
     * Get due vaccines for a family member based on age
     */
    getDueVaccines(familyMemberId: string, ageMonths: number): Vaccine[] {
        const givenRecords = this.getRecords(familyMemberId);
        const givenVaccineIds = new Set(givenRecords.map(r => r.vaccineId));

        return VACCINATION_SCHEDULE.filter(vaccine => {
            // Not yet given
            if (givenVaccineIds.has(vaccine.id)) return false;

            // Age appropriate (within 2 months window)
            return ageMonths >= vaccine.ageMonths && ageMonths <= vaccine.ageMonths + 2;
        });
    }

    /**
     * Get overdue vaccines
     */
    getOverdueVaccines(familyMemberId: string, ageMonths: number): Vaccine[] {
        const givenRecords = this.getRecords(familyMemberId);
        const givenVaccineIds = new Set(givenRecords.map(r => r.vaccineId));

        return VACCINATION_SCHEDULE.filter(vaccine => {
            // Not yet given
            if (givenVaccineIds.has(vaccine.id)) return false;

            // Overdue (more than 2 months past due age)
            return ageMonths > vaccine.ageMonths + 2;
        });
    }

    /**
     * Get upcoming vaccines (next 3 months)
     */
    getUpcomingVaccines(familyMemberId: string, ageMonths: number): Vaccine[] {
        const givenRecords = this.getRecords(familyMemberId);
        const givenVaccineIds = new Set(givenRecords.map(r => r.vaccineId));

        return VACCINATION_SCHEDULE.filter(vaccine => {
            // Not yet given
            if (givenVaccineIds.has(vaccine.id)) return false;

            // Upcoming (within next 3 months)
            return vaccine.ageMonths > ageMonths && vaccine.ageMonths <= ageMonths + 3;
        });
    }

    /**
     * Get vaccination completion percentage
     */
    getCompletionPercentage(familyMemberId: string, ageMonths: number): number {
        const givenRecords = this.getRecords(familyMemberId);
        const applicableVaccines = VACCINATION_SCHEDULE.filter(v => v.ageMonths <= ageMonths);

        if (applicableVaccines.length === 0) return 0;

        const givenVaccineIds = new Set(givenRecords.map(r => r.vaccineId));
        const givenCount = applicableVaccines.filter(v => givenVaccineIds.has(v.id)).length;

        return Math.round((givenCount / applicableVaccines.length) * 100);
    }

    /**
     * Generate vaccination certificate
     */
    generateCertificate(familyMemberId: string): {
        familyMemberId: string;
        records: VaccinationRecord[];
        completionPercentage: number;
        generatedDate: Date;
    } {
        const records = this.getRecords(familyMemberId);

        return {
            familyMemberId,
            records,
            completionPercentage: 100, // Simplified
            generatedDate: new Date(),
        };
    }

    /**
     * Delete vaccination record
     */
    deleteRecord(recordId: string): void {
        this.records = this.records.filter(r => r.id !== recordId);
        this.saveRecords();
    }

    /**
     * Save records to localStorage
     */
    private saveRecords(): void {
        localStorage.setItem('vitavoice_vaccinations', JSON.stringify(this.records));
    }

    /**
     * Get vaccination statistics
     */
    getStatistics(familyMemberId: string, ageMonths: number): {
        totalGiven: number;
        dueNow: number;
        overdue: number;
        upcoming: number;
        completionPercentage: number;
    } {
        return {
            totalGiven: this.getRecords(familyMemberId).length,
            dueNow: this.getDueVaccines(familyMemberId, ageMonths).length,
            overdue: this.getOverdueVaccines(familyMemberId, ageMonths).length,
            upcoming: this.getUpcomingVaccines(familyMemberId, ageMonths).length,
            completionPercentage: this.getCompletionPercentage(familyMemberId, ageMonths),
        };
    }
}

export const vaccinationService = new VaccinationService();
