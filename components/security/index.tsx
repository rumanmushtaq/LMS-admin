import {
  Button,
  Input,
  Loading,
  Modal,
  Pagination,
  Table,
  Text,
  Tooltip,
} from "@nextui-org/react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Box } from "../styles/box";
import { Flex } from "../styles/flex";
import { SecurityIcon } from "../icons/sidebar/security-icon";
import {
  securityService,
  type AuditEntry,
  type BlockEntry,
  type IpRow,
  type SecurityStats,
  type TimeseriesPoint,
  type WhitelistEntry,
} from "../../services/security";
import { StatCards } from "./StatCards";
import { TrafficChart } from "./TrafficChart";
import { BlockIpModal } from "./BlockIpModal";
import { IpDetailModal } from "./IpDetailModal";
import { WhitelistModal } from "./WhitelistModal";
import { expiresIn, localTime, Mono, Pill, RiskBadge, timeAgo } from "./shared";

type Tab = "ips" | "blocked" | "whitelist" | "audit";

const PAGE_SIZE = 10;
const REFRESH_MS = 30_000;

const ACTION_LABEL: Record<
  AuditEntry["action"],
  { text: string; tone: "red" | "purple" | "green" | "blue" | "gray" }
> = {
  block: { text: "Manual block", tone: "red" },
  auto_block: { text: "Auto block", tone: "purple" },
  unblock: { text: "Unblocked", tone: "green" },
  whitelist_add: { text: "Whitelisted", tone: "blue" },
  whitelist_remove: { text: "Whitelist removed", tone: "gray" },
};

const SecurityView = () => {
  const [tab, setTab] = useState<Tab>("ips");
  const [stats, setStats] = useState<SecurityStats | null>(null);
  const [points, setPoints] = useState<TimeseriesPoint[]>([]);
  const [myIp, setMyIp] = useState<string | null>(null);

  // All IPs tab
  const [ips, setIps] = useState<IpRow[]>([]);
  const [ipsTotal, setIpsTotal] = useState(0);
  const [ipsPage, setIpsPage] = useState(1);
  const [search, setSearch] = useState("");
  const [ipsLoading, setIpsLoading] = useState(true);

  // Other tabs
  const [blocks, setBlocks] = useState<BlockEntry[]>([]);
  const [whitelist, setWhitelist] = useState<WhitelistEntry[]>([]);
  const [audit, setAudit] = useState<AuditEntry[]>([]);
  const [auditTotal, setAuditTotal] = useState(0);
  const [auditPage, setAuditPage] = useState(1);
  const [auditSearch, setAuditSearch] = useState("");
  const [tabLoading, setTabLoading] = useState(false);

  // Modals
  const [blockTarget, setBlockTarget] = useState<IpRow | null>(null);
  const [isBlockOpen, setIsBlockOpen] = useState(false);
  const [detailIp, setDetailIp] = useState<string | null>(null);
  const [isWhitelistOpen, setIsWhitelistOpen] = useState(false);
  const [whitelistPrefill, setWhitelistPrefill] = useState<string | null>(null);
  const [unblockTarget, setUnblockTarget] = useState<BlockEntry | null>(null);
  const [unblockReason, setUnblockReason] = useState("");

  const [banner, setBanner] = useState<string | null>(null);
  const bannerTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showBanner = useCallback((message: string) => {
    setBanner(message);
    if (bannerTimer.current) clearTimeout(bannerTimer.current);
    bannerTimer.current = setTimeout(() => setBanner(null), 4000);
  }, []);

  const loadHeadline = useCallback(async () => {
    try {
      const [s, ts] = await Promise.all([
        securityService.stats(24),
        securityService.timeseries(168),
      ]);
      setStats(s);
      setPoints(ts);
    } catch {
      /* headline refresh failing silently is fine; tables surface errors */
    }
  }, []);

  const loadIps = useCallback(async () => {
    try {
      setIpsLoading(true);
      const result = await securityService.listIps({
        page: ipsPage,
        limit: PAGE_SIZE,
        search: search.trim() || undefined,
        hours: 24,
        sort: "lastSeen",
      });
      setIps(result.items);
      setIpsTotal(result.total);
    } catch {
      /* keep last data */
    } finally {
      setIpsLoading(false);
    }
  }, [ipsPage, search]);

  const loadTab = useCallback(async () => {
    try {
      setTabLoading(true);
      if (tab === "blocked") setBlocks(await securityService.listBlocks());
      if (tab === "whitelist")
        setWhitelist(await securityService.listWhitelist());
      if (tab === "audit") {
        const result = await securityService.audit({
          page: auditPage,
          limit: 50,
          search: auditSearch.trim() || undefined,
        });
        setAudit(result.items);
        setAuditTotal(result.total);
      }
    } catch {
      /* keep last data */
    } finally {
      setTabLoading(false);
    }
  }, [tab, auditPage, auditSearch]);

  useEffect(() => {
    loadHeadline();
    securityService
      .whoami()
      .then((w) => setMyIp(w.ip))
      .catch(() => undefined);
    const interval = setInterval(loadHeadline, REFRESH_MS);
    return () => clearInterval(interval);
  }, [loadHeadline]);

  useEffect(() => {
    const t = setTimeout(loadIps, search ? 350 : 0); // debounce typing
    return () => clearTimeout(t);
  }, [loadIps, search]);

  useEffect(() => {
    if (tab !== "ips") loadTab();
  }, [tab, loadTab]);

  const refreshEverything = () => {
    loadHeadline();
    loadIps();
    if (tab !== "ips") loadTab();
  };

  const handleUnblock = async () => {
    if (!unblockTarget) return;
    try {
      await securityService.unblock(
        unblockTarget.key,
        unblockReason.trim() || undefined,
      );
      showBanner(`${unblockTarget.key} unblocked`);
      setUnblockTarget(null);
      setUnblockReason("");
      refreshEverything();
    } catch {
      showBanner("Failed to unblock — try again");
    }
  };

  const tabs: Array<{ id: Tab; label: string }> = [
    { id: "ips", label: "All IPs" },
    {
      id: "blocked",
      label: stats ? `Blocked (${stats.activeBlocks})` : "Blocked",
    },
    { id: "whitelist", label: "Whitelist" },
    { id: "audit", label: "Audit log" },
  ];

  return (
    <Flex
      css={{ mt: "$5", px: "$6", "@sm": { mt: "$10", px: "$16" } }}
      direction="column"
    >
      <Flex justify="between" align="center" wrap="wrap" css={{ mb: "$8", gap: "$6" }}>
        <Flex align="center" css={{ gap: "$5" }}>
          <SecurityIcon />
          <Box as="h3" css={{ m: 0 }}>
            Security · IP Management
          </Box>
        </Flex>
        <Flex css={{ gap: "$4" }}>
          {myIp ? (
            <Tooltip content={`Your IP: ${myIp}`} rounded>
              <Button
                auto
                flat
                size="sm"
                onClick={() => {
                  setWhitelistPrefill(myIp);
                  setIsWhitelistOpen(true);
                }}
              >
                Whitelist my IP
              </Button>
            </Tooltip>
          ) : null}
          <Button
            auto
            size="sm"
            color="error"
            onClick={() => {
              setBlockTarget(null);
              setIsBlockOpen(true);
            }}
          >
            Block an IP
          </Button>
        </Flex>
      </Flex>

      {banner ? (
        <Box
          css={{
            background: "rgba(23, 201, 100, 0.12)",
            border: "1px solid rgba(23, 201, 100, 0.4)",
            borderRadius: "$md",
            p: "$5",
            mb: "$6",
          }}
        >
          <Text size={14} css={{ m: 0 }}>
            {banner}
          </Text>
        </Box>
      ) : null}

      <StatCards stats={stats} />
      <TrafficChart points={points} />

      <Flex css={{ gap: "$2", mb: "$6", borderBottom: "1px solid var(--nextui-colors-border)" }}>
        {tabs.map((t) => (
          <Box
            key={t.id}
            as="button"
            onClick={() => setTab(t.id)}
            css={{
              background: "none",
              border: "none",
              borderBottom:
                tab === t.id
                  ? "2px solid var(--nextui-colors-primary)"
                  : "2px solid transparent",
              color:
                tab === t.id
                  ? "var(--nextui-colors-text)"
                  : "var(--nextui-colors-accents7)",
              padding: "8px 14px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            {t.label}
          </Box>
        ))}
      </Flex>

      {/* ─── All IPs ─────────────────────────────────────────────────────── */}
      {tab === "ips" && (
        <>
          <Flex css={{ mb: "$6", gap: "$4" }} align="center">
            <Input
              clearable
              bordered
              size="sm"
              placeholder="Search IP…"
              value={search}
              onChange={(e) => {
                setIpsPage(1);
                setSearch(e.target.value);
              }}
              css={{ maxWidth: "260px" }}
              aria-label="Search IP"
            />
            <Text size={13} css={{ color: "$accents7", m: 0 }}>
              {ipsTotal === 0
                ? "0 IPs · last 24h"
                : `Showing ${(
                    (ipsPage - 1) * PAGE_SIZE +
                    1
                  ).toLocaleString()}–${Math.min(
                    ipsPage * PAGE_SIZE,
                    ipsTotal,
                  ).toLocaleString()} of ${ipsTotal.toLocaleString()} IPs · last 24h`}
            </Text>
          </Flex>

          {ipsLoading && ips.length === 0 ? (
            <Flex justify="center" css={{ py: "$12" }}>
              <Loading />
            </Flex>
          ) : ips.length === 0 ? (
            <Text css={{ color: "$accents7", py: "$10", textAlign: "center" }}>
              No traffic recorded yet. Activity appears here as requests reach
              the API.
            </Text>
          ) : (
            <Table
              compact
              aria-label="IP list"
              css={{ height: "auto", minWidth: "100%" }}
            >
              <Table.Header>
                <Table.Column>IP ADDRESS</Table.Column>
                <Table.Column>RISK</Table.Column>
                <Table.Column>REQUESTS</Table.Column>
                <Table.Column>FAILED LOGINS</Table.Column>
                <Table.Column>ACCOUNTS</Table.Column>
                <Table.Column>LAST SEEN</Table.Column>
                <Table.Column>STATUS</Table.Column>
                <Table.Column hideHeader>ACTIONS</Table.Column>
              </Table.Header>
              <Table.Body>
                {ips.map((row) => (
                  <Table.Row key={row.ip}>
                    <Table.Cell>
                      <Flex align="center" css={{ gap: "$3" }}>
                        <Mono>{row.ip}</Mono>
                        {myIp === row.ip ? (
                          <Tooltip content="This is your current IP" rounded>
                            <Pill tone="blue">you</Pill>
                          </Tooltip>
                        ) : null}
                        {row.whitelisted ? (
                          <Pill tone="blue">whitelisted</Pill>
                        ) : null}
                      </Flex>
                    </Table.Cell>
                    <Table.Cell>
                      <RiskBadge risk={row.risk} />
                    </Table.Cell>
                    <Table.Cell>{row.requests.toLocaleString()}</Table.Cell>
                    <Table.Cell>
                      {row.failedLogins > 0 ? (
                        <Text size={14} css={{ color: "$error", m: 0 }}>
                          {row.failedLogins}
                        </Text>
                      ) : (
                        "0"
                      )}
                    </Table.Cell>
                    <Table.Cell>{row.accounts}</Table.Cell>
                    <Table.Cell>
                      <Tooltip content={localTime(row.lastSeen)} rounded>
                        <Text size={14} css={{ m: 0, cursor: "help" }}>
                          {timeAgo(row.lastSeen)}
                        </Text>
                      </Tooltip>
                    </Table.Cell>
                    <Table.Cell>
                      {row.status === "blocked" ? (
                        <Pill tone="red">Blocked</Pill>
                      ) : (
                        <Pill tone="green">Active</Pill>
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      <Flex css={{ gap: "$3" }}>
                        <Button
                          auto
                          light
                          size="xs"
                          onClick={() => setDetailIp(row.ip)}
                        >
                          View
                        </Button>
                        {row.status !== "blocked" && !row.whitelisted ? (
                          <Button
                            auto
                            flat
                            color="error"
                            size="xs"
                            onClick={() => {
                              setBlockTarget(row);
                              setIsBlockOpen(true);
                            }}
                          >
                            Block
                          </Button>
                        ) : null}
                      </Flex>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          )}

          {ipsTotal > PAGE_SIZE ? (
            <Flex justify="center" css={{ mt: "$8" }}>
              <Pagination
                total={Math.ceil(ipsTotal / PAGE_SIZE)}
                page={ipsPage}
                onChange={setIpsPage}
              />
            </Flex>
          ) : null}
        </>
      )}

      {/* ─── Blocked ─────────────────────────────────────────────────────── */}
      {tab === "blocked" &&
        (tabLoading ? (
          <Flex justify="center" css={{ py: "$12" }}>
            <Loading />
          </Flex>
        ) : blocks.length === 0 ? (
          <Text css={{ color: "$accents7", py: "$10", textAlign: "center" }}>
            No active blocks.
          </Text>
        ) : (
          <Table
            compact
            aria-label="Blocked IPs"
            css={{ height: "auto", minWidth: "100%" }}
          >
            <Table.Header>
              <Table.Column>KEY</Table.Column>
              <Table.Column>TYPE</Table.Column>
              <Table.Column>REASON</Table.Column>
              <Table.Column>EXPIRES</Table.Column>
              <Table.Column>CREATED</Table.Column>
              <Table.Column hideHeader>ACTIONS</Table.Column>
            </Table.Header>
            <Table.Body>
              {blocks.map((b) => (
                <Table.Row key={b._id}>
                  <Table.Cell>
                    <Mono>{b.key}</Mono>
                  </Table.Cell>
                  <Table.Cell>
                    {b.type === "auto" ? (
                      <Pill tone="purple">Auto</Pill>
                    ) : (
                      <Pill tone="red">Manual</Pill>
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <Text size={13} css={{ m: 0, maxWidth: "320px" }}>
                      {b.reason}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>{expiresIn(b.expiresAt)}</Table.Cell>
                  <Table.Cell>
                    <Tooltip content={localTime(b.createdAt)} rounded>
                      <Text size={14} css={{ m: 0, cursor: "help" }}>
                        {timeAgo(b.createdAt)}
                      </Text>
                    </Tooltip>
                  </Table.Cell>
                  <Table.Cell>
                    <Button
                      auto
                      flat
                      size="xs"
                      onClick={() => setUnblockTarget(b)}
                    >
                      Unblock
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        ))}

      {/* ─── Whitelist ───────────────────────────────────────────────────── */}
      {tab === "whitelist" && (
        <>
          <Flex justify="between" align="center" css={{ mb: "$6" }}>
            <Text size={13} css={{ color: "$accents8", m: 0 }}>
              Whitelisted addresses are never blocked, automatically or
              manually.
            </Text>
            <Button
              auto
              size="sm"
              onClick={() => {
                setWhitelistPrefill(null);
                setIsWhitelistOpen(true);
              }}
            >
              Add entry
            </Button>
          </Flex>
          {tabLoading ? (
            <Flex justify="center" css={{ py: "$12" }}>
              <Loading />
            </Flex>
          ) : whitelist.length === 0 ? (
            <Text css={{ color: "$accents7", py: "$10", textAlign: "center" }}>
              Empty. Add your own IP and your office network before enabling
              enforcement — this is the lock-out insurance.
            </Text>
          ) : (
            <Table
              compact
              aria-label="Whitelist"
              css={{ height: "auto", minWidth: "100%" }}
            >
              <Table.Header>
                <Table.Column>ADDRESS</Table.Column>
                <Table.Column>LABEL</Table.Column>
                <Table.Column>ADDED</Table.Column>
                <Table.Column hideHeader>ACTIONS</Table.Column>
              </Table.Header>
              <Table.Body>
                {whitelist.map((entry) => (
                  <Table.Row key={entry._id}>
                    <Table.Cell>
                      <Mono>{entry.key}</Mono>
                    </Table.Cell>
                    <Table.Cell>{entry.label}</Table.Cell>
                    <Table.Cell>{timeAgo(entry.createdAt)}</Table.Cell>
                    <Table.Cell>
                      <Button
                        auto
                        light
                        color="error"
                        size="xs"
                        onClick={async () => {
                          try {
                            await securityService.removeWhitelist(entry.key);
                            showBanner(`${entry.key} removed from whitelist`);
                            refreshEverything();
                          } catch {
                            showBanner("Failed to remove entry");
                          }
                        }}
                      >
                        Remove
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          )}
        </>
      )}

      {/* ─── Audit log ───────────────────────────────────────────────────── */}
      {tab === "audit" && (
        <>
          <Flex css={{ mb: "$6" }}>
            <Input
              clearable
              bordered
              size="sm"
              placeholder="Search by IP/key or incident id…"
              value={auditSearch}
              onChange={(e) => {
                setAuditPage(1);
                setAuditSearch(e.target.value);
              }}
              css={{ maxWidth: "320px" }}
              aria-label="Search audit log"
            />
          </Flex>
          {tabLoading ? (
            <Flex justify="center" css={{ py: "$12" }}>
              <Loading />
            </Flex>
          ) : audit.length === 0 ? (
            <Text css={{ color: "$accents7", py: "$10", textAlign: "center" }}>
              No security actions recorded yet.
            </Text>
          ) : (
            <Flex direction="column" css={{ gap: "$4" }}>
              {audit.map((entry) => {
                const meta = ACTION_LABEL[entry.action];
                return (
                  <Flex
                    key={entry._id}
                    align="center"
                    css={{
                      gap: "$5",
                      p: "$5",
                      borderRadius: "$md",
                      border: "1px solid var(--nextui-colors-border)",
                    }}
                  >
                    <Pill tone={meta.tone}>{meta.text}</Pill>
                    <Mono>{entry.key}</Mono>
                    <Text size={13} css={{ m: 0, flex: 1 }}>
                      {entry.reason}
                    </Text>
                    <Text size={12} css={{ color: "$accents7", m: 0 }}>
                      {entry.actorName}
                    </Text>
                    <Tooltip content={localTime(entry.createdAt)} rounded>
                      <Text
                        size={12}
                        css={{ color: "$accents7", m: 0, cursor: "help" }}
                      >
                        {timeAgo(entry.createdAt)}
                      </Text>
                    </Tooltip>
                  </Flex>
                );
              })}
              {auditTotal > 50 ? (
                <Flex justify="center" css={{ mt: "$4" }}>
                  <Pagination
                    total={Math.ceil(auditTotal / 50)}
                    page={auditPage}
                    onChange={setAuditPage}
                  />
                </Flex>
              ) : null}
            </Flex>
          )}
        </>
      )}

      {/* ─── Modals ──────────────────────────────────────────────────────── */}
      <BlockIpModal
        isOpen={isBlockOpen}
        onClose={() => setIsBlockOpen(false)}
        onSuccess={(m) => {
          showBanner(m);
          refreshEverything();
        }}
        target={blockTarget}
        myIp={myIp}
      />
      <IpDetailModal ip={detailIp} onClose={() => setDetailIp(null)} />
      <WhitelistModal
        isOpen={isWhitelistOpen}
        onClose={() => setIsWhitelistOpen(false)}
        onSuccess={(m) => {
          showBanner(m);
          refreshEverything();
        }}
        prefillIp={whitelistPrefill}
      />

      {/* Unblocking stays one confirm away — friction belongs on the
          destructive side only. */}
      <Modal
        closeButton
        open={!!unblockTarget}
        onClose={() => setUnblockTarget(null)}
        width="420px"
      >
        <Modal.Header>
          <Text h4 css={{ m: 0 }}>
            Unblock {unblockTarget?.key}
          </Text>
        </Modal.Header>
        <Modal.Body>
          <Text size={13} css={{ color: "$accents8", m: 0 }}>
            Blocked {unblockTarget ? timeAgo(unblockTarget.createdAt) : ""} —{" "}
            {unblockTarget?.reason}
          </Text>
          <Input
            bordered
            label="Reason (optional, kept in the audit log)"
            placeholder="e.g. False positive — school NAT"
            value={unblockReason}
            onChange={(e) => setUnblockReason(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button auto flat onClick={() => setUnblockTarget(null)}>
            Cancel
          </Button>
          <Button auto onClick={handleUnblock}>
            Unblock
          </Button>
        </Modal.Footer>
      </Modal>
    </Flex>
  );
};

export default SecurityView;
