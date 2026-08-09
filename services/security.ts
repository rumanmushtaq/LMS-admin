import { HTTP_CLIENT } from "../utils/axiosClient";
import apiEndpoints from "../utils/apiConfig";

export type RiskLevel = "low" | "medium" | "high";

export interface IpRisk {
  level: RiskLevel;
  reasons: string[];
}

export interface IpRow {
  ip: string;
  requests: number;
  failedLogins: number;
  blocked: number;
  accounts: number;
  userIds: string[];
  firstSeen: string;
  lastSeen: string;
  status: "active" | "blocked";
  blockId: string | null;
  whitelisted: boolean;
  risk: IpRisk;
}

export interface SecurityStats {
  uniqueIps: number;
  requests: number;
  failedLogins: number;
  blocked: number;
  activeBlocks: number;
  autoBlocks: number;
  /** false = shadow mode: blocks are recorded but nothing is refused yet. */
  enforced: boolean;
}

export interface TimeseriesPoint {
  hour: string;
  requests: number;
  failedLogins: number;
  blocked: number;
}

export interface BlockEntry {
  _id: string;
  key: string;
  sourceIp: string;
  type: "manual" | "auto";
  reason: string;
  blockedBy: string;
  expiresAt: string | null;
  createdAt: string;
}

export interface WhitelistEntry {
  _id: string;
  key: string;
  label: string;
  addedBy: string;
  createdAt: string;
}

export interface AuditEntry {
  _id: string;
  action:
    | "block"
    | "unblock"
    | "auto_block"
    | "whitelist_add"
    | "whitelist_remove";
  key: string;
  reason: string;
  actor: string;
  actorName: string;
  detail: Record<string, unknown> | null;
  createdAt: string;
}

export interface IpDetail {
  ip: string;
  timeline: Array<{
    hour: string;
    requests: number;
    failedLogins: number;
    blocked: number;
    userIds: string[];
    lastSeen: string;
  }>;
  users: Array<{
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    status: string;
  }>;
  blockHistory: AuditEntry[];
  status: "active" | "blocked";
  blockId: string | null;
  whitelisted: boolean;
}

export type BlockDuration = "1h" | "24h" | "7d" | "permanent";

const unwrap = (data: any) => data?.data ?? data;

export const securityService = {
  async whoami(): Promise<{ ip: string | null; blockKey: string | null }> {
    const { data } = await HTTP_CLIENT.get(apiEndpoints.Security.WHOAMI);
    return unwrap(data);
  },

  async stats(hours = 24): Promise<SecurityStats> {
    const { data } = await HTTP_CLIENT.get(apiEndpoints.Security.STATS, {
      params: { hours },
    });
    return unwrap(data);
  },

  async timeseries(hours = 168): Promise<TimeseriesPoint[]> {
    const { data } = await HTTP_CLIENT.get(apiEndpoints.Security.TIMESERIES, {
      params: { hours },
    });
    return unwrap(data);
  },

  async listIps(params: {
    page?: number;
    limit?: number;
    search?: string;
    hours?: number;
    sort?: "lastSeen" | "requests" | "failedLogins";
  }): Promise<{ items: IpRow[]; total: number; page: number; limit: number }> {
    const { data } = await HTTP_CLIENT.get(apiEndpoints.Security.IPS, {
      params,
    });
    return unwrap(data);
  },

  async ipDetail(ip: string): Promise<IpDetail> {
    const { data } = await HTTP_CLIENT.get(apiEndpoints.Security.IP_DETAIL(ip));
    return unwrap(data);
  },

  async listBlocks(): Promise<BlockEntry[]> {
    const { data } = await HTTP_CLIENT.get(apiEndpoints.Security.BLOCKS);
    return unwrap(data);
  },

  async block(payload: {
    ip: string;
    reason: string;
    duration: BlockDuration;
  }): Promise<BlockEntry> {
    const { data } = await HTTP_CLIENT.post(
      apiEndpoints.Security.BLOCKS,
      payload,
    );
    return unwrap(data);
  },

  async unblock(key: string, reason?: string): Promise<void> {
    await HTTP_CLIENT.delete(apiEndpoints.Security.UNBLOCK(key), {
      data: { reason },
    });
  },

  async listWhitelist(): Promise<WhitelistEntry[]> {
    const { data } = await HTTP_CLIENT.get(apiEndpoints.Security.WHITELIST);
    return unwrap(data);
  },

  async addWhitelist(payload: {
    ip: string;
    label: string;
  }): Promise<WhitelistEntry> {
    const { data } = await HTTP_CLIENT.post(
      apiEndpoints.Security.WHITELIST,
      payload,
    );
    return unwrap(data);
  },

  async removeWhitelist(key: string): Promise<void> {
    await HTTP_CLIENT.delete(apiEndpoints.Security.WHITELIST_REMOVE(key));
  },

  async audit(params: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<{
    items: AuditEntry[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { data } = await HTTP_CLIENT.get(apiEndpoints.Security.AUDIT, {
      params,
    });
    return unwrap(data);
  },
};
