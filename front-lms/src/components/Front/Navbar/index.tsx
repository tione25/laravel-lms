import {
  Box,
  Container,
  Flex,
} from "@chakra-ui/react";
import Logo from "./Logo";
import Navigation from "./Navigation";
import SearchModal from "./SearchModal";

const Navbar = () => {
  return (
    <>
      <Box bg="white" w="full" borderBottom="1px" borderBottomColor="gray.200" position="fixed" top="0" zIndex={99}>
        <Container maxW="container.xl">
          <Flex h={70} alignItems="center" justifyContent="space-between">
            <Logo />
            <Box display={{base: "none", "lg": "block"}}  w={{base: "flex", md: 400}}>
                <SearchModal />
            </Box>
            <Navigation />
          </Flex>
        </Container>
      </Box>
    </>
  );
};

export default Navbar;
