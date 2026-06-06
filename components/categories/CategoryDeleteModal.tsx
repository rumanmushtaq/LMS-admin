import React from "react";
import { Modal, Button, Text } from "@nextui-org/react";
import { AlertTriangle } from "lucide-react";
import { Flex } from "../styles/flex";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export const CategoryDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}: Props) => {
  return (
    <Modal
      closeButton
      aria-labelledby="modal-title"
      open={isOpen}
      onClose={onClose}
    >
      <Modal.Header>
        <Flex direction={"column"} align={"center"} css={{ gap: "$5" }}>
          <AlertTriangle size={40} color="red" />
          <Text id="modal-title" size={18} b>
            {title}
          </Text>
        </Flex>
      </Modal.Header>
      <Modal.Body>
        <Text size={"$md"} css={{ textAlign: "center" }}>
          {message}
        </Text>
      </Modal.Body>
      <Modal.Footer>
        <Button auto flat color="error" onClick={onClose}>
          Cancel
        </Button>
        <Button auto color="error" onClick={onConfirm}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
