import { Box, Flex, Heading, Text } from "@chakra-ui/react";

interface SimpleHeroProps {
  title: string;
  description?: string | undefined;
}

const SimpleHero = ({ title, description }: SimpleHeroProps) => {
  return (
    <>
      <Flex
        alignItems="center"
        justifyContent="center"
        height={{ base: 50, md: 100 }}
        mb={10}
        flexDir="column"
      >
        <Heading fontSize={{ base: "4xl", md: "5xl" }} fontWeight={"medium"}>
          {title}
        </Heading>
        {description && (
          <Box my={2} maxW={"4xl"}>
            <Text textAlign="center">{description}</Text>
          </Box>
        )}
      </Flex>
    </>
  );
};

export default SimpleHero;
