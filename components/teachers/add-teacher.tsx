import { Button, Divider, Input, Modal, Text } from "@nextui-org/react";
import React from "react";
import { Flex } from "../styles/flex";

export const AddTeacher = () => {
  const [visible, setVisible] = React.useState(false);
  const handler = () => setVisible(true);

  const closeHandler = () => {
    setVisible(false);
    console.log("closed");
  };

  return (
    <div>
      <Button auto onClick={handler} css={{ bg: '#7047EB', color: '$white' }}>
        Add Teacher
      </Button>
      <Modal
        closeButton
        aria-labelledby="modal-title"
        width="600px"
        open={visible}
        onClose={closeHandler}
      >
        <Modal.Header css={{ justifyContent: "start" }}>
          <Text id="modal-title" h4>
            Add new teacher
          </Text>
        </Modal.Header>
        <Divider css={{ my: "$5" }} />
        <Modal.Body css={{ py: "$10" }}>
          <Flex
            direction={"column"}
            css={{
              flexWrap: "wrap",
              gap: "$8",
              "@lg": { flexWrap: "nowrap", gap: "$12" },
            }}
          >
            <Flex
              css={{
                gap: "$10",
                flexWrap: "wrap",
                "@lg": { flexWrap: "nowrap" },
              }}
            >
              <Input
                label="First Name"
                bordered
                clearable
                fullWidth
                size="lg"
                placeholder="First Name"
              />
              <Input
                label="Last Name"
                clearable
                bordered
                fullWidth
                size="lg"
                placeholder="Last Name"
              />
            </Flex>

            <Flex
              css={{
                gap: "$10",
                flexWrap: "wrap",
                "@lg": { flexWrap: "nowrap" },
              }}
            >
              <Input
                label="Email"
                clearable
                bordered
                fullWidth
                size="lg"
                placeholder="Email"
              />
              <Input
                label="Phone Number"
                clearable
                bordered
                fullWidth
                size="lg"
                placeholder="Phone Number"
              />
            </Flex>
            <Flex
              css={{
                gap: "$10",
                flexWrap: "wrap",
                "@lg": { flexWrap: "nowrap" },
              }}
            >
              <Input
                label="Subject"
                clearable
                bordered
                fullWidth
                size="lg"
                placeholder="Subject"
              />
              <Input
                label="Join Date"
                type="date"
                clearable
                bordered
                fullWidth
                size="lg"
                placeholder="Join Date"
              />
            </Flex>
          </Flex>
        </Modal.Body>
        <Divider css={{ my: "$5" }} />
        <Modal.Footer>
          <Button auto onClick={closeHandler} css={{ bg: '#7047EB', color: '$white' }}>
            Add Teacher
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
