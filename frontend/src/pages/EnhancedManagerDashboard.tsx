import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Users, BarChart3, AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { managerAPI, vacationAPI } from '../services/api';
import { VacationRequest, TeamStatistics, TeamCalendarEvent, AbsenceType, VacationStatus, AbsenceTypeColors } from '../types';
import Navbar from '../components/Navbar';

type TabType = 'requests' | 'calendar' | 'statistics' | 'overload';

const EnhancedManagerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('requests');
  const [requests, setRequests] = useState<VacationRequest[]>([]);
  const [teamStats, setTeamStats] = useState<TeamStatistics[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<TeamCalendarEvent[]>([]);
  const [overloadWarnings, setOverloadWarnings] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    loadData();
  }, [activeTab, selectedMonth, selectedYear]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'requests') {
        const data = await vacationAPI.getAllRequests();
        setRequests(data);
      }
      if (activeTab === 'statistics') {
        const stats = await managerAPI.getTeamStatistics();
        setTeamStats(stats);
      }
      if (activeTab === 'calendar') {
        const firstDay = new Date(selectedYear, selectedMonth, 1).toISOString().split('T')[0];
        const lastDay = new Date(selectedYear, selectedMonth + 1, 0).toISOString().split('T')[0];
        const events = await managerAPI.getTeamCalendar(firstDay, lastDay);
        setCalendarEvents(events);
      }
      if (activeTab === 'overload') {
        const warnings = await managerAPI.getTeamOverloadWarnings();
        setOverloadWarnings(warnings);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await vacationAPI.approveRequest(id);
      loadData();
    } catch (error) {
      alert('Fehler beim Genehmigen der Anfrage');
    }
  };

  const handleReject = async (id: number) => {
    try {
      await vacationAPI.rejectRequest(id);
      loadData();
    } catch (error) {
      alert('Fehler beim Ablehnen der Anfrage');
    }
  };

  const getStatusBadge = (status: VacationStatus) => {
    switch (status) {
      case VacationStatus.PENDING:
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Ausstehend</span>;
      case VacationStatus.APPROVED:
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Genehmigt</span>;
      case VacationStatus.REJECTED:
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Abgelehnt</span>;
    }
  };

  const renderCalendar = () => {
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay();
    const days = [];

    // Add empty cells for days before the month starts
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 bg-gray-50 dark:bg-gray-800"></div>);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(selectedYear, selectedMonth, day);
      const dateString = currentDate.toISOString().split('T')[0];
      
      // Find events for this day
      const dayEvents = calendarEvents.filter(event => {
        const start = new Date(event.startDate);
        const end = new Date(event.endDate);
        return currentDate >= start && currentDate <= end;
      });

      days.push(
        <div key={day} className="h-24 border border-gray-200 dark:border-gray-700 p-1 overflow-y-auto">
          <div className="text-sm font-semibold text-gray-900 dark:text-white mb-1">{day}</div>
          {dayEvents.map((event, idx) => (
            <div
              key={idx}
              className="text-xs p-1 mb-1 rounded truncate"
              style={{
                backgroundColor: AbsenceTypeColors[event.absenceType] + '20',
                borderLeft: `3px solid ${AbsenceTypeColors[event.absenceType]}`
              }}
              title={`${event.employeeFullName} - ${event.absenceType}`}
            >
              {event.employeeFullName.split(' ')[0]}
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
        {['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'].map(day => (
          <div key={day} className="bg-gray-100 dark:bg-gray-800 p-2 text-center font-semibold text-gray-900 dark:text-white">
            {day}
          </div>
        ))}
        {days}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Manager Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Willkommen, {user?.fullName} - Verwalten Sie Ihr Team
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('requests')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'requests'
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400'
              }`}
            >
              <Clock className="inline h-5 w-5 mr-2" />
              Anfragen
            </button>
            <button
              onClick={() => setActiveTab('calendar')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'calendar'
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400'
              }`}
            >
              <CalendarIcon className="inline h-5 w-5 mr-2" />
              Team-Kalender
            </button>
            <button
              onClick={() => setActiveTab('statistics')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'statistics'
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400'
              }`}
            >
              <BarChart3 className="inline h-5 w-5 mr-2" />
              Statistiken
            </button>
            <button
              onClick={() => setActiveTab('overload')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overload'
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400'
              }`}
            >
              <AlertTriangle className="inline h-5 w-5 mr-2" />
              Überlastungswarnungen
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="card">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Laden...</p>
            </div>
          ) : (
            <>
              {/* Requests Tab */}
              {activeTab === 'requests' && (
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                    Urlaubsanträge
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Mitarbeiter</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Zeitraum</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Typ</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Tage</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Vertretung</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Aktionen</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                        {requests.map((req) => (
                          <tr key={req.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                              {req.employeeName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {new Date(req.startDate).toLocaleDateString('de-DE')} - {new Date(req.endDate).toLocaleDateString('de-DE')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {req.absenceType}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {req.daysRequested}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getStatusBadge(req.status)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {req.representativeName || '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {req.status === VacationStatus.PENDING && (
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleApprove(req.id)}
                                    className="text-green-600 hover:text-green-900 dark:text-green-400"
                                    title="Genehmigen"
                                  >
                                    <CheckCircle className="h-5 w-5" />
                                  </button>
                                  <button
                                    onClick={() => handleReject(req.id)}
                                    className="text-red-600 hover:text-red-900 dark:text-red-400"
                                    title="Ablehnen"
                                  >
                                    <XCircle className="h-5 w-5" />
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Calendar Tab */}
              {activeTab === 'calendar' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                      Team-Abwesenheitskalender
                    </h3>
                    <div className="flex space-x-2">
                      <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                        className="input"
                      >
                        {['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'].map((month, idx) => (
                          <option key={idx} value={idx}>{month}</option>
                        ))}
                      </select>
                      <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                        className="input"
                      >
                        {[2024, 2025, 2026].map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  {/* Legend */}
                  <div className="mb-4 flex flex-wrap gap-4">
                    {Object.entries(AbsenceTypeColors).map(([type, color]) => (
                      <div key={type} className="flex items-center">
                        <div className="w-4 h-4 rounded mr-2" style={{ backgroundColor: color }}></div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">{type}</span>
                      </div>
                    ))}
                  </div>

                  {renderCalendar()}
                </div>
              )}

              {/* Statistics Tab */}
              {activeTab === 'statistics' && (
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                    Team-Statistiken
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Mitarbeiter</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Urlaub (Verbleibend)</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Krankheit</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Home Office</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Geschäftsreise</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Weiterbildung</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                        {teamStats.map((stat) => (
                          <tr key={stat.userId} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">{stat.fullName}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{stat.regionName}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 dark:text-white">
                                {stat.usedVacationDays} / {stat.totalVacationDays}
                              </div>
                              <div className="text-xs text-green-600 dark:text-green-400 font-semibold">
                                {stat.remainingVacationDays} Tage übrig
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {stat.sickDays} Tage
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {stat.homeOfficeDays} Tage
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {stat.businessTripDays} Tage
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {stat.trainingDays} Tage
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Overload Warnings Tab */}
              {activeTab === 'overload' && (
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                    Team-Überlastungswarnungen
                  </h3>
                  {Object.keys(overloadWarnings).length === 0 ? (
                    <div className="text-center py-12">
                      <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400">
                        Keine Überlastungswarnungen - Ihr Team ist gut verteilt!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {Object.entries(overloadWarnings).map(([date, count]) => (
                        <div key={date} className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                          <div className="flex items-center">
                            <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400 mr-3" />
                            <div>
                              <div className="font-semibold text-gray-900 dark:text-white">
                                {new Date(date).toLocaleDateString('de-DE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                {count} Mitarbeiter abwesend (&gt;50% des Teams)
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedManagerDashboard;
