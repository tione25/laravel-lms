import {
  Box,
  Button,
  Stack,
  chakra,
  Text,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { FaGithub, FaRegUser } from "react-icons/fa";
import { MdOutlineExplore } from "react-icons/md";

const Hero = () => {
  return (
    <>
      <Stack direction="column" spacing={6} alignItems="center" my={20}>
        <chakra.h1
          fontSize={{ base: "4xl", sm: "5xl" }}
          fontWeight="bold"
          textAlign="center"
          maxW="600px"
        >
          Explore our library and learn{" "}
          <chakra.span
            color="teal"
            bg="linear-gradient(transparent 50%, #83e9e7 50%)"
          >
            with speed
          </chakra.span>
        </chakra.h1>
        <Text maxW="550px" fontSize="xl" textAlign="center" color="gray.500">
          SeaLMS is a micro learning management system designed for small
          business and people who have a passion for teaching but can't find the
          right platform to fulfill their dream.
        </Text>
        <Stack
          direction={{ base: "column", sm: "row" }}
          w={{ base: "100%", sm: "auto" }}
          spacing={5}
        >
          <Button
            as={ChakraLink}
            leftIcon={<MdOutlineExplore />}
            colorScheme="teal"
            variant="outline"
            rounded="md"
            size="lg"
            height="3.5rem"
            fontSize="1.3rem"
            bg="white"
            href={'/library'}
            _hover={{textDecor: "none"}}
          >
            Explore
          </Button>
          <Button
            as={ChakraLink}
            leftIcon={<FaRegUser />}
            colorScheme="gray"
            variant="outline"
            rounded="md"
            size="lg"
            height="3.5rem"
            fontSize="1.3rem"
            bg="white"
            href={'/signup'}
            _hover={{textDecor: "none"}}
          >
            Join
          </Button>
        </Stack>
      </Stack>
    </>
  );
};

export default Hero;
