import { Table, Row, Spinner } from "@nextui-org/react";
import React, { useEffect, useState, useCallback } from "react";
import { Box } from "../styles/box";
import { columns } from "./data";
import { RenderCell } from "./render-cell";
import { getAllClasses, ClassSession } from "../../services/classes";

export const TableWrapper = () => {
  const [classes, setClasses] = useState<ClassSession[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClasses = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAllClasses();
      // The API wraps the payload as { success, data: [...] } (sometimes
      // { data: { data: [...] } }). Storing a non-array made the table crash
      // with "classes.map is not a function". Unwrap to the array defensively.
      const list = Array.isArray(res)
        ? res
        : (res?.data?.data ?? res?.data ?? []);
      setClasses(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error("Error fetching classes:", error);
      setClasses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const handleRefresh = () => {
    fetchClasses();
  };

  return (
    <Box
      css={{
        mt: "$8",
        "& .nextui-table-container": {
          boxShadow: "none",
        },
      }}
    >
      {loading ? (
        <Row justify="center" align="center" css={{ height: "400px" }}>
          <Spinner size="lg" />
        </Row>
      ) : (
        <Table
          aria-label="Classes table"
          css={{
            height: "auto",
            minWidth: "100%",
            boxShadow: "none",
            width: "100%",
            px: 0,
          }}
        >
          <Table.Header columns={columns}>
            {(column) => (
              <Table.Column
                key={column.uid}
                hideHeader={column.uid === "actions"}
                align={column.uid === "actions" ? "center" : "start"}
              >
                {column.name}
              </Table.Column>
            )}
          </Table.Header>
          <Table.Body items={classes}>
            {(item: ClassSession) => (
              <Table.Row key={item._id}>
                {(columnKey: React.Key) => (
                  <Table.Cell>
                    {RenderCell({
                      classItem: item,
                      columnKey: columnKey,
                      onRefresh: handleRefresh,
                    })}
                  </Table.Cell>
                )}
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      )}
    </Box>
  );
};
