import {
  Card,
  CardHeader,
  Flex,
  Icon,
  Box,
  Text,
  Link as ChakraLink,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { CiBookmark, CiSearch } from "react-icons/ci";
import { client } from "../../../utils/client";
import TableComponent from "../../../components/Table/TableComponent";
import { useDebounce } from "../../../services/useDebounce";

const Users = () => {
  const [pagination, setPagination] = useState({
    pageSize: 10,
    pageIndex: 0,
  });
  const [sorting, setSorting] = useState([{ id: "id", desc: "DESC" }]);
  const [query, setQuery] = useState("");
  const searchQuery = useDebounce(query, 200);

  const cols = [
    { id: "id", header: "ID", enableSorting: true },
    {
      id: "name",
      header: "name",
      enableSorting: true,
    },
    { id: "email", header: "Email", enableSorting: true },
  ];

  const { data: users, isFetching } = useQuery({
    queryKey: ["UsersTableData", pagination, sorting, query],
    queryFn: async () => {
      const response = await client.get("/admin/users", {
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
              <Text fontWeight="medium">Users</Text>
            </Flex>
            <Flex alignItems="center" gap={4}>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={CiSearch} color="gray.300" />
                </InputLeftElement>
                <Input
                  type="text"
                  placeholder="Search users..."
                  onChange={(e) => setQuery(e.target.value)}
                />
              </InputGroup>
              <ChakraLink href="/admin/users/create">
                <Button colorScheme="messenger">New User</Button>
              </ChakraLink>
            </Flex>
          </CardHeader>
          <TableComponent
            data={users?.data ?? []}
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

export default Users;
