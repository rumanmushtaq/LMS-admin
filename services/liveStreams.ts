import { HTTP_CLIENT as api } from '../utils/axiosClient';

/** A teacher's "go live" stream, as the admin list shows it. */
export interface TeacherStreamRow {
  _id: string;
  title: string;
  status: 'idle' | 'live' | 'ended';
  active: boolean;
  tutor: { _id: string; name: string; email: string | null } | null;
  viewerCount: number;
  provider: string | null;
  createdAt: string;
  startedAt: string | null;
  endedAt: string | null;
  endedBy: 'tutor' | 'admin' | 'system' | null;
}

/** Admin: live (`active`) and recent streams; `status` = live | ended | all. */
export const getTeacherStreams = async (status?: string): Promise<TeacherStreamRow[]> => {
  const q = status && status !== 'all' ? `?status=${encodeURIComponent(status)}` : '';
  const response = await api.get(`/api/v1/teacher-streams/admin${q}`);
  const list = response.data?.data ?? response.data;
  return Array.isArray(list) ? list : [];
};

/** Admin: end a teacher's stream. */
export const endTeacherStream = async (streamId: string) => {
  const response = await api.post(`/api/v1/teacher-streams/${streamId}/end`);
  return response.data;
};
