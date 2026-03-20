import apiEndpoints from "../utils/apiConfig";
import { HTTP_CLIENT } from "../utils/axiosClient";

interface LoginParams {
  email: string;
  password: string;
}

class AuthService {
  /**
   * POST /api/v1/auth/admin/login
   * Returns { user, accessToken, refreshToken }
   */
  async loginApi(params: LoginParams): Promise<any> {
    const payload = {
      email: params.email,
      password: params.password,
    };
    const res = await HTTP_CLIENT.post(apiEndpoints.Auth.LOGIN, payload);
    return res.data;
  }

  /**
   * POST /api/v1/auth/logout
   */
  async logoutApi(): Promise<any> {
    const res = await HTTP_CLIENT.post(apiEndpoints.Auth.LOGOUT);
    return res.data;
  }

  /**
   * GET /api/v1/auth/me
   */
  async getMeApi(): Promise<any> {
    const res = await HTTP_CLIENT.get(apiEndpoints.Auth.ME);
    return res.data;
  }
}

export default new AuthService();
