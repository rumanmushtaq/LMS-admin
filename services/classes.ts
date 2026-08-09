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
  createdAt: string;
  updatedAt: string;
}

export const getAllClasses = async () => {
  const response = await api.get('/api/v1/classes/all');
  return response.data;
};

export const deleteClassAsAdmin = async (id: string) => {
  const response = await api.delete(`/api/v1/classes/${id}`);
  return response.data;
};
