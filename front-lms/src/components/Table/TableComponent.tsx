import {
  TableContainer,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Table,
  Box,
  Button,
  HStack,
  Icon,
  Flex,
  Spinner,
} from "@chakra-ui/react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";

const columnHelper = createColumnHelper();

const TableComponent = ({
  cols,
  data,
  loading,
  onPaginationChange,
  onSortingChange,
  pagination,
  sorting,
}) => {
  const columns = useMemo(
    () =>
      cols.map(({ id, header, enableSorting, cell }) => {
        const temp = {
          ...columnHelper.accessor(id, {
            header,
          }),
          enableSorting,
        };

        if (cell) {
          temp.cell = cell;
        }

        return temp;
      }),
    [cols]
  );

  const tableLib = useReactTable({
    data: data?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: { pagination, sorting },
    manualPagination: true,
    onPaginationChange,
    onSortingChange,
    pageCount: data?.last_page,
  });

  return (
    <>
      <TableContainer>
        <Table variant="simple" size="md">
          <Thead bg="gray.50">
            {tableLib.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Th
                    key={header.id}
                    {...(header.column.getCanSort()
                      ? { onClick: header.column.getToggleSortingHandler() }
                      : {})}
                    py={5}
                  >
                    <Flex display={"flex"} alignItems="center" gap={1}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}

                      {header.column.getIsSorted() === "asc" && !loading ? (
                        <Icon as={FaSortUp} />
                      ) : header.column.getIsSorted() === "desc" && !loading ? (
                        <Icon as={FaSortDown} />
                      ) : header.column.getCanSort() ? (
                        <Icon as={FaSort} />
                      ) : null}
                    </Flex>
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>

          <Tbody>
            {loading ? (
              <Tr width="100%">
                <td width="100%">
                  <Flex
                    w="100%"
                    h={36}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Spinner size="lg" color="gray.200" />
                  </Flex>
                </td>
              </Tr>
            ) : (
              tableLib.getRowModel().rows.map((row) => (
                <Tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <Td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </Td>
                  ))}
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </TableContainer>
      <Box
        px={4}
        py={4}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <HStack spacing={4}>
          <Button
            disabled={!tableLib.getCanPreviousPage()}
            onClick={() => tableLib.setPageIndex(0)}
          >
            {"<<"}
          </Button>
          <Button
            disabled={!tableLib.getCanPreviousPage()}
            onClick={tableLib.previousPage}
          >
            Previous
          </Button>
          <p>
            {`page ${
              tableLib.getState().pagination.pageIndex + 1
            } of ${tableLib.getPageCount()}`}
          </p>
          <Button
            disabled={!tableLib.getCanNextPage()}
            onClick={tableLib.nextPage}
          >
            Next
          </Button>
          <Button
            disabled={!tableLib.getCanNextPage()}
            onClick={() => tableLib.setPageIndex(tableLib.getPageCount() - 1)}
          >
            {">>"}
          </Button>
        </HStack>
      </Box>
    </>
  );
};

export default TableComponent;
