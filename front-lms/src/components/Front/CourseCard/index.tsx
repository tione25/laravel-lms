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
import Star from "../StarRating/Star";
import { LiaBookReaderSolid } from "react-icons/lia";
import { CiClock2 } from "react-icons/ci";
import { Link } from "react-router-dom";

interface CourseCardProps {
  course: any;
  bgColor?: string;
  bgHoverColor?: string;
  enrollment?: any;
  percentage?: number;
}

const CourseCard = ({
  course,
  bgColor,
  bgHoverColor,
  percentage,
}: CourseCardProps) => {
  return (
    <>
      <Link to={`/courses/${course?.slug}`}>
        <Card
          variant="unstyled"
          w="full"
          cursor="pointer"
          p={3}
          _hover={{ bg: bgHoverColor ?? "teal.50" }}
          transition="ease-in-out .2s"
          bg={bgColor ?? "white"}
        >
          <CardBody>
            <Box mb={4} position="relative">
              <Image
                boxSize="full"
                height={{ base: 300, md: 200 }}
                objectFit="cover"
                src={
                  "https://sealms-api.levelcoding.com/storage/" +
                  course?.preview_image
                }
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
                src={'https://sealms-api.levelcoding.com/storage/' + course?.user?.profile_image}
              />
            </Box>

            {/* Category*/}
            <Box mb={2}>
              <Text color="gray.400" fontSize={17}>
                {course?.category?.name}
              </Text>
            </Box>

            {/* Tilte & Rating*/}
            <Flex gap={2} flexDir="column" mb={4}>
              <Heading
                as="h2"
                fontWeight="medium"
                fontSize={18}
                title={course?.title}
              >
                {course?.title}
              </Heading>
              <Flex gap={4}>
                <Star rating={course?.feedback_rating ?? 0} setRating={() => {}} canHover={false} />
              </Flex>
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
                    {course?.sections_count ?? course?.course_sections_num}{" "}
                    sections
                  </Text>
                </Flex>
                <Flex alignItems="center" gap={2}>
                  <Icon as={CiClock2} fontSize={20} color="gray.500" />
                  <Text color="gray.500" fontSize="sm">
                    On going
                  </Text>
                </Flex>
              </Flex>
            </Flex>

            {typeof percentage != "undefined" && percentage >= 0 && (
              <Flex flexDir="column">
                <Progress
                  value={percentage}
                  size="xs"
                  colorScheme="green"
                  my={2}
                  rounded={"md"}
                  hasStripe={true}
                />
                <Text color="green.500" fontSize="sm">
                  {(percentage ?? 0).toFixed(0)}% complete
                </Text>
              </Flex>
            )}
          </CardBody>
        </Card>
      </Link>
    </>
  );
};

export default CourseCard;
