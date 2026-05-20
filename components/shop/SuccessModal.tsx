import React from "react";
import { Modal, Button, Text } from "@nextui-org/react";
import { CheckCircle, List, Plus, Layout } from "lucide-react";
import { Flex } from "../styles/flex";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateAnother: () => void;
  onGoToList: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  onCreateAnother,
  onGoToList,
}) => {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      css={{ borderRadius: "24px", p: "$8" }}
      aria-labelledby="success-modal-title"
    >
      <Modal.Header css={{ pb: 0 }}>
        <Flex direction="column" align="center" css={{ width: "100%" }}>
          <Flex
            align="center"
            justify="center"
            css={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              bg: "$successLight",
              mb: "$6",
              color: "$success",
            }}
          >
            <CheckCircle size={40} />
          </Flex>
          <Text id="success-modal-title" h3 css={{ m: 0, textAlign: "center" }}>
            Product Created Successfully!
          </Text>
        </Flex>
      </Modal.Header>

      <Modal.Body css={{ py: "$6" }}>
        <Text
          color="$accents7"
          css={{ textAlign: "center", lineHeight: "$lg", px: "$2" }}
        >
          Your new product is now live in the store. What would you like to do
          next?
        </Text>
      </Modal.Body>

      <Modal.Footer css={{ pb: "$4" }}>
        <Flex direction="column" css={{ width: "100%", gap: "$4" }}>
          <Button
            auto
            css={{
              bg: "#7047EB",
              color: "white",
              borderRadius: "14px",
              fontWeight: "$bold",
              height: "$16",
              width: "100%",
            }}
            icon={<Plus size={20} />}
            onPress={onCreateAnother}
          >
            Create Another Product
          </Button>

          <Flex css={{ gap: "$4", width: "100%" }}>
            <Button
              auto
              flat
              color="secondary"
              css={{
                flex: 1,
                borderRadius: "14px",
                fontWeight: "$bold",
                height: "$14",
              }}
              icon={<List size={18} />}
              onPress={onGoToList}
            >
              Go to List
            </Button>
            <Button
              auto
              flat
              color="default"
              css={{
                flex: 1,
                borderRadius: "14px",
                fontWeight: "$bold",
                height: "$14",
              }}
              icon={<Layout size={18} />}
              onPress={onClose}
            >
              Stay Here
            </Button>
          </Flex>
        </Flex>
      </Modal.Footer>
    </Modal>
  );
};
