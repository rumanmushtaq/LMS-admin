import { Button, Input, Dropdown, Text } from "@nextui-org/react";
import React from "react";
import { Flex } from "../styles/flex";
import { Search, Filter, Calendar, ChevronDown, Download } from "lucide-react";

interface Props {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  startDate?: string;
  onStartDateChange?: (value: string) => void;
  endDate?: string;
  onEndDateChange?: (value: string) => void;
  status?: string;
  onStatusChange?: (value: any) => void;
  statusOptions?: { key: string; label: string }[];
  emailVerified?: string;
  onEmailVerifiedChange?: (value: any) => void;
  onExport?: () => void;
  addButton?: React.ReactNode;
}

export const TableFilters = ({
  searchTerm,
  onSearchChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  status,
  onStatusChange,
  statusOptions,
  emailVerified,
  onEmailVerifiedChange,
  onExport,
  addButton,
}: Props) => {
  return (
    <Flex
      css={{
        gap: "$8",
        py: "$8",
        px: "$8",
        bg: "$sidebarBg",
        borderRadius: "24px",
        mb: "$8",
        border: "1px solid $border",
        boxShadow: "$sm",
      }}
      justify={"between"}
      align={"center"}
      wrap={"wrap"}
    >
      <Flex
        css={{
          gap: "$6",
          flex: 1,
          minWidth: "300px",
        }}
        align={"center"}
        wrap={"wrap"}
      >
        <Input
          clearable
          bordered
          placeholder="Search teachers..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          contentLeft={
            <Search size={18} color="var(--nextui-colors-accents6)" />
          }
          css={{
            width: "100%",
            maxW: "300px",
            "& .nextui-input-wrapper": {
              borderRadius: "14px",
              border: "2px solid $border",
            },
          }}
        />

        {statusOptions && onStatusChange && (
          <Dropdown>
            <Dropdown.Button
              flat
              color="primary"
              css={{
                tt: "capitalize",
                borderRadius: "14px",
                height: "$14",
                px: "$8",
              }}
              iconRight={<ChevronDown size={16} />}
            >
              {status || "Status"}
            </Dropdown.Button>
            <Dropdown.Menu
              aria-label="Status Filter"
              onAction={onStatusChange}
              selectedKeys={status ? [status] : []}
              css={{ borderRadius: "16px" }}
            >
              {[{ key: "all", label: "All Status" }, ...statusOptions].map(
                (opt) => (
                  <Dropdown.Item key={opt.key}>{opt.label}</Dropdown.Item>
                ),
              )}
            </Dropdown.Menu>
          </Dropdown>
        )}

        {onEmailVerifiedChange && (
          <Dropdown>
            <Dropdown.Button
              flat
              color="primary"
              css={{
                tt: "capitalize",
                borderRadius: "14px",
                height: "$14",
                px: "$8",
              }}
              iconRight={<ChevronDown size={16} />}
            >
              {emailVerified === "true"
                ? "Verified"
                : emailVerified === "false"
                  ? "Not Verified"
                  : "Verification"}
            </Dropdown.Button>
            <Dropdown.Menu
              aria-label="Email Verification Filter"
              onAction={onEmailVerifiedChange}
              selectedKeys={emailVerified ? [emailVerified] : []}
              css={{ borderRadius: "16px" }}
            >
              <Dropdown.Item key="all">All Verification</Dropdown.Item>
              <Dropdown.Item key="true">Verified</Dropdown.Item>
              <Dropdown.Item key="false">Not Verified</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        )}

        {onStartDateChange && (
          <Flex
            align="center"
            css={{
              bg: "$accents1",
              borderRadius: "14px",
              px: "$4",
              height: "$14",
              border: "2px solid $border",
            }}
          >
            <Calendar size={18} color="var(--nextui-colors-primary)" />
            <Input
              type="date"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              css={{
                width: "140px",
                "& .nextui-input": { bg: "transparent" },
                "& .nextui-input-wrapper": { border: "none" },
              }}
            />
          </Flex>
        )}

        {onEndDateChange && (
          <Flex
            align="center"
            css={{
              bg: "$accents1",
              borderRadius: "14px",
              px: "$4",
              height: "$14",
              border: "2px solid $border",
            }}
          >
            <Calendar size={18} color="var(--nextui-colors-primary)" />
            <Input
              type="date"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              css={{
                width: "140px",
                "& .nextui-input": { bg: "transparent" },
                "& .nextui-input-wrapper": { border: "none" },
              }}
            />
          </Flex>
        )}
      </Flex>

      <Flex direction={"row"} css={{ gap: "$6" }} wrap={"wrap"}>
        {addButton}
        <Button
          auto
          color="primary"
          iconRight={<Download size={18} />}
          onClick={onExport}
          css={{
            borderRadius: "14px",
            height: "$14",
            px: "$10",
            fontWeight: "$bold",
          }}
        >
          Export
        </Button>
      </Flex>
    </Flex>
  );
};
