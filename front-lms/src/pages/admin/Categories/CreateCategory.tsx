import {
  Box,
  Card,
  Text,
  CardBody,
  CardHeader,
  Flex,
  Icon,
} from "@chakra-ui/react";
import { CiBookmark } from "react-icons/ci";
import Form from "./Form";

const EditCategory = () => {
  return (
    <>
      <Box>
        <Card variant="outline" mb={10}>
          <CardHeader>
            <Flex alignItems="center" gap={2}>
              <Icon as={CiBookmark} fontSize={20} />
              <Text fontWeight="medium">Create Category</Text>
            </Flex>
          </CardHeader>


          <CardBody>
            <Form />
          </CardBody>
        </Card>
      </Box>
    </>
  );
};

export default EditCategory;
