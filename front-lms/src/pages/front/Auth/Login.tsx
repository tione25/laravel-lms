import { Divider, Flex, Heading, Text, Link as ChakraLink, Box } from "@chakra-ui/react";
import LoginForm from "./LoginForm";

import { Helmet } from 'react-helmet';

const Login = () => {
  return (
    <>
      <Helmet>
        <title>Sign In | CourseCasts</title>
      </Helmet>

      <Flex flexDir="column" gap={2} maxW={"600px"} border="1px" borderColor="gray.300" p={4} py={6} rounded="md" mx="auto">
        <Heading fontSize="2xl">
            <Text>Sign In</Text>
            <Divider my={4}/>
        </Heading>
        <LoginForm />
        <Box mt={1} textAlign="center">
          <Text>Don't have an account? <ChakraLink href="/signup">Sign Up</ChakraLink></Text>
          <Text><ChakraLink href="/password/reset">Forgot your password? </ChakraLink></Text>
        </Box>
      </Flex>
    </>
  );
};

export default Login;
