import { Box, Text, Icon, Link as ChakraLink } from "@chakra-ui/react";
import { SiPhpmyadmin } from "react-icons/si";

const Logo = () => {
  return (
    <>
      <ChakraLink href="/" display="flex" alignItems="center" gap={1} _hover={{textDecor: "none"}}>
        <Icon as={SiPhpmyadmin} fontSize={40} />
        <Text fontWeight="bold" fontSize={20}>
          CourseCasts
        </Text>
      </ChakraLink>
    </>
  );
};

export default Logo;
