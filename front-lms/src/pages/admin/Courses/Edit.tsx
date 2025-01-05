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
import { CiBookmark } from "react-icons/ci";
import Form from "./Form";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { client } from "../../../utils/client";

const Edit = () => {
  const { id } = useParams();

  const {
    isPending,
    error,
    data: course,
  } = useQuery({
    queryKey: ["Course", id],
    queryFn: async () => {
      return await client
        .get("/admin/courses/" + id)
        .then((response) => response.data);
    },
  });

  const {
    isPending: categoriesIsPending,
    error: categoriesError,
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
              <Icon as={CiBookmark} fontSize={20} />
              <Text fontWeight="medium">Edit Course</Text>
            </Flex>
          </CardHeader>

          {isPending || categoriesIsPending ? (
            <Flex w="100%" alignItems="center" justifyContent="center">
              <Spinner size="lg" color="gray.200" />
            </Flex>
          ) : (
            <CardBody>
              <Form course={course.data} categories={categories.data} />
            </CardBody>
          )}
        </Card>
      </Box>
    </>
  );
};

export default Edit;
