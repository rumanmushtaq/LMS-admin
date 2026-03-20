import { useState, useEffect, useCallback } from "react";
import adminService, { UserQuery } from "../../services/admin";

export interface User {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  status: string;
  isEmailVerified: boolean;
  createdAt: string;
  [key: string]: any;
}

export interface UsersResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const useUsers = (initialQuery: UserQuery = {}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [meta, setMeta] = useState<Omit<UsersResponse, "users"> | null>(null);
  const [query, setQuery] = useState<UserQuery>({
    page: 1,
    limit: 10,
    ...initialQuery,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(
    async (q: UserQuery = query) => {
      setLoading(true);
      setError(null);
      try {
        const res = await adminService.getUsers(q);
        // Handle both paginated { users, total, page, ... } and plain array responses
        if (Array.isArray(res)) {
          setUsers(res);
        } else {
          setUsers(res.users ?? res.data ?? []);
          const { users: _u, data: _d, ...rest } = res;
          setMeta(rest);
        }
      } catch (err: any) {
        const message = err?.response?.data?.message || "Failed to load users.";
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [query],
  );

  useEffect(() => {
    fetchUsers(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Update filters / pagination and re-fetch */
  const updateQuery = (newQuery: Partial<UserQuery>) => {
    const updated = { ...query, ...newQuery };
    setQuery(updated);
    fetchUsers(updated);
  };

  /** Suspend a user by id */
  const suspendUser = async (id: string) => {
    setActionLoading(id);
    try {
      await adminService.suspendUser(id);
      await fetchUsers(query);
    } catch (err: any) {
      console.error("Suspend failed:", err);
    } finally {
      setActionLoading(null);
    }
  };

  /** Activate a user by id */
  const activateUser = async (id: string) => {
    setActionLoading(id);
    try {
      await adminService.activateUser(id);
      await fetchUsers(query);
    } catch (err: any) {
      console.error("Activate failed:", err);
    } finally {
      setActionLoading(null);
    }
  };

  /** Delete a user by id */
  const deleteUser = async (id: string) => {
    setActionLoading(id);
    try {
      await adminService.deleteUser(id);
      await fetchUsers(query);
    } catch (err: any) {
      console.error("Delete failed:", err);
    } finally {
      setActionLoading(null);
    }
  };

  /** Update user role */
  const updateUserRole = async (id: string, role: string) => {
    setActionLoading(id);
    try {
      await adminService.updateUserRole(id, role);
      await fetchUsers(query);
    } catch (err: any) {
      console.error("Update role failed:", err);
    } finally {
      setActionLoading(null);
    }
  };

  /** Update user status */
  const updateUserStatus = async (id: string, status: string) => {
    setActionLoading(id);
    try {
      await adminService.updateUserStatus(id, status);
      await fetchUsers(query);
    } catch (err: any) {
      console.error("Update status failed:", err);
    } finally {
      setActionLoading(null);
    }
  };

  return {
    users,
    meta,
    loading,
    actionLoading,
    error,
    query,
    updateQuery,
    refetch: () => fetchUsers(query),
    suspendUser,
    activateUser,
    deleteUser,
    updateUserRole,
    updateUserStatus,
  };
};
