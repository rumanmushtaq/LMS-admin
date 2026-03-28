import { Button, Input, Dropdown, Text } from "@nextui-org/react";
import React from "react";
import { Flex } from "../styles/flex";
import { ExportIcon } from "../icons/accounts/export-icon";

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
  onExport,
  addButton,
}: Props) => {
  return (
    <Flex
      css={{
        gap: "$8",
        py: "$6",
        px: "$6",
        bg: "$accents0",
        borderRadius: "$xl",
        mb: "$6",
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
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          css={{ width: "100%", maxW: "400px" }}
        />

        {statusOptions && onStatusChange && (
          <Dropdown>
            <Dropdown.Button flat color="secondary" css={{ tt: "capitalize" }}>
              {status || "All Status"}
            </Dropdown.Button>
            <Dropdown.Menu
              aria-label="Status Filter"
              onAction={onStatusChange}
              selectedKeys={status ? [status] : []}
            >
              {[{ key: "all", label: "All Status" }, ...statusOptions].map((opt) => (
                <Dropdown.Item key={opt.key}>{opt.label}</Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        )}

        {onStartDateChange && (
          <Input
            type="date"
            bordered
            labelLeft="From"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            css={{ maxW: "180px" }}
          />
        )}

        {onEndDateChange && (
          <Input
            type="date"
            bordered
            labelLeft="To"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            css={{ maxW: "180px" }}
          />
        )}
      </Flex>

      <Flex direction={"row"} css={{ gap: "$6" }} wrap={"wrap"}>
        {addButton}
        <Button auto flat iconRight={<ExportIcon />} onClick={onExport} css={{ bg: '#7047EB', color: '$white' }}>
          Export
        </Button>
      </Flex>
    </Flex>
  );
};
