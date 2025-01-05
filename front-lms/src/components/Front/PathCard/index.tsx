import {
  Avatar,
  Box,
  Card,
  CardBody,
  Flex,
  Heading,
  Icon,
  Image,
  Progress,
  Text,
} from "@chakra-ui/react";
import { LiaBookReaderSolid } from "react-icons/lia";
import { CiBookmark, CiClock2 } from "react-icons/ci";
import { Link } from "react-router-dom";

interface PathCardProps {
  path: any;
  bgColor?: string
  bgHoverColor?: string
}

const PathCard = ({ path, bgColor, bgHoverColor }: PathCardProps) => {
  return (
    <>
      <Link to={`/paths/${path?.slug}`}>
        <Card
          variant="unstyled"
          w="full"
          cursor="pointer"
          p={3}
          _hover={{ bg: bgHoverColor ?? "red.50" }}
          bg={bgColor ?? "white"}
          transition="ease-in-out .2s"
        >
          <CardBody>
            <Box mb={4} position="relative">
              <Image
                boxSize="full"
                height={{ base: 300, md: 200 }}
                objectFit="cover"
                src={"https://sealms-api.levelcoding.com/storage/" + path?.preview_image}
                rounded={8}
                fallbackSrc="https://via.placeholder.com/150"
              />
              <Avatar
                position="absolute"
                size="lg"
                bottom={-8}
                right={5}
                border="2px"
                borderColor="white"
                src={'https://sealms-api.levelcoding.com/storage/' + path?.user?.profile_image}
              />
            </Box>

            {/* Category*/}
            <Box mb={2}>
              <Text color="gray.400" fontSize={17}>
                {path?.category?.name}
              </Text>
            </Box>

            {/* Tilte & Rating*/}
            <Flex gap={2} flexDir="column" mb={4}>
              <Heading as="h2" fontWeight="medium" fontSize={18} title={path?.title}>
                {path?.title}
              </Heading>
            </Flex>

            {/* Info*/}
            <Flex>
              <Flex gap={6}>
                <Flex alignItems="center" gap={2}>
                  <Icon
                    as={LiaBookReaderSolid}
                    fontSize={20}
                    color="gray.500"
                  />
                  <Text color="gray.500" fontSize="sm">
                    { path?.sections_count} sections
                  </Text>
                </Flex>
                <Flex alignItems="center" gap={2}>
                  <Icon as={CiBookmark} fontSize={20} color="gray.500" />
                  <Text color="gray.500" fontSize="sm">
                    {path?.courses_count} courses
                  </Text>
                </Flex>
              </Flex>
            </Flex>

            {typeof path.percentage_completed != "undefined" && path.percentage_completed >= 0 && path.path_current_user && (
              <Flex flexDir="column">
                <Progress
                  value={path.percentage_completed}
                  size="xs"
                  colorScheme="green"
                  my={2}
                  rounded={"md"}
                  hasStripe={true}
                />
                <Text color="green.500" fontSize="sm">
                  {(path.percentage_completed ?? 0).toFixed(0)}% complete
                </Text>
              </Flex>
            )}
          </CardBody>
        </Card>
      </Link>
    </>
  );
};

export default PathCard;
