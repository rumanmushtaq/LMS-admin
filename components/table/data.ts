export const columns = [
   { name: 'NAME', uid: 'name' },
   { name: 'ROLE', uid: 'role' },
   { name: 'STATUS', uid: 'status' },
   { name: 'ACTIONS', uid: 'actions' },
];

/** A user row as the dashboard/accounts table renders it, mapped from the API. */
export interface RowUser {
   id: string;
   name: string;
   email: string;
   role: string; // 'tutor' | 'student' | 'admin'
   status: string; // 'active' | 'pending' | 'suspended'
   createdAt?: string;
}
