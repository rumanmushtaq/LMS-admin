import apiEndpoints from "../utils/apiConfig";
import { HTTP_CLIENT } from "../utils/axiosClient";

export interface UserQuery {
  role?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface StudentQuery {
  search?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  emailVerified?: boolean;
}

class AdminService {
  /**
   * GET /api/v1/admin/dashboard/stats
   */
  async getDashboardStats(): Promise<any> {
    const { data } = await HTTP_CLIENT.get(apiEndpoints.Admin.DASHBOARD_STATS);
    return data;
  }

  /**
   * GET /api/v1/admin/users
   * Supports pagination and filters via query params
   */
  async getUsers(query: UserQuery = {}): Promise<any> {
    const params = new URLSearchParams();
    if (query.role) params.append("role", query.role);
    if (query.status) params.append("status", query.status);
    if (query.search) params.append("search", query.search);
    if (query.page) params.append("page", String(query.page));
    if (query.limit) params.append("limit", String(query.limit));
    if (query.sortBy) params.append("sortBy", query.sortBy);
    if (query.sortOrder) params.append("sortOrder", query.sortOrder);

    const { data } = await HTTP_CLIENT.get(
      `${apiEndpoints.Admin.USERS}?${params.toString()}`,
    );
    return data;
  }

  /**
   * GET /api/v1/admin/users/:id
   */
  async getUserById(id: string): Promise<any> {
    const { data } = await HTTP_CLIENT.get(apiEndpoints.Admin.USER_BY_ID(id));
    return data;
  }

  /**
   * PATCH /api/v1/admin/users/:id/status
   */
  async updateUserStatus(id: string, status: string): Promise<any> {
    const { data } = await HTTP_CLIENT.patch(
      apiEndpoints.Admin.UPDATE_USER_STATUS(id),
      { status },
    );
    return data;
  }

  /**
   * PATCH /api/v1/admin/users/:id/role
   */
  async updateUserRole(id: string, role: string): Promise<any> {
    const { data } = await HTTP_CLIENT.patch(
      apiEndpoints.Admin.UPDATE_USER_ROLE(id),
      { role },
    );
    return data;
  }

  /**
   * POST /api/v1/admin/users/:id/suspend
   */
  async suspendUser(id: string): Promise<any> {
    const { data } = await HTTP_CLIENT.post(
      apiEndpoints.Admin.SUSPEND_USER(id),
    );
    return data;
  }

  /**
   * POST /api/v1/admin/users/:id/activate
   */
  async activateUser(id: string): Promise<any> {
    const { data } = await HTTP_CLIENT.post(
      apiEndpoints.Admin.ACTIVATE_USER(id),
    );
    return data;
  }

  /**
   * DELETE /api/v1/admin/users/:id
   */
  async deleteUser(id: string): Promise<any> {
    const { data } = await HTTP_CLIENT.delete(
      apiEndpoints.Admin.DELETE_USER(id),
    );
    return data;
  }

  /**
   * PATCH /api/v1/admin/users/:id
   */
  async updateUser(id: string, updateData: Record<string, any>): Promise<any> {
    const { data } = await HTTP_CLIENT.patch(
      apiEndpoints.Admin.UPDATE_USER(id),
      updateData,
    );
    return data;
  }

  /**
   * POST /api/v1/admin/users/admin
   */
  async createAdmin(adminData: {
    fullName: string;
    email: string;
    password: string;
  }): Promise<any> {
    const { data } = await HTTP_CLIENT.post(
      apiEndpoints.Admin.CREATE_ADMIN,
      adminData,
    );
    return data;
  }

  // =====================
  // STUDENT MANAGEMENT
  // =====================

  /**
   * GET /api/v1/admin/students
   */
  async getStudents(query: StudentQuery = {}): Promise<any> {
    const params = new URLSearchParams();
    if (query.search) params.append("search", query.search);
    if (query.status) params.append("status", query.status);
    if (query.startDate) params.append("startDate", query.startDate);
    if (query.endDate) params.append("endDate", query.endDate);
    if (query.page) params.append("page", String(query.page));
    if (query.limit) params.append("limit", String(query.limit));
    if (query.sortBy) params.append("sortBy", query.sortBy);
    if (query.sortOrder) params.append("sortOrder", query.sortOrder);
    if (query.emailVerified !== undefined)
      params.append("emailVerified", String(query.emailVerified));

    const { data } = await HTTP_CLIENT.get(
      `${apiEndpoints.Students.STUDENTS}?${params.toString()}`,
    );
    return data;
  }

  /**
   * GET /api/v1/admin/students/:id
   */
  async getStudentById(id: string): Promise<any> {
    const { data } = await HTTP_CLIENT.get(
      apiEndpoints.Students.STUDENT_BY_ID(id),
    );
    return data;
  }

  /**
   * PATCH /api/v1/admin/students/:id
   */
  async updateStudent(
    id: string,
    updateData: Record<string, any>,
  ): Promise<any> {
    const { data } = await HTTP_CLIENT.patch(
      apiEndpoints.Students.UPDATE_STUDENT(id),
      updateData,
    );
    return data;
  }

  /**
   * PATCH /api/v1/admin/students/:id/status
   */
  async updateStudentStatus(id: string, status: string): Promise<any> {
    const { data } = await HTTP_CLIENT.patch(
      apiEndpoints.Students.UPDATE_STUDENT_STATUS(id),
      { status },
    );
    return data;
  }

  /**
   * POST /api/v1/admin/students/:id/suspend
   */
  async suspendStudent(id: string): Promise<any> {
    const { data } = await HTTP_CLIENT.post(
      apiEndpoints.Students.SUSPEND_STUDENT(id),
    );
    return data;
  }

  /**
   * POST /api/v1/admin/students/:id/activate
   */
  async activateStudent(id: string): Promise<any> {
    const { data } = await HTTP_CLIENT.post(
      apiEndpoints.Students.ACTIVATE_STUDENT(id),
    );
    return data;
  }

  /**
   * DELETE /api/v1/admin/students/:id
   */
  async deleteStudent(id: string): Promise<any> {
    const { data } = await HTTP_CLIENT.delete(
      apiEndpoints.Students.DELETE_STUDENT(id),
    );
    return data;
  }

  // =====================
  // HERO BANNER MGMT
  // =====================

  /**
   * GET /api/v1/admin/hero-banner
   */
  async getHeroBanners(): Promise<any> {
    const { data } = await HTTP_CLIENT.get(apiEndpoints.Admin.HERO_BANNER);
    return data;
  }

  /**
   * POST /api/v1/admin/hero-banner
   */
  async createHeroBanner(bannerData: any): Promise<any> {
    const { data } = await HTTP_CLIENT.post(
      apiEndpoints.Admin.HERO_BANNER,
      bannerData,
    );
    return data;
  }

  /**
   * PATCH /api/v1/admin/hero-banner/:id
   */
  async updateHeroBanner(id: string, bannerData: any): Promise<any> {
    const { data } = await HTTP_CLIENT.patch(
      apiEndpoints.Admin.HERO_BANNER_BY_ID(id),
      bannerData,
    );
    return data;
  }

  /**
   * DELETE /api/v1/admin/hero-banner/:id
   */
  async deleteHeroBanner(id: string): Promise<any> {
    const { data } = await HTTP_CLIENT.delete(
      apiEndpoints.Admin.HERO_BANNER_BY_ID(id),
    );
    return data;
  }

  /**
   * POST /api/v1/admin/upload/image
   */
  async uploadHeroBannerImage(file: File): Promise<any> {
    const formData = new FormData();
    formData.append("image", file);
    const { data } = await HTTP_CLIENT.post(
      apiEndpoints.Admin.UPLOAD_IMAGE,
      formData,
    );
    return data;
  }
}

export default new AdminService();
