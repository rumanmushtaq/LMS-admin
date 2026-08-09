import { Loading, Modal, Table, Text } from "@nextui-org/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Flex } from "../styles/flex";
import {
  securityService,
  type IpDetail,
} from "../../services/security";
import { localTime, Mono, Pill, timeAgo } from "./shared";

interface Props {
  ip: string | null;
  onClose: () => void;
}

const ACTION_LABEL: Record<string, { text: string; tone: any }> = {
  block: { text: "Manual block", tone: "red" },
  auto_block: { text: "Auto block", tone: "purple" },
  unblock: { text: "Unblocked", tone: "green" },
  whitelist_add: { text: "Whitelisted", tone: "blue" },
  whitelist_remove: { text: "Whitelist removed", tone: "gray" },
};

export const IpDetailModal = ({ ip, onClose }: Props) => {
  const [detail, setDetail] = useState<IpDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!ip) {
      setDetail(null);
      return;
    }
    let cancelled = false;
    setIsLoading(true);
    securityService
      .ipDetail(ip)
      .then((d) => {
        if (!cancelled) setDetail(d);
      })
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [ip]);

  return (
    <Modal closeButton open={!!ip} onClose={onClose} width="640px" blur>
      <Modal.Header>
        <Flex align="center" css={{ gap: "$4" }}>
          <Mono css={{ fontSize: "16px" }}>{ip}</Mono>
          {detail?.status === "blocked" ? <Pill tone="red">Blocked</Pill> : null}
          {detail?.whitelisted ? <Pill tone="blue">Whitelisted</Pill> : null}
        </Flex>
      </Modal.Header>
      <Modal.Body css={{ pb: "$10" }}>
        {isLoading || !detail ? (
          <Flex justify="center" css={{ py: "$10" }}>
            <Loading />
          </Flex>
        ) : (
          <>
            <Text size={14} b css={{ m: 0 }}>
              Accounts seen from this IP ({detail.users.length})
            </Text>
            {detail.users.length === 0 ? (
              <Text size={13} css={{ color: "$accents7", m: 0 }}>
                No successful logins from this IP in the window.
              </Text>
            ) : (
              <Flex direction="column" css={{ gap: "$2" }}>
                {detail.users.map((u) => (
                  <Flex key={u._id} align="center" css={{ gap: "$4" }}>
                    <Link
                      href={
                        u.role === "tutor"
                          ? `/teachers/${u._id}`
                          : `/students/${u._id}`
                      }
                    >
                      <Text
                        size={13}
                        css={{ m: 0, color: "$primary", cursor: "pointer" }}
                      >
                        {`${u.firstName} ${u.lastName}`.trim() || u.email}
                      </Text>
                    </Link>
                    <Text size={12} css={{ color: "$accents7", m: 0 }}>
                      {u.email} · {u.role}
                    </Text>
                    {u.status !== "active" ? (
                      <Pill tone="yellow">{u.status}</Pill>
                    ) : null}
                  </Flex>
                ))}
              </Flex>
            )}

            <Text size={14} b css={{ m: 0, mt: "$6" }}>
              Hourly activity (7 days)
            </Text>
            {detail.timeline.length === 0 ? (
              <Text size={13} css={{ color: "$accents7", m: 0 }}>
                No recorded activity.
              </Text>
            ) : (
              <Table
                compact
                aria-label="IP activity timeline"
                css={{ height: "auto", minWidth: "100%" }}
              >
                <Table.Header>
                  <Table.Column>HOUR</Table.Column>
                  <Table.Column>REQUESTS</Table.Column>
                  <Table.Column>FAILED LOGINS</Table.Column>
                  <Table.Column>BLOCKED</Table.Column>
                </Table.Header>
                <Table.Body>
                  {detail.timeline
                    .slice(-24)
                    .reverse()
                    .map((b) => (
                      <Table.Row key={b.hour}>
                        <Table.Cell>{localTime(b.hour)}</Table.Cell>
                        <Table.Cell>{b.requests.toLocaleString()}</Table.Cell>
                        <Table.Cell>
                          {b.failedLogins > 0 ? (
                            <Text
                              size={13}
                              css={{ color: "$error", m: 0 }}
                            >
                              {b.failedLogins}
                            </Text>
                          ) : (
                            0
                          )}
                        </Table.Cell>
                        <Table.Cell>{b.blocked}</Table.Cell>
                      </Table.Row>
                    ))}
                </Table.Body>
              </Table>
            )}

            <Text size={14} b css={{ m: 0, mt: "$6" }}>
              Block history
            </Text>
            {detail.blockHistory.length === 0 ? (
              <Text size={13} css={{ color: "$accents7", m: 0 }}>
                Never blocked.
              </Text>
            ) : (
              <Flex direction="column" css={{ gap: "$3" }}>
                {detail.blockHistory.map((entry) => {
                  const meta = ACTION_LABEL[entry.action] ?? {
                    text: entry.action,
                    tone: "gray",
                  };
                  return (
                    <Flex key={entry._id} align="center" css={{ gap: "$4" }}>
                      <Pill tone={meta.tone}>{meta.text}</Pill>
                      <Text size={13} css={{ m: 0, flex: 1 }}>
                        {entry.reason}
                      </Text>
                      <Text size={12} css={{ color: "$accents7", m: 0 }}>
                        {entry.actorName} · {timeAgo(entry.createdAt)}
                      </Text>
                    </Flex>
                  );
                })}
              </Flex>
            )}
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};
