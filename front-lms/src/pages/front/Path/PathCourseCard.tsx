import {
  Card,
  Image,
  Box,
  Text,
  Heading,
  Flex,
  Link as ChakraLink,
  Progress,
} from "@chakra-ui/react";
import Star from "../../../components/Front/StarRating/Star";

interface PathCourseCardProps {
  course: any;
}

const PathCourseCard = ({ course }: PathCourseCardProps) => {
  return (
    <>
      <Card
        as={ChakraLink}
        variant="unstyled"
        w="full"
        cursor="pointer"
        p={3}
        _hover={{ bg: "teal.50", textDecor: "none" }}
        transition="ease-in-out .2s"
        display="flex"
        flexDir={{ base: "column", md: "row" }}
        gap={6}
        href={`/courses/${course.slug}`}
      >
        <Box position="relative" flexShrink="0">
          <Image
            boxSize="full"
            height={{ base: 300, md: 200 }}
            width={{ base: "full", md: 200 }}
            objectFit="cover"
            src={"https://sealms-api.levelcoding.com/storage/" + course?.preview_image}
            rounded={8}
            fallbackSrc="https://via.placeholder.com/150"
          />
        </Box>

        <Flex flexDir="column" w="full">
          <Box mb={2}>
            <Text color="gray.400" fontSize={17}>
              {course?.category?.name}
            </Text>
          </Box>

          {/* Tilte & Rating*/}
          <Flex gap={2} flexDir="column" mb={2}>
            <Heading
              as="h2"
              fontWeight="medium"
              fontSize={20}
              title={course?.title}
            >
              {course?.title}
            </Heading>
            <Flex gap={4}>
              <Star rating={3} setRating={() => {}} canHover={false} />
              <Text color="gray.500" fontSize="sm">
               
              </Text>
            </Flex>
          </Flex>

          <Box>
            <Text color="gray.600">{course.short_description}</Text>
          </Box>
          {course?.enrollments?.[0]?.percentage_completed >= 0 && (
            <Flex flexDir="column" mt="auto" w="full">
              <Progress
                value={course?.enrollments?.[0].percentage_completed}
                size="sm"
                colorScheme="green"
                my={2}
                rounded={"md"}
                hasStripe={true}
              />
              <Text color="green.500" fontSize="sm">
                {course?.enrollments?.[0].percentage_completed}% complete
              </Text>
            </Flex>
          )}
        </Flex>

      </Card>
    </>
  );
};

export default PathCourseCard;
