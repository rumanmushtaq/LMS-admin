import React from "react";
import { Modal, Button, Text } from "@nextui-org/react";
import { AlertTriangle } from "lucide-react";
import { Flex } from "../styles/flex";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      preventClose={isLoading}
      css={{ borderRadius: "24px", p: "$4" }}
      aria-labelledby="delete-modal-title"
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
              bg: "#FDF2F8", // pink-50
              mb: "$4",
            }}
          >
            <AlertTriangle size={30} color="#DB2777" />
          </Flex>
          <Text
            id="delete-modal-title"
            h3
            css={{ mb: "$1", textAlign: "center" }}
          >
            Permanently Delete Product?
          </Text>
        </Flex>
      </Modal.Header>

      <Modal.Body css={{ pt: "$2", pb: "$4" }}>
        <Text
          color="$accents7"
          css={{ textAlign: "center", lineHeight: "$lg", px: "$4" }}
        >
          This action cannot be undone. This product will be permanently removed
          from your store and all associated data will be lost.
        </Text>
      </Modal.Body>

      <Modal.Footer css={{ gap: "$4", pb: "$6" }}>
        <Button
          auto
          flat
          onPress={onClose}
          disabled={isLoading}
          css={{
            flex: 1,
            borderRadius: "14px",
            fontWeight: "$bold",
            height: "$13",
            bg: "#F3E8FF", // purple-100
            color: "#7E22CE", // purple-700
            "&:hover": {
              bg: "#E9D5FF", // purple-200
            },
          }}
        >
          Cancel
        </Button>
        <Button
          auto
          onPress={onConfirm}
          disabled={isLoading}
          css={{
            flex: 1,
            borderRadius: "14px",
            fontWeight: "$bold",
            height: "$13",
            bg: "#EC4899", // pink-500
            color: "white",
            "&:hover": {
              bg: "#DB2777", // pink-600
            },
          }}
        >
          {isLoading ? "Deleting..." : "Yes, Delete"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
