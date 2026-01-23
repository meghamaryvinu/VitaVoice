import { useEffect, useState } from 'react';
import { supabase } from '@/config/supabase';
import { vaccinationService, Vaccine } from '@/services/vaccinationService';
import { authService } from '@/services/authService';
import { useNavigate } from 'react-router-dom'; // or your router

export default function VaccinationTracker() {
  const navigate = useNavigate(); // If using React Router
  const [loading, setLoading] = useState(true);
  const [patientRecordId, setPatientRecordId] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [ageMonths, setAgeMonths] = useState(0);
  const [dueVaccines, setDueVaccines] = useState<Vaccine[]>([]);
  const [overdueVaccines, setOverdueVaccines] = useState<Vaccine[]>([]);
  const [upcomingVaccines, setUpcomingVaccines] = useState<Vaccine[]>([]);
  const [givenRecords, setGivenRecords] = useState<any[]>([]);
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null);
  const [editDate, setEditDate] = useState<string>('');

  useEffect(() => {
    loadVaccinations();
  }, []);

  async function loadVaccinations() {
    try {
      vaccinationService.setSupabaseClient(supabase);

      const user = await authService.getCurrentUser();
      if (!user) {
        console.log('No user found');
        setLoading(false);
        return;
      }

      setUserId(user.id);

      const { data: patientRecord, error } = await supabase
        .from('patient_health_records')
        .select('id, age')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching patient record:', error);
        setLoading(false);
        return;
      }

      setPatientRecordId(patientRecord.id);
      
      const months = patientRecord.age * 12;
      setAgeMonths(months);

      await vaccinationService.init(user.id);

      const due = vaccinationService.getDueVaccines(patientRecord.id, months);
      const overdue = vaccinationService.getOverdueVaccines(patientRecord.id, months);
      const upcoming = vaccinationService.getUpcomingVaccines(patientRecord.id, months);
      const records = vaccinationService.getRecords(patientRecord.id);

      setDueVaccines(due);
      setOverdueVaccines(overdue);
      setUpcomingVaccines(upcoming);
      setGivenRecords(records);

    } catch (error) {
      console.error('Error loading vaccinations:', error);
    } finally {
      setLoading(false);
    }
  }

  async function markVaccineAsTaken(vaccine: Vaccine) {
    if (!patientRecordId || !userId) return;

    const success = await vaccinationService.addRecord({
      patientHealthRecordId: patientRecordId,
      vaccineId: vaccine.id,
      vaccineName: vaccine.name,
      dateGiven: new Date(),
      doseNumber: 1,
      isCompleted: true,
    }, userId);

    if (success) {
      await loadVaccinations();
      alert('Vaccine marked as taken!');
    } else {
      alert('Failed to save vaccination record');
    }
  }

  function startEditDate(record: any) {
    setEditingRecordId(record.id);
    const dateStr = new Date(record.dateGiven).toISOString().split('T')[0];
    setEditDate(dateStr);
  }

  function cancelEdit() {
    setEditingRecordId(null);
    setEditDate('');
  }

  async function saveEditDate(recordId: string) {
    if (!userId || !editDate) return;

    try {
      const { error } = await supabase
        .from('vaccination_records')
        .update({
          date_given: new Date(editDate).toISOString(),
        })
        .eq('id', recordId)
        .eq('user_id', userId);

      if (error) throw error;

      await loadVaccinations();
      setEditingRecordId(null);
      setEditDate('');
      alert('Date updated successfully!');
    } catch (error) {
      console.error('Error updating date:', error);
      alert('Failed to update date');
    }
  }

  async function deleteRecord(recordId: string) {
    if (!confirm('Are you sure you want to delete this vaccination record?')) return;

    const success = await vaccinationService.deleteRecord(recordId, userId);
    if (success) {
      await loadVaccinations();
      alert('Record deleted successfully!');
    } else {
      alert('Failed to delete record');
    }
  }

  const goBack = () => {
    navigate('/home'); // Change '/home' to your actual home route
    // OR use: window.history.back(); // to go to previous page
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your vaccination records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={goBack}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors group"
        >
          <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:shadow-md transition-shadow">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </div>
          <span className="font-medium">Back</span>
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">💉 Vaccination Tracker</h1>
          <p className="text-gray-600">Keep track of your immunization records</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="text-sm text-gray-500 mb-1">Completed</div>
            <div className="text-3xl font-bold text-green-600">{givenRecords.length}</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="text-sm text-gray-500 mb-1">Due Now</div>
            <div className="text-3xl font-bold text-blue-600">{dueVaccines.length}</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="text-sm text-gray-500 mb-1">Pending</div>
            <div className="text-3xl font-bold text-amber-600">{overdueVaccines.length}</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="text-sm text-gray-500 mb-1">Upcoming</div>
            <div className="text-3xl font-bold text-purple-600">{upcomingVaccines.length}</div>
          </div>
        </div>

        {/* Already Taken */}
        {givenRecords.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 bg-green-500 rounded"></div>
              <h2 className="text-xl font-semibold text-gray-800">Completed Vaccinations</h2>
            </div>
            <div className="space-y-3">
              {givenRecords.map(record => (
                <div key={record.id} className="bg-white rounded-xl shadow-sm p-4 border border-green-100 hover:shadow-md transition-shadow">
                  {editingRecordId === record.id ? (
                    <div>
                      <div className="font-medium text-gray-800 mb-3">{record.vaccineName}</div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <input
                          type="date"
                          value={editDate}
                          onChange={(e) => setEditDate(e.target.value)}
                          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <button
                          onClick={() => saveEditDate(record.id)}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-xl">✓</span>
                          </div>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800">{record.vaccineName}</div>
                          <div className="text-sm text-gray-500 mt-1">
                            📅 {new Date(record.dateGiven).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEditDate(record)}
                          className="text-blue-600 hover:text-blue-700 px-3 py-1 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteRecord(record.id)}
                          className="text-red-600 hover:text-red-700 px-3 py-1 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Due Now */}
        {dueVaccines.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 bg-blue-500 rounded"></div>
              <h2 className="text-xl font-semibold text-gray-800">Due Now</h2>
            </div>
            <div className="space-y-3">
              {dueVaccines.map(vaccine => (
                <div key={vaccine.id} className="bg-white rounded-xl shadow-sm p-4 border border-blue-100 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="mt-1">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-xl">💉</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800">{vaccine.name}</div>
                        <div className="text-sm text-gray-600 mt-1">{vaccine.description}</div>
                        <div className="text-xs text-gray-500 mt-2 bg-blue-50 inline-block px-2 py-1 rounded">
                          Due at {vaccine.ageMonths} months
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => markVaccineAsTaken(vaccine)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors whitespace-nowrap"
                    >
                      Mark Done
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Overdue - Now with softer amber/orange colors */}
        {overdueVaccines.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 bg-amber-500 rounded"></div>
              <h2 className="text-xl font-semibold text-gray-800">Pending Vaccinations</h2>
            </div>
            <div className="space-y-3">
              {overdueVaccines.map(vaccine => (
                <div key={vaccine.id} className="bg-white rounded-xl shadow-sm p-4 border border-amber-100 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="mt-1">
                        <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                          <span className="text-xl">⏰</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800">{vaccine.name}</div>
                        <div className="text-sm text-gray-600 mt-1">{vaccine.description}</div>
                        <div className="text-xs text-amber-700 mt-2 bg-amber-50 inline-block px-2 py-1 rounded">
                          Recommended at {vaccine.ageMonths} months
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => markVaccineAsTaken(vaccine)}
                      className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors whitespace-nowrap"
                    >
                      Mark Done
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming */}
        {upcomingVaccines.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 bg-purple-500 rounded"></div>
              <h2 className="text-xl font-semibold text-gray-800">Upcoming Vaccinations</h2>
            </div>
            <div className="space-y-3">
              {upcomingVaccines.map(vaccine => (
                <div key={vaccine.id} className="bg-white rounded-xl shadow-sm p-4 border border-purple-100 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-xl">📅</span>
                      </div>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">{vaccine.name}</div>
                      <div className="text-sm text-gray-600 mt-1">{vaccine.description}</div>
                      <div className="text-xs text-purple-700 mt-2 bg-purple-50 inline-block px-2 py-1 rounded">
                        Due at {vaccine.ageMonths} months
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {dueVaccines.length === 0 && overdueVaccines.length === 0 && upcomingVaccines.length === 0 && givenRecords.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <div className="text-6xl mb-4">🎉</div>
            <div className="text-xl font-semibold text-gray-800 mb-2">All Caught Up!</div>
            <div className="text-gray-600">You're up to date with your vaccinations</div>
          </div>
        )}
      </div>
    </div>
  );
}