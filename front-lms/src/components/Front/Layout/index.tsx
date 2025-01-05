import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../Navbar";
import { Container, Link as ChakraLink, Flex, Box, Text } from "@chakra-ui/react";
import { getUser } from "../../../services/useGetUser";
import { useEffect } from "react";

const Layout = () => {
  const { data: user, isPending } = getUser();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <>
      <>
        {(location.pathname === "/" && !user) && (<Box position="absolute" bg="url(grid.svg)" w="full" top={-120} h={500}>
          <Box bgGradient='linear(to-b, transparent, white)' h={500}></Box>
        </Box>)}
        <Navbar />

        <Container maxW="container.xl" position="sticky" mt={32}>
          <Outlet />
        </Container>
        
        <Box py={2} mt={10}>
          <Container
            maxW="container.xl"
            textAlign="center"
            color="gray.500"
          >
            <Flex gap={4} w="full" justifyContent="center" mb={4}>
              <ChakraLink href="/contact">Contact</ChakraLink>
              <ChakraLink href="/library">Library</ChakraLink>
              <ChakraLink href="/paths">Path</ChakraLink>
            </Flex>
            <Text fontSize="sm" mb={4}>&copy; All rights reserved.</Text>
          </Container>
        </Box>
      </>
    </>
  );
};

export default Layout;
