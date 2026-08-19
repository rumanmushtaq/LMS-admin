import {
  Col,
  Row,
  Text,
  Tooltip,
  User,
  Dropdown,
  Badge,
  Button,
} from "@nextui-org/react";
import Link from "next/link";
import React from "react";
import {
  Eye,
  Edit3,
  MoreVertical,
  Trash2,
  Slash,
  CheckCircle2,
  ShieldCheck,
  User as UserIcon,
  BookOpen,
  MessageCircle,
} from "lucide-react";
import chatService from "../../services/chat";

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
            src={teacher.avatar}
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
          {cellValue ? new Date(cellValue).toLocaleDateString() : "N/A"}
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
          {/* Verify Account button — opens verification review modal */}
          <Tooltip
            content="Verify Account"
            rounded
            color="secondary"
            // NextUI opens the tooltip on `focus` and only closes it on
            // `blur`, and React's onFocus is a bubbling focusin — so
            // clicking the icon focuses it and the tooltip stays stuck
            // open over the table. These rest props are spread AFTER
            // NextUI's own handlers, so they replace them. Hover still
            // works; the accessible name now comes from aria-label,
            // which is what assistive tech should have been reading.
            onFocus={undefined}
          >
            <Button
              auto
              light
              ripple={false}
              className="min-w-0 p-2"
              css={{
                height: "auto",
                borderRadius: "8px",
                "&:hover": { bg: "rgba(124, 58, 237, 0.1)" },
                color: "$secondary",
              }}
              onClickCapture={(e) => {
                e.stopPropagation();
                if (onVerify) onVerify();
              }}
              aria-label="Verify account"
            >
              <ShieldCheck size={18} />
            </Button>
          </Tooltip>

          <Tooltip
            content="Chat with Tutor"
            rounded
            color="secondary"
            // NextUI opens the tooltip on `focus` and only closes it on
            // `blur`, and React's onFocus is a bubbling focusin — so
            // clicking the icon focuses it and the tooltip stays stuck
            // open over the table. These rest props are spread AFTER
            // NextUI's own handlers, so they replace them. Hover still
            // works; the accessible name now comes from aria-label,
            // which is what assistive tech should have been reading.
            onFocus={undefined}
          >
            <Button
              auto
              light
              ripple={false}
              className="min-w-0 p-2"
              css={{
                height: "auto",
                borderRadius: "8px",
                "&:hover": { bg: "rgba(112, 71, 235, 0.1)" },
                color: "$secondary",
              }}
              onClickCapture={async (e) => {
                e.stopPropagation();
                try {
                  const id = teacher._id || teacher.id;
                  const res = await chatService.initConversation(id);
                  const convId = res?.data?._id || res?._id;
                  const targetUrl = convId ? `/chat?openConversation=${convId}` : "/chat";
                  if (router) {
                    router.push(targetUrl);
                  } else {
                    window.location.href = targetUrl;
                  }
                } catch (err) {
                  console.error(err);
                  alert("Failed to initiate chat.");
                }
              }}
              aria-label="Chat with tutor"
            >
              <MessageCircle size={18} />
            </Button>
          </Tooltip>

          <Tooltip
            content="Review Detail"
            rounded
            color="primary"
            // See the note on the Verify tooltip above.
            onFocus={undefined}
          >
            <Button
              auto
              light
              ripple={false}
              className="min-w-0 p-2"
              css={{
                height: "auto",
                borderRadius: "8px",
                "&:hover": { bg: "$primaryLight" },
                color: "$primary",
              }}
              onClickCapture={(e) => {
                e.stopPropagation();
                const id = teacher._id || teacher.id;
                const targetUrl = `/teachers/${id}`;
                if (router) {
                  router.push(targetUrl);
                } else {
                  window.location.href = targetUrl;
                }
              }}
              aria-label="Review detail"
            >
              <Eye size={18} />
            </Button>
          </Tooltip>

          <Dropdown placement="bottom-right">
            <Dropdown.Trigger>
              <div
                role="button"
                tabIndex={0}
                aria-label="More actions"
                className="p-2 rounded-lg hover:bg-accents1 transition-colors cursor-pointer text-accents7"
              >
                <MoreVertical size={18} />
              </div>
            </Dropdown.Trigger>
            <Dropdown.Menu
              aria-label="Teacher Actions"
              css={{ borderRadius: "16px", minWidth: "180px" }}
              onAction={(action) => {
                if (action === "verify") {
                  if (onVerify) onVerify();
                } else if (action === "view") {
                  const id = teacher._id || teacher.id;
                  if (router) {
                    router.push(`/teachers/${id}`);
                  } else {
                    window.location.href = `/teachers/${id}`;
                  }
                } else if (action === "delete") {
                  if (
                    confirm(`Are you sure you want to delete ${getFullName()}?`)
                  ) {
                    import("../../services/admin").then(
                      async ({ default: adminService }) => {
                        try {
                          await adminService.deleteUser(
                            teacher._id || teacher.id,
                          );
                          alert("Teacher deleted successfully");
                          if (onRefresh) onRefresh();
                        } catch (error) {
                          alert("Failed to delete teacher");
                        }
                      },
                    );
                  }
                } else if (action === "suspend") {
                  import("../../services/admin").then(
                    async ({ default: adminService }) => {
                      try {
                        await adminService.suspendUser(
                          teacher._id || teacher.id,
                        );
                        alert("Teacher suspended successfully");
                        if (onRefresh) onRefresh();
                      } catch (error) {
                        alert("Failed to suspend teacher");
                      }
                    },
                  );
                } else if (action === "activate") {
                  import("../../services/admin").then(
                    async ({ default: adminService }) => {
                      try {
                        await adminService.activateUser(
                          teacher._id || teacher.id,
                        );
                        alert("Teacher activated successfully");
                        if (onRefresh) onRefresh();
                      } catch (error) {
                        alert("Failed to activate teacher");
                      }
                    },
                  );
                }
              }}
            >
              <Dropdown.Section title="General">
                <Dropdown.Item key="view" icon={<Eye size={18} />}>
                  View Detail
                </Dropdown.Item>
                <Dropdown.Item key="edit" icon={<Edit3 size={18} />}>
                  Edit Profile
                </Dropdown.Item>
              </Dropdown.Section>
              <Dropdown.Section title="Verification">
                <Dropdown.Item
                  key="verify"
                  color="secondary"
                  icon={<ShieldCheck size={18} />}
                  withDivider
                >
                  Verify Account
                </Dropdown.Item>
              </Dropdown.Section>
              <Dropdown.Section title="Management">
                {/*
                  Exactly one of these is rendered — never both with one hidden
                  by CSS. NextUI's Dropdown is a react-stately collection built
                  from its rendered children, so a `display: none` item is still
                  a real, focusable member of the list. Moving the pointer down
                  the menu focuses items by collection index, and focusing a
                  `display: none` node silently fails, which drops focus out of
                  the menu's FocusScope and dismisses the whole dropdown before
                  you can reach the items below it.
                */}
                {teacher.status === "active" ? (
                  <Dropdown.Item
                    key="suspend"
                    color="warning"
                    icon={<Slash size={18} />}
                  >
                    Suspend
                  </Dropdown.Item>
                ) : (
                  <Dropdown.Item
                    key="activate"
                    color="success"
                    icon={<CheckCircle2 size={18} />}
                  >
                    Activate
                  </Dropdown.Item>
                )}
                <Dropdown.Item
                  key="delete"
                  color="error"
                  icon={<Trash2 size={18} />}
                  withDivider
                >
                  Delete Profile
                </Dropdown.Item>
              </Dropdown.Section>
            </Dropdown.Menu>
          </Dropdown>
        </Row>
      );
    default:
      return cellValue;
  }
};

import { Flex } from "../styles/flex";
