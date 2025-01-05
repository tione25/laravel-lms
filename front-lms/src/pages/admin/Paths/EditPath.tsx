import {
  Card,
  CardHeader,
  Flex,
  Icon,
  CardBody,
  Box,
  Text,
  Spinner,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { PiPath } from "react-icons/pi";
import { client } from "../../../utils/client";
import Form from "./Form";
import { useParams } from "react-router-dom";

const EditPath = () => {
  const { id } = useParams();

  const {
    isPending,
    error,
    data: path,
    status,
  } = useQuery({
    queryKey: ["Path", id],
    queryFn: async () => {
      return await client
        .get("/admin/paths/" + id)
        .then((response) => response.data);
    },
  });
  
  const {
    isPending: isPendingCategories,
    error: errorCategories,
    data: categories,
  } = useQuery({
    queryKey: ["Categories", id],
    queryFn: async () => {
      return await client.get("/categories").then((response) => response.data);
    },
  });

  return (
    <>
      <Box>
        <Card variant="outline" mb={10}>
          <CardHeader>
            <Flex alignItems="center" gap={2}>
              <Icon as={PiPath} fontSize={20} />
              <Text fontWeight="medium">Edit Path</Text>
            </Flex>
          </CardHeader>

          <CardBody>
            {isPendingCategories || isPending ? (
              <Flex w="100%" alignItems="center" justifyContent="center">
                <Spinner size="lg" color="gray.200" />
              </Flex>
            ) : (
              <Form path={path} categories={categories.data} />
            )}
          </CardBody>
        </Card>
      </Box>
    </>
  );
};

export default EditPath;
