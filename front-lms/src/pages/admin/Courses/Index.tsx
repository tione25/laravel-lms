import {
  Card,
  CardHeader,
  Flex,
  Icon,
  Box,
  Text,
  Link as ChakraLink,
  Button,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { CiBookmark, CiSearch } from "react-icons/ci";
import { client } from "../../../utils/client";
import TableComponent from "../../../components/Table/TableComponent";
import { FaEdit } from "react-icons/fa";
import { HiDotsHorizontal } from "react-icons/hi";
import DeleteDialog from "./DeleteDialog";
import { useDebounce } from "../../../services/useDebounce";

const Courses = () => {
  const [pagination, setPagination] = useState({
    pageSize: 10,
    pageIndex: 0,
  });
  const [sorting, setSorting] = useState([{ id: "title", desc: "DESC" }]);
  const [query, setQuery] = useState("");
  const searchQuery = useDebounce(query, 200);

  const cols = [
    { id: "id", header: "ID", enableSorting: true },
    {
      id: "title",
      header: "Title",
      enableSorting: true,
    },
    { id: "status", header: "Status", enableSorting: true },
    {
      header: "Actions",
      accesorKey: "actions",
      enableSorting: false,
      cell: ({ getValue, row, column, table }) => {
        return (
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Options"
              icon={<HiDotsHorizontal />}
              variant="outline"
              border="none"
              h={5}
              _hover={{ bg: "transparent" }}
              _active={{ bg: "transparent" }}
            />
            <MenuList>
              <MenuItem
                icon={<FaEdit />}
                as={ChakraLink}
                href={`/admin/courses/edit/${row.original.id}`}
                _hover={{ textDecoration: "none" }}
              >
                Edit
              </MenuItem>
              <DeleteDialog course={row.original.id} />
            </MenuList>
          </Menu>
        );
      },
    },
  ];

  const {
    data: courses,
    isFetching,
    error,
    refetch,
  } = useQuery({
    queryKey: ["CoursesTableData", pagination, sorting, searchQuery],
    queryFn: async () => {
      const response = await client.get("/admin/courses", {
        params: {
          page: pagination.pageIndex + 1,
          size: pagination.pageSize,
          orderBy: sorting[0].id,
          order: sorting[0].desc ? "desc" : "asc",
          search: query,
        },
      });
      return response;
    },
    enabled: true,
  });

  return (
    <>
      <Box>
        <Card variant="outline">
          <CardHeader display="flex" justifyContent="space-between">
            <Flex alignItems="center" gap={2}>
              <Icon as={CiBookmark} fontSize={20} />
              <Text fontWeight="medium">Courses</Text>
            </Flex>
            <Flex alignItems="center" gap={4}>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={CiSearch} color="gray.300" />
                </InputLeftElement>
                <Input
                  type="text"
                  placeholder="Search courses..."
                  onChange={(e) => setQuery(e.target.value)}
                />
              </InputGroup>
              <ChakraLink href="/admin/courses/create">
                <Button colorScheme="messenger">New Course</Button>
              </ChakraLink>
            </Flex>
          </CardHeader>
          <TableComponent
            data={courses?.data ?? []}
            cols={cols}
            onPaginationChange={setPagination}
            onSortingChange={setSorting}
            loading={isFetching}
            pagination={pagination}
            sorting={sorting}
          />
        </Card>
      </Box>
    </>
  );
};

export default Courses;