import { Button, Input, Modal, Text, Textarea } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { Flex } from "../styles/flex";
import {
  securityService,
  type BlockDuration,
  type IpRow,
} from "../../services/security";
import { Pill } from "./shared";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  /** Prefilled when opened from a table row; editable when opened standalone. */
  target?: IpRow | null;
  /** The admin's own IP, for the self-block confirmation. */
  myIp: string | null;
}

const DURATIONS: Array<{ value: BlockDuration; label: string }> = [
  { value: "1h", label: "1 hour" },
  { value: "24h", label: "24 hours" },
  { value: "7d", label: "7 days" },
  { value: "permanent", label: "Permanent" },
];

export const BlockIpModal = ({
  isOpen,
  onClose,
  onSuccess,
  target,
  myIp,
}: Props) => {
  const [ip, setIp] = useState("");
  const [reason, setReason] = useState("");
  // Reversible by default: never permanent unless deliberately chosen.
  const [duration, setDuration] = useState<BlockDuration>("24h");
  const [confirmSelf, setConfirmSelf] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIp(target?.ip ?? "");
      setReason("");
      setDuration("24h");
      setConfirmSelf("");
      setError(null);
    }
  }, [isOpen, target]);

  const isSelf = !!myIp && ip.trim() === myIp;
  const selfConfirmed = !isSelf || confirmSelf.trim() === ip.trim();
  const canSubmit =
    ip.trim().length > 0 && reason.trim().length > 0 && selfConfirmed;

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await securityService.block({
        ip: ip.trim(),
        reason: reason.trim(),
        duration,
      });
      onSuccess(
        duration === "permanent"
          ? `${ip.trim()} blocked permanently`
          : `${ip.trim()} blocked for ${
              DURATIONS.find((d) => d.value === duration)?.label
            }`,
      );
      onClose();
    } catch (e: any) {
      setError(
        e?.response?.data?.message ?? "Failed to apply the block. Try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal closeButton open={isOpen} onClose={onClose} width="480px" blur>
      <Modal.Header>
        <Text h4 css={{ m: 0 }}>
          Block IP address
        </Text>
      </Modal.Header>
      <Modal.Body>
        <Input
          bordered
          label="IP address or CIDR range"
          placeholder="203.0.113.7 or 203.0.113.0/24"
          value={ip}
          onChange={(e) => setIp(e.target.value)}
          readOnly={!!target}
          css={{ fontFamily: "monospace" }}
        />

        {target ? (
          <Flex wrap="wrap" css={{ gap: "$4" }}>
            <Pill tone="gray">{target.requests.toLocaleString()} requests</Pill>
            {target.failedLogins > 0 ? (
              <Pill tone="red">{target.failedLogins} failed logins</Pill>
            ) : null}
            <Pill tone={target.accounts >= 4 ? "yellow" : "gray"}>
              {target.accounts} account{target.accounts === 1 ? "" : "s"}
            </Pill>
          </Flex>
        ) : null}

        {target && target.accounts > 0 ? (
          <Text size={13} css={{ color: "$warning", m: 0 }}>
            ⚠ {target.accounts} registered user
            {target.accounts === 1 ? " has" : "s have"} used this IP — a school
            or office network shares one address. They will lose access while
            the block is active.
          </Text>
        ) : null}

        <div>
          <Text size={14} css={{ mb: "$3" }}>
            Duration
          </Text>
          <Flex css={{ gap: "$4" }} wrap="wrap">
            {DURATIONS.map((d) => (
              <Button
                key={d.value}
                auto
                size="sm"
                flat={duration !== d.value}
                color={d.value === "permanent" ? "error" : "primary"}
                onClick={() => setDuration(d.value)}
              >
                {d.label}
              </Button>
            ))}
          </Flex>
          {duration === "permanent" ? (
            <Text size={12} css={{ color: "$accents7", mt: "$2", m: 0 }}>
              Permanent blocks never expire on their own. Prefer a temporary
              block unless this is a confirmed persistent attacker.
            </Text>
          ) : null}
        </div>

        <Textarea
          bordered
          label="Reason (kept in the audit log)"
          placeholder="e.g. Credential stuffing against student accounts"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          minRows={2}
        />

        {isSelf ? (
          <>
            <Text size={13} css={{ color: "$error", m: 0 }}>
              ⚠ This is <b>your current IP</b>. Blocking it will lock you out
              of this dashboard unless it is whitelisted. Type the IP to
              confirm.
            </Text>
            <Input
              bordered
              placeholder={ip}
              value={confirmSelf}
              onChange={(e) => setConfirmSelf(e.target.value)}
              css={{ fontFamily: "monospace" }}
              aria-label="Confirm your own IP"
            />
          </>
        ) : null}

        {error ? (
          <Text size={13} css={{ color: "$error", m: 0 }}>
            {error}
          </Text>
        ) : null}
      </Modal.Body>
      <Modal.Footer>
        <Button auto flat onClick={onClose}>
          Cancel
        </Button>
        <Button
          auto
          color="error"
          disabled={!canSubmit || isLoading}
          onClick={handleSubmit}
        >
          {isLoading ? "Blocking…" : "Block"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
