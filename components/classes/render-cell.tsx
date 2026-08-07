import { Text, Tooltip, Row, Col, Modal, Button } from "@nextui-org/react";
import React, { useState } from "react";
import { DeleteIcon } from "../icons/table/delete-icon";
import { IconButton, StyledBadge } from "../table/table.styled";
import { deleteClassAsAdmin, ClassSession, ClassStatus } from "../../services/classes";

interface Props {
  classItem: ClassSession;
  columnKey: string | React.Key;
  onRefresh: () => void;
}

export const RenderCell = ({ classItem, columnKey, onRefresh }: Props) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteClassAsAdmin(classItem._id);
      setModalVisible(false);
      onRefresh();
    } catch (error) {
      console.error("Failed to delete class:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const tutorName = classItem.tutorId
    ? `${classItem.tutorId.firstName || ""} ${classItem.tutorId.lastName || ""}`.trim() || "Unknown Tutor"
    : "Unknown Tutor";

  switch (columnKey) {
    case "title":
      return (
        <Col>
          <Text b size={14} css={{ tt: "capitalize" }}>
            {classItem.title}
          </Text>
          <Text size={13} css={{ color: "$accents7" }}>
            {classItem.description?.substring(0, 40)}
            {classItem.description?.length > 40 ? "..." : ""}
          </Text>
        </Col>
      );
    case "tutor":
      return (
        <Text size={14} css={{ tt: "capitalize" }}>
          {tutorName}
        </Text>
      );
    case "students":
      return (
        <Text size={14}>
          {classItem.students?.length || 0} enrolled
        </Text>
      );
    case "status":
      return (
        <StyledBadge
          type={
            classItem.status === ClassStatus.SCHEDULED
              ? "active"
              : classItem.status === ClassStatus.ONGOING
              ? "active" // You might want different colors
              : classItem.status === ClassStatus.COMPLETED
              ? "paused"
              : "vacation"
          }
        >
          {classItem.status}
        </StyledBadge>
      );
    case "time":
      return (
        <Col>
          <Text size={13}>Start: {new Date(classItem.startTime).toLocaleString()}</Text>
          <Text size={13} css={{ color: "$accents7" }}>
            End: {new Date(classItem.endTime).toLocaleString()}
          </Text>
        </Col>
      );
    case "actions":
      return (
        <Row justify="center" align="center">
          <Tooltip content="Cancel class" color="error">
            <IconButton onClick={() => setModalVisible(true)} disabled={isDeleting}>
              <DeleteIcon size={20} fill="#FF0080" />
            </IconButton>
          </Tooltip>

          <Modal
            closeButton
            aria-labelledby="modal-title"
            open={modalVisible}
            onClose={() => setModalVisible(false)}
          >
            <Modal.Header>
              <Text id="modal-title" h4>
                Cancel Class
              </Text>
            </Modal.Header>
            <Modal.Body>
              <Text>
                Are you sure you want to cancel the class &quot;{classItem.title}&quot;?
                This action cannot be undone.
              </Text>
            </Modal.Body>
            <Modal.Footer>
              <Button auto flat color="error" onClick={() => setModalVisible(false)}>
                Close
              </Button>
              <Button auto color="error" onClick={handleDelete} disabled={isDeleting}>
                {isDeleting ? "Canceling..." : "Yes, cancel class"}
              </Button>
            </Modal.Footer>
          </Modal>
        </Row>
      );
    default:
      return <div>{classItem[columnKey as keyof ClassSession] as any}</div>;
  }
};
