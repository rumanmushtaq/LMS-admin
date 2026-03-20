import { Col, Row, Text, Tooltip, User, Dropdown } from "@nextui-org/react";
import React from "react";
import { DeleteIcon } from "../icons/table/delete-icon";
import { EditIcon } from "../icons/table/edit-icon";
import { EyeIcon } from "../icons/table/eye-icon";
import { IconButton } from "../table/table.styled";

interface Props {
  student: any;
  columnKey: string | React.Key;
  onRefresh?: () => void;
}

export const RenderCell = ({ student, columnKey, onRefresh }: Props) => {
  // @ts-ignore
  const cellValue = student[columnKey];

  // Helper function to get full name
  const getFullName = () => {
    return (
      `${student.firstName || ""} ${student.lastName || ""}`.trim() ||
      student.name
    );
  };

  switch (columnKey) {
    case "name":
      return (
        <User squared src={student.avatar} name={getFullName()} css={{ p: 0 }}>
          {student.email}
        </User>
      );
    case "email":
      return (
        <Text b size={14} css={{ tt: "capitalize" }}>
          {cellValue}
        </Text>
      );
    case "createdAt":
      return (
        <Col>
          <Row>
            <Text b size={14} css={{ tt: "capitalize" }}>
              {cellValue ? new Date(cellValue).toLocaleDateString() : "N/A"}
            </Text>
          </Row>
        </Col>
      );
    case "status":
      return (
        <Text
          b
          size={14}
          css={{
            tt: "capitalize",
            color:
              cellValue === "active"
                ? "$success"
                : cellValue === "suspended"
                  ? "$danger"
                  : "$warning",
          }}
        >
          {cellValue}
        </Text>
      );
    case "actions":
      return (
        <Row
          justify="center"
          align="center"
          css={{ gap: "$8", "@md": { gap: 0 } }}
        >
          <Col css={{ d: "flex" }}>
            <Tooltip content="Details">
              <IconButton
                onClick={() =>
                  console.log("View student", student._id || student.id)
                }
              >
                <EyeIcon size={20} fill="#979797" />
              </IconButton>
            </Tooltip>
          </Col>
          <Col css={{ d: "flex" }}>
            <Tooltip content="Edit student">
              <IconButton
                onClick={() =>
                  console.log("Edit student", student._id || student.id)
                }
              >
                <EditIcon size={20} fill="#979797" />
              </IconButton>
            </Tooltip>
          </Col>
          <Col css={{ d: "flex" }}>
            <Dropdown>
              <Dropdown.Trigger>
                <IconButton>
                  <svg
                    fill="none"
                    height="16"
                    shapeRendering="geometricPrecision"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                    width="16"
                  >
                    <path d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
                  </svg>
                </IconButton>
              </Dropdown.Trigger>
              <Dropdown.Menu
                aria-label="Student Actions"
                onAction={(action) => {
                  if (action === "delete") {
                    if (
                      confirm(
                        `Are you sure you want to delete ${getFullName()}?`,
                      )
                    ) {
                      import("../../services/admin").then(
                        async ({ default: adminService }) => {
                          try {
                            await adminService.deleteStudent(
                              student._id || student.id,
                            );
                            alert("Student deleted successfully");
                            if (onRefresh) onRefresh();
                          } catch (error) {
                            console.error("Error deleting student:", error);
                            alert("Failed to delete student");
                          }
                        },
                      );
                    }
                  } else if (action === "suspend") {
                    import("../../services/admin").then(
                      async ({ default: adminService }) => {
                        try {
                          await adminService.suspendStudent(
                            student._id || student.id,
                          );
                          alert("Student suspended successfully");
                          if (onRefresh) onRefresh();
                        } catch (error) {
                          console.error("Error suspending student:", error);
                          alert("Failed to suspend student");
                        }
                      },
                    );
                  } else if (action === "activate") {
                    import("../../services/admin").then(
                      async ({ default: adminService }) => {
                        try {
                          await adminService.activateStudent(
                            student._id || student.id,
                          );
                          alert("Student activated successfully");
                          if (onRefresh) onRefresh();
                        } catch (error) {
                          console.error("Error activating student:", error);
                          alert("Failed to activate student");
                        }
                      },
                    );
                  }
                }}
              >
                <Dropdown.Item key="suspend" color="warning">
                  Suspend Student
                </Dropdown.Item>
                <Dropdown.Item key="activate" color="success">
                  Activate Student
                </Dropdown.Item>
                <Dropdown.Item key="delete" color="error">
                  Delete Student
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row>
      );
    default:
      return cellValue;
  }
};
