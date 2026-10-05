import apiEndpoints from "../utils/apiConfig";
import { HTTP_CLIENT } from "../utils/axiosClient";

export interface TransactionQuery {
  status?: string;
  area?: string;
  provider?: string;
  q?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

function toParams(query: TransactionQuery): string {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") params.append(k, String(v));
  });
  return params.toString();
}

/** The API wraps payloads in { success, data }; return the inner data. */
const unwrap = (data: any) => data?.data ?? data;

class PaymentsService {
  /** GET /api/v1/payments/transactions */
  async listTransactions(query: TransactionQuery = {}): Promise<any> {
    const { data } = await HTTP_CLIENT.get(
      `${apiEndpoints.Payments.TRANSACTIONS}?${toParams(query)}`,
    );
    return unwrap(data);
  }

  /** GET /api/v1/payments/transactions/summary */
  async getSummary(query: TransactionQuery = {}): Promise<any> {
    const { data } = await HTTP_CLIENT.get(
      `${apiEndpoints.Payments.TRANSACTIONS_SUMMARY}?${toParams(query)}`,
    );
    return unwrap(data);
  }

  /** GET /api/v1/payments/transactions/:id */
  async getTransaction(id: string): Promise<any> {
    const { data } = await HTTP_CLIENT.get(
      apiEndpoints.Payments.TRANSACTION_BY_ID(id),
    );
    return unwrap(data);
  }

  /** POST /api/v1/payments/transactions/:id/refund */
  async refund(
    id: string,
    body: { reason?: string; amountMinor?: number } = {},
  ): Promise<any> {
    const { data } = await HTTP_CLIENT.post(
      apiEndpoints.Payments.REFUND(id),
      body,
    );
    return unwrap(data);
  }

  /** POST /api/v1/payments/transactions/:id/reconcile */
  async reconcile(id: string): Promise<any> {
    const { data } = await HTTP_CLIENT.post(
      apiEndpoints.Payments.RECONCILE(id),
    );
    return unwrap(data);
  }
}

export default new PaymentsService();
