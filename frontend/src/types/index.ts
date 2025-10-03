export enum Role {
  EMPLOYEE = 'EMPLOYEE',
  MANAGER = 'MANAGER',
  SUPER_MANAGER = 'SUPER_MANAGER',
}

export enum VacationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum AbsenceType {
  VACATION = 'VACATION',
  SICK_LEAVE = 'SICK_LEAVE',
  HOME_OFFICE = 'HOME_OFFICE',
  BUSINESS_TRIP = 'BUSINESS_TRIP',
  TRAINING = 'TRAINING',
}

export const AbsenceTypeLabels: Record<AbsenceType, string> = {
  [AbsenceType.VACATION]: 'Urlaub',
  [AbsenceType.SICK_LEAVE]: 'Krankmeldung',
  [AbsenceType.HOME_OFFICE]: 'Home Office',
  [AbsenceType.BUSINESS_TRIP]: 'Dienstreise',
  [AbsenceType.TRAINING]: 'Schulung',
};

export const AbsenceTypeColors: Record<AbsenceType, string> = {
  [AbsenceType.VACATION]: '#3B82F6', // Blue
  [AbsenceType.SICK_LEAVE]: '#EF4444', // Red
  [AbsenceType.HOME_OFFICE]: '#10B981', // Green
  [AbsenceType.BUSINESS_TRIP]: '#F59E0B', // Orange
  [AbsenceType.TRAINING]: '#8B5CF6', // Purple
};

export interface Region {
  id: number;
  name: string;
  city: string;
  country: string;
  active: boolean;
}

export interface User {
  id: number;
  username: string;
  fullName: string;
  role: Role;
  totalVacationDays: number;
  usedVacationDays: number;
  remainingVacationDays: number;
  active: boolean;
  region?: Region;
}

export interface VacationRequest {
  id: number;
  employeeName: string;
  startDate: string;
  endDate: string;
  status: VacationStatus;
  absenceType: AbsenceType;
  notes?: string;
  representativeName?: string;
  createdAt: string;
  daysRequested: number;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  username: string;
  fullName: string;
  role: Role;
  totalVacationDays: number;
  usedVacationDays: number;
  remainingVacationDays: number;
  message: string;
}

export interface VacationRequestDTO {
  employeeName: string;
  startDate: string;
  endDate: string;
  absenceType: AbsenceType;
  notes?: string;
  representativeName?: string;
}

export interface TeamStatistics {
  userId: number;
  username: string;
  fullName: string;
  totalVacationDays: number;
  usedVacationDays: number;
  remainingVacationDays: number;
  sickDays: number;
  homeOfficeDays: number;
  businessTripDays: number;
  trainingDays: number;
  regionName: string;
}

export interface TeamCalendarEvent {
  id: number;
  employeeName: string;
  employeeFullName: string;
  startDate: string;
  endDate: string;
  absenceType: AbsenceType;
  status: VacationStatus;
  representativeName?: string;
  daysRequested: number;
}

export interface AuditLog {
  id: number;
  action: string;
  performedBy: string;
  targetUser?: string;
  requestId?: number;
  details?: string;
  timestamp: string;
  ipAddress?: string;
}

export interface UserDTO {
  username: string;
  password?: string;
  fullName: string;
  role: Role;
  totalVacationDays?: number;
  usedVacationDays?: number;
  active?: boolean;
  regionId?: number;
}

export interface StatisticsDTO {
  totalUsers: number;
  totalEmployees: number;
  totalManagers: number;
  totalRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  averageVacationDaysUsed: number;
  requestsByAbsenceType: Record<string, number>;
  requestsByMonth: Record<string, number>;
}
