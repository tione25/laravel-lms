import {
  Card,
  CardHeader,
  Flex,
  Icon,
  Box,
  Text,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Link as ChakraLink,
  Button,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { client } from "../../../utils/client";
import TableComponent from "../../../components/Table/TableComponent";
import { MdOutlineCategory, MdOutlineDelete } from "react-icons/md";
import { FaEdit, FaRegTrashAlt } from "react-icons/fa";
import { HiDotsHorizontal } from "react-icons/hi";
import DeleteDialog from "./DeleteDialog";

const Categories = () => {
  const [pagination, setPagination] = useState({
    pageSize: 10,
    pageIndex: 0,
  });
  const [sorting, setSorting] = useState([{ id: "name", desc: "DESC" }]);

  const cols = [
    { id: "id", header: "ID", enableSorting: true },
    {
      id: "name",
      header: "name",
      enableSorting: true,
    },
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
                href={`/admin/categories/edit/${row.original.id}`}
                _hover={{ textDecoration: "none" }}
              >
                Edit
              </MenuItem>
              <DeleteDialog category={row.original.id}/>

            </MenuList>
          </Menu>
        );
      },
    },
  ];

  const {
    data: categories,
    isPending,
    error,
    refetch,
  } = useQuery({
    queryKey: ["CategoriesTableData", pagination, sorting],
    queryFn: async () => {
      const response = await client.get("/admin/categories", {
        params: {
          page: pagination.pageIndex + 1,
          size: pagination.pageSize,
          orderBy: sorting[0].id,
          order: sorting[0].desc ? "desc" : "asc",
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
              <Icon as={MdOutlineCategory} fontSize={20} />
              <Text fontWeight="medium">Categories</Text>
            </Flex>
            <Flex>
              <ChakraLink href="/admin/categories/create">
                <Button colorScheme="messenger">New Category</Button>
              </ChakraLink>
            </Flex>
          </CardHeader>
          <TableComponent
            data={categories?.data ?? []}
            cols={cols}
            onPaginationChange={setPagination}
            onSortingChange={setSorting}
            loading={isPending}
            pagination={pagination}
            sorting={sorting}
          />
        </Card>
      </Box>
    </>
  );
};

export default Categories;
