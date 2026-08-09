import { Button, Input, Modal, Text } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { securityService } from "../../services/security";

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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIp(prefillIp ?? "");
      setLabel(prefillIp ? "My IP" : "");
      setError(null);
    }
  }, [isOpen, prefillIp]);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await securityService.addWhitelist({
        ip: ip.trim(),
        label: label.trim(),
      });
      onSuccess(`${ip.trim()} whitelisted`);
      onClose();
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "Failed to add to whitelist.");
    } finally {
      setIsLoading(false);
    }
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
