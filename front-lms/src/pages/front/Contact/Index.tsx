import { Divider, Flex, Heading, Text } from "@chakra-ui/react";
import Form from "./Form";

import { Helmet } from 'react-helmet';

const Contact = () => {
  return (
    <>
      <Helmet>
        <title>Contact | CourseCasts</title>
      </Helmet>

      <Flex flexDir="column" gap={2} maxW={"600px"} border="1px" borderColor="gray.300" p={4} py={6} rounded="md" mx="auto">
        <Heading fontSize="2xl">
            <Text>Contact</Text>
            <Divider my={4}/>
        </Heading>
        <Form />
      </Flex>
    </>
  );
};

export default Contact;
