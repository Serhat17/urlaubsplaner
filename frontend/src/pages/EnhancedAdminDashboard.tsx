import React, { useState, useEffect } from 'react';
import { Shield, Users, BarChart3, FileText, Plus, Edit, Trash2, Download, User as UserIcon, MapPin, Calendar as CalendarIcon, Settings, Filter } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { adminAPI, regionAPI, managerAPI } from '../services/api';
import axios from 'axios';
import { User, UserDTO, StatisticsDTO, AuditLog, Role, Region, TeamCalendarEvent, AbsenceTypeColors } from '../types';
import Navbar from '../components/Navbar';

type TabType = 'overview' | 'users' | 'calendar' | 'quota' | 'settings' | 'reports' | 'audit';

const EnhancedAdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [users, setUsers] = useState<User[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [statistics, setStatistics] = useState<StatisticsDTO | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [vacationReport, setVacationReport] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [calendarEvents, setCalendarEvents] = useState<TeamCalendarEvent[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [auditFilter, setAuditFilter] = useState({ employee: '', action: '', startDate: '', endDate: '' });
  const [userForm, setUserForm] = useState<UserDTO>({
    username: '',
    password: '',
    fullName: '',
    role: Role.EMPLOYEE,
    totalVacationDays: 30,
    usedVacationDays: 0,
    active: true,
    regionId: undefined,
  });

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Always load regions for user management
      const regionsData = await regionAPI.getAllRegions();
      setRegions(regionsData);

      if (activeTab === 'overview' || activeTab === 'reports') {
        const stats = await adminAPI.getStatistics();
        setStatistics(stats);
        const report = await adminAPI.getVacationUsageReport();
        setVacationReport(report);
      }
      if (activeTab === 'users' || activeTab === 'quota') {
        const usersData = await adminAPI.getAllUsers();
        setUsers(usersData);
      }
      if (activeTab === 'calendar') {
        const firstDay = new Date(selectedYear, selectedMonth, 1).toISOString().split('T')[0];
        const lastDay = new Date(selectedYear, selectedMonth + 1, 0).toISOString().split('T')[0];
        const events = await managerAPI.getTeamCalendar(firstDay, lastDay);
        setCalendarEvents(events);
      }
      if (activeTab === 'audit') {
        const auth = localStorage.getItem('auth');
        if (auth) {
          const { username, password } = JSON.parse(auth);
          const response = await axios.get('http://localhost:8080/api/audit/logs', {
            auth: { username, password }
          });
          setAuditLogs(response.data);
        }
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    try {
      await adminAPI.createUser(userForm);
      setShowUserModal(false);
      setUserForm({
        username: '',
        password: '',
        fullName: '',
        role: Role.EMPLOYEE,
        totalVacationDays: 30,
        usedVacationDays: 0,
        active: true,
      });
      loadData();
    } catch (error: any) {
      alert(error.response?.data || 'Fehler beim Erstellen des Benutzers');
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;
    try {
      await adminAPI.updateUser(editingUser.id, userForm);
      setShowUserModal(false);
      setEditingUser(null);
      loadData();
    } catch (error: any) {
      alert(error.response?.data || 'Fehler beim Aktualisieren des Benutzers');
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!window.confirm('Benutzer wirklich löschen?')) return;
    try {
      await adminAPI.deleteUser(id);
      loadData();
    } catch (error: any) {
      alert(error.response?.data || 'Fehler beim Löschen');
    }
  };

  const handleExportCSV = async () => {
    try {
      const blob = await adminAPI.exportAuditLogsCSV();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'audit-logs.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      alert('Fehler beim Export');
    }
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setUserForm({
      username: user.username,
      password: '',
      fullName: user.fullName,
      role: user.role,
      totalVacationDays: user.totalVacationDays,
      usedVacationDays: user.usedVacationDays,
      active: user.active,
      regionId: user.region?.id,
    });
    setShowUserModal(true);
  };

  const getRoleColor = (role: Role) => {
    switch (role) {
      case Role.SUPER_MANAGER: return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case Role.MANAGER: return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case Role.EMPLOYEE: return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const updateVacationQuota = async (userId: number, newQuota: number) => {
    try {
      const user = users.find(u => u.id === userId);
      if (!user) return;

      await adminAPI.updateUser(userId, {
        ...user,
        totalVacationDays: newQuota,
      });
      loadData();
    } catch (error) {
      alert('Fehler beim Aktualisieren der Urlaubstage');
    }
  };

  const renderCalendar = () => {
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay();
    const days = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 bg-gray-50 dark:bg-gray-800"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(selectedYear, selectedMonth, day);
      const dateString = currentDate.toISOString().split('T')[0];
      
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

  const filteredAuditLogs = auditLogs.filter(log => {
    if (auditFilter.employee && !log.targetUser?.toLowerCase().includes(auditFilter.employee.toLowerCase())) return false;
    if (auditFilter.action && !log.action.toLowerCase().includes(auditFilter.action.toLowerCase())) return false;
    if (auditFilter.startDate && new Date(log.timestamp) < new Date(auditFilter.startDate)) return false;
    if (auditFilter.endDate && new Date(log.timestamp) > new Date(auditFilter.endDate)) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Shield className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Super Manager Portal
            </h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Vollständige Systemverwaltung und Kontrolle
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex space-x-4 overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center space-x-2 px-4 py-3 border-b-2 font-medium transition-colors whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              <BarChart3 className="h-5 w-5" />
              <span>Übersicht</span>
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center space-x-2 px-4 py-3 border-b-2 font-medium transition-colors whitespace-nowrap ${
                activeTab === 'users'
                  ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              <Users className="h-5 w-5" />
              <span>Benutzerverwaltung</span>
            </button>

            <button
              onClick={() => setActiveTab('calendar')}
              className={`flex items-center space-x-2 px-4 py-3 border-b-2 font-medium transition-colors whitespace-nowrap ${
                activeTab === 'calendar'
                  ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              <CalendarIcon className="h-5 w-5" />
              <span>Globaler Kalender</span>
            </button>

            <button
              onClick={() => setActiveTab('quota')}
              className={`flex items-center space-x-2 px-4 py-3 border-b-2 font-medium transition-colors whitespace-nowrap ${
                activeTab === 'quota'
                  ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              <Users className="h-5 w-5" />
              <span>Urlaubskontingent</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center space-x-2 px-4 py-3 border-b-2 font-medium transition-colors whitespace-nowrap ${
                activeTab === 'settings'
                  ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              <Settings className="h-5 w-5" />
              <span>Einstellungen</span>
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className={`flex items-center space-x-2 px-4 py-3 border-b-2 font-medium transition-colors whitespace-nowrap ${
                activeTab === 'reports'
                  ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              <BarChart3 className="h-5 w-5" />
              <span>Berichte</span>
            </button>

            <button
              onClick={() => setActiveTab('audit')}
              className={`flex items-center space-x-2 px-4 py-3 border-b-2 font-medium transition-colors whitespace-nowrap ${
                activeTab === 'audit'
                  ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              <FileText className="h-5 w-5" />
              <span>Audit-Protokoll</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent"></div>
          </div>
        ) : (
          <>
            {/* Overview Tab */}
            {activeTab === 'overview' && statistics && (
              <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                    <p className="text-purple-100 text-sm">Gesamt Benutzer</p>
                    <p className="text-3xl font-bold mt-1">{statistics.totalUsers}</p>
                  </div>
                  <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    <p className="text-blue-100 text-sm">Mitarbeiter</p>
                    <p className="text-3xl font-bold mt-1">{statistics.totalEmployees}</p>
                  </div>
                  <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
                    <p className="text-green-100 text-sm">Gesamt Anfragen</p>
                    <p className="text-3xl font-bold mt-1">{statistics.totalRequests}</p>
                  </div>
                  <div className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                    <p className="text-orange-100 text-sm">Ø Urlaubstage</p>
                    <p className="text-3xl font-bold mt-1">{statistics.averageVacationDaysUsed.toFixed(1)}</p>
                  </div>
                </div>

                {/* Request Status */}
                <div className="card">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Anfragen-Status
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <p className="text-sm text-yellow-800 dark:text-yellow-200">Ausstehend</p>
                      <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">{statistics.pendingRequests}</p>
                    </div>
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="text-sm text-green-800 dark:text-green-200">Genehmigt</p>
                      <p className="text-2xl font-bold text-green-900 dark:text-green-100">{statistics.approvedRequests}</p>
                    </div>
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <p className="text-sm text-red-800 dark:text-red-200">Abgelehnt</p>
                      <p className="text-2xl font-bold text-red-900 dark:text-red-100">{statistics.rejectedRequests}</p>
                    </div>
                  </div>
                </div>

                {/* Absence Types Distribution */}
                <div className="card">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Abwesenheitstypen
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(statistics.requestsByAbsenceType).map(([type, count]) => (
                      <div key={type} className="flex items-center justify-between">
                        <span className="text-gray-700 dark:text-gray-300">{type}</span>
                        <div className="flex items-center space-x-3">
                          <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-purple-600 h-2 rounded-full"
                              style={{ width: `${(count / statistics.totalRequests) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white w-8 text-right">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div>
                <div className="mb-6 flex justify-between items-center">
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    Benutzerverwaltung
                  </h3>
                  <button
                    onClick={() => {
                      setEditingUser(null);
                      setUserForm({
                        username: '',
                        password: '',
                        fullName: '',
                        role: Role.EMPLOYEE,
                        totalVacationDays: 30,
                        usedVacationDays: 0,
                        active: true,
                        regionId: undefined,
                      });
                      setShowUserModal(true);
                    }}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Neuer Benutzer</span>
                  </button>
                </div>

                <div className="card overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Benutzer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Rolle</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Standort</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Urlaubstage</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Aktionen</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                      {users.map((u) => (
                        <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <UserIcon className="h-8 w-8 text-gray-400 mr-3" />
                              <div>
                                <div className="text-sm font-medium text-gray-900 dark:text-white">{u.fullName}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">{u.username}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(u.role)}`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {u.region ? (
                              <div className="flex items-center text-sm text-gray-900 dark:text-white">
                                <MapPin className="h-4 w-4 mr-2 text-primary-600 dark:text-primary-400" />
                                <span>{u.region.name}</span>
                              </div>
                            ) : (
                              <span className="text-sm text-gray-400 dark:text-gray-500">Global</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {u.usedVacationDays} / {u.totalVacationDays}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              u.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {u.active ? 'Aktiv' : 'Inaktiv'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => openEditModal(u)}
                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400"
                              >
                                <Edit className="h-5 w-5" />
                              </button>
                              {u.role !== Role.SUPER_MANAGER && (
                                <button
                                  onClick={() => handleDeleteUser(u.id)}
                                  className="text-red-600 hover:text-red-900 dark:text-red-400"
                                >
                                  <Trash2 className="h-5 w-5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Reports Tab */}
            {activeTab === 'reports' && (
              <div className="space-y-6">
                <div className="card">
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                    Urlaubsverbrauch pro Mitarbeiter
                  </h3>
                  <div className="space-y-4">
                    {Object.entries(vacationReport).map(([username, data]: [string, any]) => (
                      <div key={username} className="border-b border-gray-200 dark:border-gray-700 pb-4">
                        <div className="flex justify-between items-center mb-2">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{data.fullName}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{username}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {data.usedDays} / {data.totalDays} Tage
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {data.usagePercentage.toFixed(1)}% genutzt
                            </p>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-purple-600 h-2 rounded-full"
                            style={{ width: `${data.usagePercentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Global Calendar Tab */}
            {activeTab === 'calendar' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    Globaler Abwesenheitskalender (Alle Regionen)
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

            {/* Vacation Quota Management Tab */}
            {activeTab === 'quota' && (
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                  Urlaubskontingent-Verwaltung
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Mitarbeiter</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Region</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Gesamte Urlaubstage</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Genutzte Tage</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Verbleibend</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Aktionen</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                      {users.filter(u => u.role === Role.EMPLOYEE).map((u) => (
                        <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{u.fullName}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{u.username}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {u.region?.name || 'Global'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="number"
                              defaultValue={u.totalVacationDays}
                              onBlur={(e) => updateVacationQuota(u.id, parseInt(e.target.value))}
                              className="w-20 input"
                              min="0"
                              max="50"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {u.usedVacationDays}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                              {u.remainingVacationDays} Tage
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button
                              onClick={() => updateVacationQuota(u.id, 30)}
                              className="text-purple-600 hover:text-purple-900 dark:text-purple-400"
                            >
                              Auf Standard (30) zurücksetzen
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* System Settings Tab */}
            {activeTab === 'settings' && (
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                  Systemeinstellungen
                </h3>
                <div className="space-y-6">
                  <div className="card">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Abwesenheitstypen verwalten
                    </h4>
                    <div className="space-y-2">
                      {Object.entries(AbsenceTypeColors).map(([type, color]) => (
                        <div key={type} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded">
                          <div className="flex items-center">
                            <div className="w-4 h-4 rounded mr-3" style={{ backgroundColor: color }}></div>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">{type}</span>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">Standard-Typ (nicht löschbar)</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="card">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Regionsverwaltung
                    </h4>
                    <div className="space-y-2">
                      {regions.map(region => (
                        <div key={region.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 text-purple-600 dark:text-purple-400 mr-3" />
                            <span className="text-sm font-medium text-gray-900 dark:text-white">{region.name}</span>
                            <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">({region.city}, {region.country})</span>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs ${region.active ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                            {region.active ? 'Aktiv' : 'Inaktiv'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="card">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Urlaubsjahr-Konfiguration
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Urlaubsjahr beginnt am:
                        </label>
                        <select className="input">
                          <option value="01-01">1. Januar (Kalenderjahr)</option>
                          <option value="employee-start">Eintrittsdatum des Mitarbeiters</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Standard-Urlaubstage pro Jahr:
                        </label>
                        <input type="number" defaultValue="30" className="input w-32" min="20" max="40" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Audit Tab */}
            {activeTab === 'audit' && (
              <div>
                <div className="mb-6 flex justify-between items-center">
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    Audit-Protokoll
                  </h3>
                  <button
                    onClick={handleExportCSV}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Download className="h-5 w-5" />
                    <span>CSV Export</span>
                  </button>
                </div>

                {/* Filters */}
                <div className="card mb-4">
                  <div className="flex items-center mb-4">
                    <Filter className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-2" />
                    <h4 className="font-semibold text-gray-900 dark:text-white">Filter</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input
                      type="text"
                      placeholder="Mitarbeiter suchen..."
                      value={auditFilter.employee}
                      onChange={(e) => setAuditFilter({...auditFilter, employee: e.target.value})}
                      className="input"
                    />
                    <input
                      type="text"
                      placeholder="Aktion filtern..."
                      value={auditFilter.action}
                      onChange={(e) => setAuditFilter({...auditFilter, action: e.target.value})}
                      className="input"
                    />
                    <input
                      type="date"
                      placeholder="Von Datum"
                      value={auditFilter.startDate}
                      onChange={(e) => setAuditFilter({...auditFilter, startDate: e.target.value})}
                      className="input"
                    />
                    <input
                      type="date"
                      placeholder="Bis Datum"
                      value={auditFilter.endDate}
                      onChange={(e) => setAuditFilter({...auditFilter, endDate: e.target.value})}
                      className="input"
                    />
                  </div>
                  <button
                    onClick={() => setAuditFilter({ employee: '', action: '', startDate: '', endDate: '' })}
                    className="mt-2 text-sm text-purple-600 hover:text-purple-800 dark:text-purple-400"
                  >
                    Filter zurücksetzen
                  </button>
                </div>

                <div className="card overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Zeitstempel</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Aktion</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Durchgeführt von</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Details</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                      {filteredAuditLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {formatTimestamp(log.timestamp)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                              {log.action}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {log.performedBy}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                            {log.details}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {/* User Modal */}
        {showUserModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {editingUser ? 'Benutzer bearbeiten' : 'Neuer Benutzer'}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Benutzername</label>
                  <input
                    type="text"
                    value={userForm.username}
                    onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
                    className="input"
                    disabled={!!editingUser}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Passwort {editingUser && '(leer lassen zum Beibehalten)'}
                  </label>
                  <input
                    type="password"
                    value={userForm.password}
                    onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Vollständiger Name</label>
                  <input
                    type="text"
                    value={userForm.fullName}
                    onChange={(e) => setUserForm({ ...userForm, fullName: e.target.value })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rolle</label>
                  <select
                    value={userForm.role}
                    onChange={(e) => setUserForm({ ...userForm, role: e.target.value as Role })}
                    className="input"
                  >
                    <option value={Role.EMPLOYEE}>Mitarbeiter</option>
                    <option value={Role.MANAGER}>Manager</option>
                    <option value={Role.SUPER_MANAGER}>Super Manager</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Standort</label>
                  <select
                    value={userForm.regionId || ''}
                    onChange={(e) => setUserForm({ ...userForm, regionId: e.target.value ? Number(e.target.value) : undefined })}
                    className="input"
                  >
                    <option value="">Kein Standort (Global)</option>
                    {regions.map((region) => (
                      <option key={region.id} value={region.id}>
                        {region.name} - {region.city}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Urlaubstage</label>
                  <input
                    type="number"
                    value={userForm.totalVacationDays}
                    onChange={(e) => setUserForm({ ...userForm, totalVacationDays: parseInt(e.target.value) })}
                    className="input"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={userForm.active}
                    onChange={(e) => setUserForm({ ...userForm, active: e.target.checked })}
                    className="mr-2"
                  />
                  <label className="text-sm text-gray-700 dark:text-gray-300">Aktiv</label>
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={editingUser ? handleUpdateUser : handleCreateUser}
                  className="btn-primary flex-1"
                >
                  {editingUser ? 'Aktualisieren' : 'Erstellen'}
                </button>
                <button
                  onClick={() => {
                    setShowUserModal(false);
                    setEditingUser(null);
                  }}
                  className="btn-secondary flex-1"
                >
                  Abbrechen
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedAdminDashboard;
