import { HTTP_CLIENT as api } from '../utils/axiosClient';

export enum ClassStatus {
  SCHEDULED = 'SCHEDULED',
  ONGOING = 'ONGOING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface ClassSession {
  _id: string;
  tutorId: any;
  title: string;
  description: string;
  students: any[];
  courseId?: any;
  meetingLink?: string;
  startTime: string;
  endTime: string;
  status: ClassStatus;
  cancelReason?: string | null;
  cancelledByRole?: 'tutor' | 'admin' | null;
  cancelledAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export const getAllClasses = async () => {
  const response = await api.get('/api/v1/classes/all');
  return response.data;
};

/**
 * Cancel keeps the class record (status → CANCELLED), notifies enrolled
 * students, and lets the backend enforce the tutor 3-strike rule. This is
 * the action the admin UI should use.
 */
export const cancelClassAsAdmin = async (id: string, reason?: string) => {
  const response = await api.patch(`/api/v1/classes/${id}/cancel`, { reason });
  return response.data;
};

/** Hard delete — erases the record and its audit trail. Prefer cancelClassAsAdmin. */
export const deleteClassAsAdmin = async (id: string) => {
  const response = await api.delete(`/api/v1/classes/${id}`);
  return response.data;
};
