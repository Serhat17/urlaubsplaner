import React, { useState, useEffect } from 'react';
import { Calendar, Users, CheckCircle, XCircle, Clock } from 'lucide-react';
import { vacationAPI } from '../services/api';
import { VacationRequest, VacationStatus } from '../types';
import Navbar from '../components/Navbar';
import VacationCard from '../components/VacationCard';

const ManagerDashboard: React.FC = () => {
  const [requests, setRequests] = useState<VacationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<VacationStatus | 'ALL'>('ALL');

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const data = await vacationAPI.getAllRequests();
      setRequests(data);
    } catch (err) {
      console.error('Failed to load requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await vacationAPI.approveRequest(id);
      loadRequests();
    } catch (err: any) {
      alert(err.response?.data || 'Fehler beim Genehmigen');
    }
  };

  const handleReject = async (id: number) => {
    try {
      await vacationAPI.rejectRequest(id);
      loadRequests();
    } catch (err: any) {
      alert(err.response?.data || 'Fehler beim Ablehnen');
    }
  };

  const filteredRequests = requests.filter((req) => {
    if (filter === 'ALL') return true;
    return req.status === filter;
  });

  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === VacationStatus.PENDING).length,
    approved: requests.filter((r) => r.status === VacationStatus.APPROVED).length,
    rejected: requests.filter((r) => r.status === VacationStatus.REJECTED).length,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Manager Dashboard
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Urlaubsanfragen verwalten und genehmigen
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-100 text-sm">Gesamt</p>
                <p className="text-3xl font-bold mt-1">{stats.total}</p>
              </div>
              <Users className="h-12 w-12 text-primary-200" />
            </div>
          </div>

          <div className="card bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm">Ausstehend</p>
                <p className="text-3xl font-bold mt-1">{stats.pending}</p>
              </div>
              <Clock className="h-12 w-12 text-yellow-200" />
            </div>
          </div>

          <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Genehmigt</p>
                <p className="text-3xl font-bold mt-1">{stats.approved}</p>
              </div>
              <CheckCircle className="h-12 w-12 text-green-200" />
            </div>
          </div>

          <div className="card bg-gradient-to-br from-red-500 to-red-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm">Abgelehnt</p>
                <p className="text-3xl font-bold mt-1">{stats.rejected}</p>
              </div>
              <XCircle className="h-12 w-12 text-red-200" />
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'ALL'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Alle ({stats.total})
          </button>
          <button
            onClick={() => setFilter(VacationStatus.PENDING)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === VacationStatus.PENDING
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Ausstehend ({stats.pending})
          </button>
          <button
            onClick={() => setFilter(VacationStatus.APPROVED)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === VacationStatus.APPROVED
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Genehmigt ({stats.approved})
          </button>
          <button
            onClick={() => setFilter(VacationStatus.REJECTED)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === VacationStatus.REJECTED
                ? 'bg-red-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Abgelehnt ({stats.rejected})
          </button>
        </div>

        {/* Requests List */}
        <div>
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"></div>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="card text-center py-12">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                Keine Anfragen in dieser Kategorie
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRequests.map((request) => (
                <VacationCard
                  key={request.id}
                  request={request}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  showActions={true}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
