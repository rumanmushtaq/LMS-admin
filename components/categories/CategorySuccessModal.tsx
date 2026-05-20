import React from "react";
import { Modal, Button, Text } from "@nextui-org/react";
import { CheckCircle } from "lucide-react";
import { Flex } from "../styles/flex";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

export const CategorySuccessModal = ({ isOpen, onClose, message }: Props) => {
  return (
    <Modal
      closeButton
      aria-labelledby="modal-title"
      open={isOpen}
      onClose={onClose}
    >
      <Modal.Header>
        <Flex direction={"column"} align={"center"} css={{ gap: "$5" }}>
          <CheckCircle size={40} color="green" />
          <Text id="modal-title" size={18} b>
            Success
          </Text>
        </Flex>
      </Modal.Header>
      <Modal.Body>
        <Text size={"$md"} css={{ textAlign: "center" }}>
          {message}
        </Text>
      </Modal.Body>
      <Modal.Footer>
        <Button auto onClick={onClose}>
          Done
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
