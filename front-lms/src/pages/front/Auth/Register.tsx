import { Divider, Flex, Heading, Text, Box,  Link as ChakraLink } from "@chakra-ui/react";
import RegisterForm from "./RegisterForm";

import { Helmet } from 'react-helmet';


const Register = () => {
  return (
    <>
      <Helmet>
        <title>Join us today and start learning | CourseCasts</title>
      </Helmet>

      <Flex
        flexDir="column"
        gap={2}
        maxW={"600px"}
        border="1px"
        borderColor="gray.300"
        p={4}
        py={6}
        rounded="md"
        mx="auto"
      >
        <Heading fontSize="2xl">
          <Text>Join us today!</Text>
          <Divider my={4} />
        </Heading>
        <RegisterForm />
        <Box mt={1} textAlign="center">
          <Text>Already have an account? <ChakraLink href="/login">Sign In</ChakraLink></Text>
        </Box>
      </Flex>
    </>
  );
};

export default Register;
