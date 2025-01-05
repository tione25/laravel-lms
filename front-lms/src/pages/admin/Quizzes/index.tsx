import { Card, CardHeader, Flex, Icon, Box, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { client } from "../../../utils/client";
import TableComponent from "../../../components/Table/TableComponent";
import { MdOutlineQuiz } from "react-icons/md";

const Quizzes = () => {
  const [pagination, setPagination] = useState({
    pageSize: 10,
    pageIndex: 0,
  });
  const [sorting, setSorting] = useState([{ id: "title", desc: "DESC" }]);

  const cols = [
    { id: "id", header: "ID", enableSorting: true },
    {
      id: "title",
      header: "title",
      enableSorting: true,
    },
  ];

  const {
    data: quizzes,
    isPending,
    error,
    refetch,
  } = useQuery({
    queryKey: ["QuizzesTableData", pagination, sorting],
    queryFn: async () => {
      const response = await client.get("/admin/quizzes", {
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
              <Icon as={MdOutlineQuiz} fontSize={20} />
              <Text fontWeight="medium">Quizzes</Text>
            </Flex>
          </CardHeader>
          <TableComponent
            data={quizzes?.data ?? []}
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

export default Quizzes;
