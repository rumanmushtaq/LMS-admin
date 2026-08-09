import { Text, Tooltip, Row, Col, Modal, Button, Textarea } from "@nextui-org/react";
import React, { useState } from "react";
import { DeleteIcon } from "../icons/table/delete-icon";
import { IconButton, StyledBadge } from "../table/table.styled";
import { cancelClassAsAdmin, ClassSession, ClassStatus } from "../../services/classes";

interface Props {
  classItem: ClassSession;
  columnKey: string | React.Key;
  onRefresh: () => void;
}

export const RenderCell = ({ classItem, columnKey, onRefresh }: Props) => {
  const [isCancelling, setIsCancelling] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  // Cancel (not delete): the record stays, students get notified, and the
  // backend's tutor 3-strike policy keeps its audit trail.
  const handleCancel = async () => {
    setIsCancelling(true);
    try {
      await cancelClassAsAdmin(classItem._id, cancelReason.trim() || undefined);
      setModalVisible(false);
      setCancelReason("");
      onRefresh();
    } catch (error) {
      console.error("Failed to cancel class:", error);
    } finally {
      setIsCancelling(false);
    }
  };

  const isCancellable =
    classItem.status !== ClassStatus.CANCELLED &&
    classItem.status !== ClassStatus.COMPLETED;

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
    case "status": {
      const badge = (
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
      // Cancelled classes explain themselves on hover: who and why.
      if (classItem.status === ClassStatus.CANCELLED) {
        const by = classItem.cancelledByRole === "admin" ? "an admin" : "the tutor";
        return (
          <Tooltip
            content={`Cancelled by ${by}${classItem.cancelReason ? `: ${classItem.cancelReason}` : ""}`}
          >
            {badge}
          </Tooltip>
        );
      }
      return badge;
    }
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
      if (!isCancellable) {
        return (
          <Row justify="center" align="center">
            <Text size={12} css={{ color: "$accents6" }}>—</Text>
          </Row>
        );
      }
      return (
        <Row justify="center" align="center">
          <Tooltip content="Cancel class" color="error">
            <IconButton onClick={() => setModalVisible(true)} disabled={isCancelling}>
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
                Cancel &quot;{classItem.title}&quot;? The{" "}
                {classItem.students?.length || 0} enrolled student
                {(classItem.students?.length || 0) === 1 ? "" : "s"} will be
                notified, and the class stays in the list as Cancelled.
              </Text>
              <Textarea
                aria-label="Cancellation reason"
                placeholder="Reason (shown to students)"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                fullWidth
              />
            </Modal.Body>
            <Modal.Footer>
              <Button auto flat color="error" onClick={() => setModalVisible(false)}>
                Close
              </Button>
              <Button auto color="error" onClick={handleCancel} disabled={isCancelling}>
                {isCancelling ? "Cancelling..." : "Yes, cancel class"}
              </Button>
            </Modal.Footer>
          </Modal>
        </Row>
      );
    default:
      return <div>{classItem[columnKey as keyof ClassSession] as any}</div>;
  }
};
