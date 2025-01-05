import { Divider, Flex, Heading, Text, Link as ChakraLink, Box } from "@chakra-ui/react";
import PasswordResetForm from "./PasswordResetForm";

import { Helmet } from 'react-helmet';

const PasswordReset = () => {
  return (
    <>
      <Helmet>
        <title>Password Reset | CourseCasts</title>
      </Helmet>

      <Flex flexDir="column" gap={2} maxW={"600px"} border="1px" borderColor="gray.300" p={4} py={6} rounded="md" mx="auto">
        <Heading fontSize="2xl">
            <Text>Password Reset</Text>
            <Divider my={4}/>
        </Heading>
        <PasswordResetForm />
      </Flex>
    </>
  );
};

export default PasswordReset;
