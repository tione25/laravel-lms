import {
  Box,
  Flex,
  Grid,
  GridItem,
  Heading,
  Icon,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import Hero from "../../components/Front/ui/Hero";
import LatestCourses from "../../components/Front/ui/LatestCourses";
import { getUser } from "../../services/useGetUser";
import { MdAccessTime, MdDone } from "react-icons/md";
import CourseCard from "../../components/Front/CourseCard";
import PathCard from "../../components/Front/PathCard";
import LatestPaths from "../../components/Front/ui/LatestPaths";
import Categories from "../../components/Front/ui/Categories";

const Home = () => {
  const { data: user, isPending } = getUser();

  return (
    <>
      {!user && (
        <Box>
          <Box>
            <Hero />
          </Box>
          <Flex flexDir="column" mb={100} gap={14}>
            <LatestCourses />
            <LatestPaths />
            <Categories />
          </Flex>
        </Box>
      )}
      {user && !isPending && (
        <>
          <Grid templateColumns={{base: "repeat(1, 1fr)", md: "repeat(2, 1fr)"}} gap={{base: 14, md: 6}}>
            <GridItem w="100%" h="10">
              <Flex
                gap={2}
                border="1px"
                borderColor="gray.100"
                rounded="md"
                p={2.5}
              >
                <Flex
                  alignItems="center"
                  justifyContent="center"
                  bg="blue.50"
                  rounded="full"
                  w={14}
                  h={14}
                >
                  <Icon as={MdAccessTime} fill="blue.500" fontSize={40} />
                </Flex>
                <Flex flexDir="column">
                  <Text fontWeight="medium">In Progress</Text>
                  <Text color="gray.500">{user && (user?.course_enrollments_progress ?? 0)} courses</Text>
                </Flex>
              </Flex>
            </GridItem>
            <GridItem w="100%" h="10">
              <Flex
                gap={2}
                border="1px"
                borderColor="gray.100"
                rounded="md"
                p={2.5}
              >
                <Flex
                  alignItems="center"
                  justifyContent="center"
                  bg="green.50"
                  rounded="full"
                  w={14}
                  h={14}
                >
                  <Icon as={MdDone} fill="green.500" fontSize={40} />
                </Flex>
                <Flex flexDir="column">
                  <Text fontWeight="medium">Completed</Text>
                  <Text color="gray.500">{user && (user.course_enrollments_completed ?? 0)} courses</Text>
                </Flex>
              </Flex>
            </GridItem>
          </Grid>

          <Box my={20}>
            <Heading fontSize="2xl" fontWeight="normal" mb={6}>
              Courses Overview...
            </Heading>
            {!isPending && user && (
              <>
                {user?.enrollments?.length >= 0 && (
                  <SimpleGrid columns={{ base: 1, md: 3, xl: 4 }} spacing={8} p={1} px={2} rounded={"md"}>
                    {user?.enrollments?.reverse()?.slice(0, 4)?.map((enrollment) => (
                      <CourseCard
                        key={enrollment.id}
                        course={enrollment.course}
                        percentage={enrollment.percentage_completed}
                      />
                    ))}
                  </SimpleGrid>
                )}
                {!user?.enrollments?.length && (
                  <Text>Start learning today with us...</Text>
                )}
              </>
            )}
          </Box>

          <Box my={20}>
            <Heading fontSize="2xl" fontWeight="normal" mb={6}>
              Paths Overview...
            </Heading>
            {!isPending && user && (
              <>
                {user?.user_paths?.length >= 0 && (
                  <SimpleGrid columns={{ base: 1, md: 3, xl: 4 }} spacing={8} p={1} px={2} rounded={"md"}>
                    {user?.user_paths?.reverse()?.slice(0, 4)?.map((path) => (
                      <PathCard
                        key={path.id}
                        path={path}
                      />
                    ))}
                  </SimpleGrid>
                )}
                {!user?.user_paths?.length && (
                  <Text>Start learning today with us...</Text>
                )}
              </>
            )}
          </Box>
        </>
      )}
    </>
  );
};

export default Home;
