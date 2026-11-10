import { Row, Text, Tooltip, User, Badge } from "@nextui-org/react";
import React from "react";
import { Eye, ShieldCheck, BookOpen, MessageCircle } from "lucide-react";
import { useStartChat } from "../../hooks/useStartChat";
import { TeacherActionsMenu } from "./actions-menu";

/**
 * Its own component so the mutation hook isn't called inside RenderCell's
 * switch (hooks can't be conditional).
 */
const ChatButton = ({ userId, label }: { userId: string; label: string }) => {
  const startChat = useStartChat();
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={startChat.isPending}
      onClick={(e) => {
        e.stopPropagation();
        startChat.mutate(userId);
      }}
      className="p-2 rounded-lg text-[#7047EB] hover:bg-[#7047EB]/10 transition-colors disabled:opacity-50"
    >
      <MessageCircle size={18} />
    </button>
  );
};

interface Props {
  teacher: any;
  columnKey: string | React.Key;
  onRefresh?: () => void;
  onVerify?: () => void;
  router?: any;
}

export const RenderCell = ({
  teacher,
  columnKey,
  onRefresh,
  onVerify,
  router,
}: Props) => {
  // @ts-ignore
  const cellValue = teacher[columnKey];

  const getFullName = () => {
    return (
      `${teacher.firstName || ""} ${teacher.lastName || ""}`.trim() ||
      teacher.name
    );
  };

  switch (columnKey) {
    case "name":
      const id = teacher._id || teacher.id;
      return (
        <div
          style={{ cursor: "pointer", position: "relative", zIndex: 10 }}
          onClickCapture={(e) => {
            e.stopPropagation();
            const targetUrl = `/teachers/${id}`;
            if (router) {
              router.push(targetUrl);
            } else {
              window.location.href = targetUrl;
            }
          }}
        >
          <User
            // Same photo the detail page shows: onboarding stores it in
            // kycData.photoUrl; top-level avatar is only a fallback.
            src={teacher.kycData?.photoUrl || teacher.avatar}
            name={getFullName()}
            description={teacher.email}
            css={{
              p: 0,
              "& .nextui-user-name": {
                fontWeight: "$bold",
                color: "$primary",
              },
              "& .nextui-user-desc": { fontSize: "$xs" },
            }}
          />
        </div>
      );
    case "subject": {
      // The API sends `subject` (joined, for a quick read) and `subjects` (the
      // list). Showing the first plus a "+N" keeps the column narrow — a tutor
      // with five specialities would otherwise push the table sideways.
      const subjects: string[] = Array.isArray(teacher?.subjects)
        ? teacher.subjects
        : cellValue
          ? String(cellValue).split(",").map((s: string) => s.trim()).filter(Boolean)
          : [];

      if (subjects.length === 0) {
        return (
          <Flex align="center" css={{ gap: "$2" }}>
            <BookOpen size={14} color="var(--nextui-colors-accents7)" />
            <Text size={14} color="$accents7">
              N/A
            </Text>
          </Flex>
        );
      }

      const [first, ...rest] = subjects;

      return (
        <Tooltip content={subjects.join(", ")} color="invert">
          <Flex align="center" css={{ gap: "$2" }}>
            <BookOpen size={14} color="var(--nextui-colors-accents7)" />
            <Text b size={14} color="$accents9">
              {first}
            </Text>
            {rest.length > 0 && (
              <Text size={12} color="$accents7">
                +{rest.length}
              </Text>
            )}
          </Flex>
        </Tooltip>
      );
    }
    case "createdAt":
      return (
        <Text b size={14} color="$accents8">
          {cellValue ? formatDate(cellValue) : "N/A"}
        </Text>
      );
    case "status":
      const statusColor =
        cellValue === "active"
          ? "success"
          : cellValue === "suspended"
            ? "error"
            : "warning";

      return (
        <Badge
          color={statusColor}
          variant="flat"
          css={{
            borderRadius: "8px",
            px: "$4",
            fontWeight: "$bold",
            tt: "uppercase",
            fontSize: "10px",
          }}
        >
          {cellValue}
        </Badge>
      );
    case "actions":
      return (
        <Row justify="center" align="center" css={{ gap: "$4" }}>
          {/* Plain buttons, not NextUI <Tooltip><Button>: the tooltip's
              overlay swallowed the first click, so every action needed two
              clicks. `title` gives the hover hint; one onClick fires once. */}
          <button
            type="button"
            title="Verify Account"
            aria-label="Verify account"
            onClick={(e) => {
              e.stopPropagation();
              if (onVerify) onVerify();
            }}
            className="p-2 rounded-lg text-[#7047EB] hover:bg-[#7047EB]/10 transition-colors"
          >
            <ShieldCheck size={18} />
          </button>

          <ChatButton userId={teacher._id || teacher.id} label="Chat with Tutor" />

          <button
            type="button"
            title="Review Detail"
            aria-label="Review detail"
            onClick={(e) => {
              e.stopPropagation();
              const id = teacher._id || teacher.id;
              const targetUrl = `/teachers/${id}`;
              if (router) {
                router.push(targetUrl);
              } else {
                window.location.href = targetUrl;
              }
            }}
            className="p-2 rounded-lg text-[#7047EB] hover:bg-[#7047EB]/10 transition-colors"
          >
            <Eye size={18} />
          </button>

          <TeacherActionsMenu
            teacher={teacher}
            onRefresh={onRefresh}
            onVerify={onVerify}
            router={router}
          />
        </Row>
      );
    default:
      return cellValue;
  }
};

import { Flex } from "../styles/flex";
import { formatDate } from "../../utils/formatDate";
