import React from "react";
import { Modal, Button, Text, Spacer } from "@nextui-org/react";
import { ShieldCheck, ShieldOff } from "lucide-react";
import { Flex } from "../styles/flex";

interface StatusConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  newStatus: "active" | "suspended";
  isLoading?: boolean;
}

export const StatusConfirmModal: React.FC<StatusConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  newStatus,
  isLoading = false,
}) => {
  const isSuspending = newStatus === "suspended";

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      preventClose={isLoading}
      css={{ borderRadius: "24px", p: "$4" }}
      aria-labelledby="status-modal-title"
    >
      <Modal.Header css={{ pb: 0 }}>
        <Flex
          direction="column"
          align="center"
          css={{ width: "100%", pt: "$4" }}
        >
          <Flex
            align="center"
            justify="center"
            css={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              bg: isSuspending ? "$errorLight" : "$successLight",
              mb: "$4",
            }}
          >
            {isSuspending ? (
              <ShieldOff size={30} color="var(--nextui-colors-error)" />
            ) : (
              <ShieldCheck size={30} color="var(--nextui-colors-success)" />
            )}
          </Flex>
          <Text
            id="status-modal-title"
            h3
            css={{ mb: "$1", textAlign: "center" }}
          >
            {isSuspending ? "Suspend Account?" : "Activate Account?"}
          </Text>
        </Flex>
      </Modal.Header>

      <Modal.Body css={{ pt: "$2", pb: "$4" }}>
        <Text
          color="$accents7"
          css={{ textAlign: "center", lineHeight: "$lg", px: "$4" }}
        >
          {isSuspending
            ? "This will immediately revoke access and log the user out. They will receive an email notification about the suspension."
            : "This will restore full access to the user's account. They will receive an email notification confirming their account is active."}
        </Text>
      </Modal.Body>

      <Modal.Footer css={{ gap: "$4", pb: "$6" }}>
        <Button
          auto
          flat
          color="default"
          onPress={onClose}
          disabled={isLoading}
          css={{
            flex: 1,
            borderRadius: "14px",
            fontWeight: "$bold",
            height: "$13",
          }}
        >
          Cancel
        </Button>
        <Button
          auto
          color={isSuspending ? "error" : "success"}
          onPress={onConfirm}
          disabled={isLoading}
          css={{
            flex: 1,
            borderRadius: "14px",
            fontWeight: "$bold",
            height: "$13",
          }}
        >
          {isLoading
            ? "Please wait..."
            : isSuspending
              ? "Yes, Suspend"
              : "Yes, Activate"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
