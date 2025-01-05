import { Divider, Flex, Heading, Text, Link as ChakraLink, Box } from "@chakra-ui/react";
import PasswordResetConfirmForm from "./PasswordResetConfirmForm";

import { Helmet } from 'react-helmet';

const Login = () => {
  return (
    <>
      <Helmet>
        <title>Password Reset | CourseCasts</title>
      </Helmet>


      <Flex flexDir="column" gap={2} maxW={"600px"} border="1px" borderColor="gray.300" p={4} py={6} rounded="md" mx="auto">
        <Heading fontSize="2xl">
            <Text>Reset Your Password </Text>
            <Divider my={4}/>
        </Heading>
        <PasswordResetConfirmForm />
      </Flex>
    </>
  );
};

export default Login;
