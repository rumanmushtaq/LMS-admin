import { useState, useEffect } from "react";
import adminService from "../../services/admin";

export interface DashboardStats {
  totalUsers?: number;
  totalStudents?: number;
  totalTutors?: number;
  totalAdmins?: number;
  activeUsers?: number;
  suspendedUsers?: number;
  verifiedUsers?: number;
  unverifiedUsers?: number;
  [key: string]: any;
}

export const useAdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.getDashboardStats();
      setStats(data);
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Failed to load dashboard stats.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, loading, error, refetch: fetchStats };
};
