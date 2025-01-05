import {
  Card,
  CardHeader,
  Flex,
  Icon,
  CardBody,
  Box,
  Text,
} from "@chakra-ui/react";
import { CiBookmark } from "react-icons/ci";
import Form from "./Form";
import { useQuery } from "@tanstack/react-query";
import { client } from "../../../utils/client";

const Create = () => {
  const {
    isPending,
    error,
    data: categories,
  } = useQuery({
    queryKey: ["Categories"],
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
              <Text fontWeight="medium">Create Course</Text>
            </Flex>
          </CardHeader>

          {isPending && <Text>Loading...</Text>}

          {!isPending && (
            <CardBody>
              <Form categories={categories.data} />
            </CardBody>
          )}
        </Card>
      </Box>
    </>
  );
};

export default Create;
