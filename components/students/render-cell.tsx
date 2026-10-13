import { Col, Row, Text, Tooltip, User } from "@nextui-org/react";
import React from "react";
import { useRouter } from "next/router";
import { EditIcon } from "../icons/table/edit-icon";
import { EyeIcon } from "../icons/table/eye-icon";
import {
  MessageCircle,
  Eye,
  Slash,
  CheckCircle2,
  Trash2,
} from "lucide-react";
import { RowActionsMenu } from "../table/row-actions-menu";
import chatService from "../../services/chat";
import { formatDate } from "../../utils/formatDate";

interface Props {
  student: any;
  columnKey: string | React.Key;
  onRefresh?: () => void;
}

export const RenderCell = ({ student, columnKey, onRefresh }: Props) => {
  // @ts-ignore
  const cellValue = student[columnKey];
  const router = useRouter();

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
        <div
          style={{ cursor: "pointer", position: "relative", zIndex: 10 }}
          onClickCapture={(e) => {
            e.stopPropagation();
            const targetUrl = `/students/${student._id || student.id}`;
            if (router) {
              router.push(targetUrl);
            } else {
              window.location.href = targetUrl;
            }
          }}
        >
          <User squared src={student.avatar} name={getFullName()} css={{ p: 0 }}>
            {student.email}
          </User>
        </div>
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
              {cellValue ? formatDate(cellValue) : "N/A"}
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
          {/* Plain buttons, not <Tooltip><IconButton>: the tooltip overlay
              swallowed the first click. `title` gives the hover hint. */}
          <button
            type="button"
            title="Chat with student"
            aria-label="Chat with student"
            onClick={async (e) => {
              e.stopPropagation();
              try {
                const res = await chatService.initConversation(
                  student._id || student.id,
                );
                const convId = res?.data?._id || res?._id;
                router.push(
                  convId ? `/chat?openConversation=${convId}` : "/chat",
                );
              } catch (err) {
                console.error(err);
                alert("Failed to initiate chat.");
              }
            }}
            className="p-2 rounded-lg text-[#7047EB] hover:bg-[#7047EB]/10 transition-colors"
          >
            <MessageCircle size={20} />
          </button>
          <button
            type="button"
            title="Details"
            aria-label="Details"
            onClick={(e) => {
              e.stopPropagation();
              const targetUrl = `/students/${student._id || student.id}`;
              if (router) {
                router.push(targetUrl);
              } else {
                window.location.href = targetUrl;
              }
            }}
            className="p-2 rounded-lg text-[#7047EB] hover:bg-[#7047EB]/10 transition-colors"
          >
            <EyeIcon size={20} />
          </button>
          <button
            type="button"
            title="Edit student"
            aria-label="Edit student"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/students/${student._id || student.id}?edit=1`);
            }}
            className="p-2 rounded-lg text-[#7047EB] hover:bg-[#7047EB]/10 transition-colors"
          >
            <EditIcon size={20} fill="currentColor" />
          </button>
          <Col css={{ d: "flex" }}>
            <RowActionsMenu
              items={[
                {
                  key: "view",
                  label: "View Student",
                  icon: <Eye size={16} />,
                  onSelect: () => {
                    const url = `/students/${student._id || student.id}`;
                    if (router) router.push(url);
                    else window.location.href = url;
                  },
                },
                {
                  key: "suspend",
                  label: "Suspend Student",
                  icon: <Slash size={16} />,
                  className: "text-amber-600",
                  dividerBefore: true,
                  onSelect: () => {
                    void import("../../services/admin").then(
                      async ({ default: adminService }) => {
                        try {
                          await adminService.suspendStudent(
                            student._id || student.id,
                          );
                          alert("Student suspended successfully");
                          onRefresh?.();
                        } catch (error) {
                          console.error("Error suspending student:", error);
                          alert("Failed to suspend student");
                        }
                      },
                    );
                  },
                },
                {
                  key: "activate",
                  label: "Activate Student",
                  icon: <CheckCircle2 size={16} />,
                  className: "text-green-600",
                  onSelect: () => {
                    void import("../../services/admin").then(
                      async ({ default: adminService }) => {
                        try {
                          await adminService.activateStudent(
                            student._id || student.id,
                          );
                          alert("Student activated successfully");
                          onRefresh?.();
                        } catch (error) {
                          console.error("Error activating student:", error);
                          alert("Failed to activate student");
                        }
                      },
                    );
                  },
                },
                {
                  key: "delete",
                  label: "Delete Student",
                  icon: <Trash2 size={16} />,
                  className: "text-red-600",
                  dividerBefore: true,
                  onSelect: () => {
                    if (
                      !confirm(`Are you sure you want to delete ${getFullName()}?`)
                    )
                      return;
                    void import("../../services/admin").then(
                      async ({ default: adminService }) => {
                        try {
                          await adminService.deleteStudent(
                            student._id || student.id,
                          );
                          alert("Student deleted successfully");
                          onRefresh?.();
                        } catch (error) {
                          console.error("Error deleting student:", error);
                          alert("Failed to delete student");
                        }
                      },
                    );
                  },
                },
              ]}
            />
          </Col>
        </Row>
      );
    default:
      return cellValue;
  }
};
