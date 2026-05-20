import { HTTP_CLIENT } from "../utils/axiosClient";
import apiEndpoints from "../utils/apiConfig";

export const categoriesService = {
  async getAll() {
    const { data } = await HTTP_CLIENT.get(apiEndpoints.Categories.GET_ALL);
    return data?.data ?? data;
  },

  async getById(id: string) {
    const { data } = await HTTP_CLIENT.get(
      apiEndpoints.Categories.GET_BY_ID(id),
    );
    return data?.data ?? data;
  },

  async create(formData: FormData) {
    const { data } = await HTTP_CLIENT.post(
      apiEndpoints.Categories.CREATE,
      formData,
    );
    return data?.data ?? data;
  },

  async update(id: string, formData: FormData) {
    const { data } = await HTTP_CLIENT.patch(
      apiEndpoints.Categories.UPDATE(id),
      formData,
    );
    return data?.data ?? data;
  },

  async delete(id: string) {
    const { data } = await HTTP_CLIENT.delete(
      apiEndpoints.Categories.DELETE(id),
    );
    return data;
  },
};
