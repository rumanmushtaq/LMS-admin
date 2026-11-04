import { Button, Input, Modal, Text } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  securityService,
  type IpRow,
  type WhitelistEntry,
} from "../../services/security";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  /** Convenience prefill: "whitelist my IP" from the header. */
  prefillIp?: string | null;
}

export const WhitelistModal = ({
  isOpen,
  onClose,
  onSuccess,
  prefillIp,
}: Props) => {
  const [ip, setIp] = useState("");
  const [label, setLabel] = useState("");
  const [error, setError] = useState<string | null>(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (isOpen) {
      setIp(prefillIp ?? "");
      setLabel(prefillIp ? "My IP" : "");
      setError(null);
    }
  }, [isOpen, prefillIp]);

  const addMutation = useMutation({
    mutationFn: (payload: { ip: string; label: string }) =>
      securityService.addWhitelist(payload),
    onSuccess: (entry, payload) => {
      // Add the entry and flag the IP row right away; the quiet refetch
      // below brings the rest of the page in line.
      if (entry?._id) {
        queryClient.setQueryData<WhitelistEntry[]>(
          ["security", "whitelist"],
          (old) =>
            old ? [entry, ...old.filter((w) => w.key !== entry.key)] : old,
        );
      }
      queryClient.setQueriesData<{ items: IpRow[] }>(
        { queryKey: ["security", "ips"] },
        (old) =>
          old
            ? {
                ...old,
                items: old.items.map((row) =>
                  row.ip === payload.ip ? { ...row, whitelisted: true } : row,
                ),
              }
            : old,
      );
      queryClient.invalidateQueries({ queryKey: ["security"] });

      onSuccess(`${payload.ip} whitelisted`);
      onClose();
    },
    onError: (e: any) => {
      setError(e?.response?.data?.message ?? "Failed to add to whitelist.");
    },
  });
  const isLoading = addMutation.isPending;

  const handleSubmit = () => {
    setError(null);
    addMutation.mutate({ ip: ip.trim(), label: label.trim() });
  };

  return (
    <Modal closeButton open={isOpen} onClose={onClose} width="440px" blur>
      <Modal.Header>
        <Text h4 css={{ m: 0 }}>
          Add to whitelist
        </Text>
      </Modal.Header>
      <Modal.Body>
        <Text size={13} css={{ color: "$accents8", m: 0 }}>
          Whitelisted addresses are never blocked — automatically or manually.
        </Text>
        <Input
          bordered
          label="IP address or CIDR range"
          placeholder="198.51.100.4 or 198.51.100.0/24"
          value={ip}
          onChange={(e) => setIp(e.target.value)}
          css={{ fontFamily: "monospace" }}
        />
        <Input
          bordered
          label="Label"
          placeholder="e.g. Office network"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
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
          disabled={!ip.trim() || !label.trim() || isLoading}
          onClick={handleSubmit}
        >
          {isLoading ? "Adding…" : "Add"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
