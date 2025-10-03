import React, { useState, useEffect } from 'react';
import { Calendar, Plus, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { vacationAPI } from '../services/api';
import { VacationRequest, AbsenceType, AbsenceTypeLabels } from '../types';
import Navbar from '../components/Navbar';
import VacationCard from '../components/VacationCard';

const EmployeeDashboard: React.FC = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<VacationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    absenceType: AbsenceType.VACATION,
    notes: '',
    representativeName: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    loadRequests();
  }, [user]);

  const loadRequests = async () => {
    if (!user) return;
    
    try {
      const data = await vacationAPI.getRequestsByEmployee(user.username);
      setRequests(data);
    } catch (err) {
      console.error('Failed to load requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!user) return;

    try {
      await vacationAPI.createRequest({
        employeeName: user.username,
        startDate: formData.startDate,
        endDate: formData.endDate,
        absenceType: formData.absenceType,
        notes: formData.notes,
        representativeName: formData.representativeName,
      });

      setFormData({ startDate: '', endDate: '', absenceType: AbsenceType.VACATION, notes: '', representativeName: '' });
      setShowForm(false);
      loadRequests();
    } catch (err: any) {
      setError(err.response?.data || 'Fehler beim Erstellen der Anfrage');
    }
  };

  const vacationPercentage = user
    ? ((user.totalVacationDays - user.remainingVacationDays) / user.totalVacationDays) * 100
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-100 text-sm">Verfügbare Urlaubstage</p>
                <p className="text-3xl font-bold mt-1">{user?.remainingVacationDays}</p>
              </div>
              <Calendar className="h-12 w-12 text-primary-200" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Genutzte Tage</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {user?.usedVacationDays}
                </p>
              </div>
              <TrendingUp className="h-12 w-12 text-primary-600 dark:text-primary-400" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Gesamt</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {user?.totalVacationDays}
                </p>
              </div>
              <Calendar className="h-12 w-12 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="card mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Urlaubsverbrauch
          </h3>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
            <div
              className="bg-primary-600 h-4 rounded-full transition-all duration-500"
              style={{ width: `${vacationPercentage}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {user?.usedVacationDays} von {user?.totalVacationDays} Tagen genutzt
          </p>
        </div>

        {/* New Request Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Neue Urlaubsanfrage</span>
          </button>
        </div>

        {/* Request Form */}
        {showForm && (
          <div className="card mb-8">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Neue Urlaubsanfrage erstellen
            </h3>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Startdatum
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Enddatum
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="input"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Abwesenheitstyp
                  </label>
                  <select
                    value={formData.absenceType}
                    onChange={(e) => setFormData({ ...formData, absenceType: e.target.value as AbsenceType })}
                    className="input"
                    required
                  >
                    {Object.entries(AbsenceTypeLabels).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Vertretung (optional)
                  </label>
                  <input
                    type="text"
                    value={formData.representativeName}
                    onChange={(e) => setFormData({ ...formData, representativeName: e.target.value })}
                    className="input"
                    placeholder="Name der Vertretung"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notizen (optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="input"
                  rows={3}
                  placeholder="Zusätzliche Informationen..."
                />
              </div>

              <div className="flex space-x-3">
                <button type="submit" className="btn-primary">
                  Anfrage erstellen
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setFormData({ startDate: '', endDate: '', absenceType: AbsenceType.VACATION, notes: '', representativeName: '' });
                    setError('');
                  }}
                  className="btn-secondary"
                >
                  Abbrechen
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Requests List */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Meine Urlaubsanfragen
          </h3>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"></div>
            </div>
          ) : requests.length === 0 ? (
            <div className="card text-center py-12">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                Noch keine Urlaubsanfragen vorhanden
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {requests.map((request) => (
                <VacationCard key={request.id} request={request} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
