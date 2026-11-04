import { Col, Row, Text, Tooltip, User } from "@nextui-org/react";
import React from "react";
import { useRouter } from "next/router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { useStartChat } from "../../hooks/useStartChat";
import { formatDate } from "../../utils/formatDate";

interface Props {
  student: any;
  columnKey: string | React.Key;
  onRefresh?: () => void;
}

/** A cached ["students", ...] list page (see students/table.tsx). */
interface StudentPage {
  students: any[];
  meta?: { total: number } & Record<string, any>;
}

const isStudentPage = (old: unknown): old is StudentPage =>
  !!old && Array.isArray((old as StudentPage).students);

export const RenderCell = ({ student, columnKey, onRefresh }: Props) => {
  // @ts-ignore
  const cellValue = student[columnKey];
  const router = useRouter();
  const startChat = useStartChat();
  const queryClient = useQueryClient();
  const studentId: string = student._id || student.id;
  const isThisStudent = (s: any) => (s._id || s.id) === studentId;

  /** Edits the cached list pages in place — no refetch, no skeleton. */
  const updateCachedRows = (fn: (rows: any[]) => any[]) =>
    queryClient.setQueriesData<StudentPage>({ queryKey: ["students"] }, (old) =>
      isStudentPage(old) ? { ...old, students: fn(old.students) } : old,
    );

  const setCachedStatus = (status: string) =>
    updateCachedRows((rows) =>
      rows.map((s) => (isThisStudent(s) ? { ...s, status } : s)),
    );

  /** Quietly re-sync with the server; cached rows stay on screen meanwhile. */
  const resync = () => {
    queryClient.invalidateQueries({ queryKey: ["students"] });
    queryClient.invalidateQueries({ queryKey: ["dashboard"] });
  };

  const statusMutation = useMutation({
    mutationFn: async (action: "suspend" | "activate") => {
      const { default: adminService } = await import("../../services/admin");
      return action === "suspend"
        ? adminService.suspendStudent(studentId)
        : adminService.activateStudent(studentId);
    },
    onMutate: async (action) => {
      // A list refetch still in flight would land after the flip and undo it.
      await queryClient.cancelQueries({ queryKey: ["students"] });
      const previousStatus: string = student.status;
      // Flip the row immediately; put back below if the server refuses.
      setCachedStatus(action === "suspend" ? "suspended" : "active");
      return { previousStatus };
    },
    onSuccess: (_res, action) => {
      alert(
        action === "suspend"
          ? "Student suspended successfully"
          : "Student activated successfully",
      );
      onRefresh?.();
    },
    onError: (error, action, context) => {
      if (context) setCachedStatus(context.previousStatus);
      if (action === "suspend") {
        console.error("Error suspending student:", error);
        alert("Failed to suspend student");
      } else {
        console.error("Error activating student:", error);
        alert("Failed to activate student");
      }
    },
    onSettled: () => {
      // With a status filter applied the row may no longer belong in the
      // list, and the detail page caches its own copy.
      resync();
      queryClient.invalidateQueries({ queryKey: ["student", studentId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const { default: adminService } = await import("../../services/admin");
      return adminService.deleteStudent(studentId);
    },
    onSuccess: () => {
      // Drop the row right away; the rest of the table stays put.
      queryClient.setQueriesData<StudentPage>({ queryKey: ["students"] }, (old) =>
        isStudentPage(old) && old.students.some(isThisStudent)
          ? {
              ...old,
              students: old.students.filter((s) => !isThisStudent(s)),
              meta: old.meta && {
                ...old.meta,
                total: Math.max(0, old.meta.total - 1),
              },
            }
          : old,
      );
      queryClient.removeQueries({ queryKey: ["student", studentId] });
      alert("Student deleted successfully");
      onRefresh?.();
      resync();
    },
    onError: (error) => {
      console.error("Error deleting student:", error);
      alert("Failed to delete student");
    },
  });

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
            disabled={startChat.isPending}
            onClick={(e) => {
              e.stopPropagation();
              startChat.mutate(student._id || student.id);
            }}
            className="p-2 rounded-lg text-[#7047EB] hover:bg-[#7047EB]/10 transition-colors disabled:opacity-50"
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
                    // Ignore a second click while the first is still in flight.
                    if (statusMutation.isPending) return;
                    statusMutation.mutate("suspend");
                  },
                },
                {
                  key: "activate",
                  label: "Activate Student",
                  icon: <CheckCircle2 size={16} />,
                  className: "text-green-600",
                  onSelect: () => {
                    if (statusMutation.isPending) return;
                    statusMutation.mutate("activate");
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
                    if (deleteMutation.isPending) return;
                    deleteMutation.mutate();
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
