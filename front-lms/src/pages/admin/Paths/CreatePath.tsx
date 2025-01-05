import {
  Card,
  CardHeader,
  Flex,
  Icon,
  CardBody,
  Box,
  Text,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { PiPath } from "react-icons/pi";
import { client } from "../../../utils/client";
import Form from "./Form";

const CreatePath = () => {
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
              <Icon as={PiPath} fontSize={20} />
              <Text fontWeight="medium">Create Path</Text>
            </Flex>
          </CardHeader>

          <CardBody>
            {isPending && <Text>Loading...</Text>}

            {!isPending && <Form categories={categories.data} />}
          </CardBody>
        </Card>
      </Box>
    </>
  );
};

export default CreatePath;
