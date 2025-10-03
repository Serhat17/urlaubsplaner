import React from 'react';
import { Calendar, Clock, FileText, Users, Briefcase } from 'lucide-react';
import { VacationRequest, VacationStatus, AbsenceTypeLabels, AbsenceTypeColors } from '../types';

interface VacationCardProps {
  request: VacationRequest;
  onApprove?: (id: number) => void;
  onReject?: (id: number) => void;
  showActions?: boolean;
}

const VacationCard: React.FC<VacationCardProps> = ({
  request,
  onApprove,
  onReject,
  showActions = false,
}) => {
  const getStatusColor = (status: VacationStatus) => {
    switch (status) {
      case VacationStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case VacationStatus.APPROVED:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case VacationStatus.REJECTED:
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusText = (status: VacationStatus) => {
    switch (status) {
      case VacationStatus.PENDING:
        return 'Ausstehend';
      case VacationStatus.APPROVED:
        return 'Genehmigt';
      case VacationStatus.REJECTED:
        return 'Abgelehnt';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="card hover:shadow-xl" style={{ borderLeft: `4px solid ${AbsenceTypeColors[request.absenceType]}` }}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {request.employeeName}
          </h3>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
              {getStatusText(request.status)}
            </span>
            <span 
              className="inline-block px-3 py-1 rounded-full text-xs font-medium text-white"
              style={{ backgroundColor: AbsenceTypeColors[request.absenceType] }}
            >
              {AbsenceTypeLabels[request.absenceType]}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {request.daysRequested} Tag{request.daysRequested !== 1 ? 'e' : ''}
          </p>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
          <Calendar className="h-4 w-4 mr-2 text-primary-600 dark:text-primary-400" />
          <span>
            {formatDate(request.startDate)} - {formatDate(request.endDate)}
          </span>
        </div>

        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
          <Clock className="h-4 w-4 mr-2 text-primary-600 dark:text-primary-400" />
          <span>Erstellt am {formatDate(request.createdAt)}</span>
        </div>

        {request.representativeName && (
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <Users className="h-4 w-4 mr-2 text-primary-600 dark:text-primary-400" />
            <span>Vertretung: {request.representativeName}</span>
          </div>
        )}

        {request.notes && (
          <div className="flex items-start text-sm text-gray-600 dark:text-gray-300">
            <FileText className="h-4 w-4 mr-2 mt-0.5 text-primary-600 dark:text-primary-400" />
            <span>{request.notes}</span>
          </div>
        )}
      </div>

      {showActions && request.status === VacationStatus.PENDING && (
        <div className="flex space-x-2 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => onApprove?.(request.id)}
            className="btn-success flex-1"
          >
            Genehmigen
          </button>
          <button
            onClick={() => onReject?.(request.id)}
            className="btn-danger flex-1"
          >
            Ablehnen
          </button>
        </div>
      )}
    </div>
  );
};

export default VacationCard;
