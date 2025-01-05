import { useParams } from "react-router-dom";
import { client } from "../../../utils/client";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  Card,
  Text,
  CardBody,
  CardHeader,
  Flex,
  Icon,
  Spinner,
} from "@chakra-ui/react";
import { CiBookmark } from "react-icons/ci";
import Form from "./Form";

const EditCategory = () => {
  const { id } = useParams();

  const {
    isPending,
    error,
    data: category,
  } = useQuery({
    queryKey: ["Category", id],
    queryFn: async () => {
      return await client
        .get(`/admin/categories/${id}`)
        .then((response) => response.data);
    },
  });

  return (
    <>
      <Box>
        <Card variant="outline" mb={10}>
          <CardHeader>
            <Flex alignItems="center" gap={2}>
              <Icon as={CiBookmark} fontSize={20} />
              <Text fontWeight="medium">Edit Category</Text>
            </Flex>
          </CardHeader>

          {isPending && (
            <Flex w="100%" alignItems="center" justifyContent="center">
              <Spinner size="lg" color="gray.200" />
            </Flex>
          )}

          <CardBody>{!isPending && category && (<><Form category={category}/></>)}</CardBody>
        </Card>
      </Box>
    </>
  );
};

export default EditCategory;
