import { useQuery } from "@tanstack/react-query";
import { client } from "../../../utils/client";
import { Flex, Heading, SimpleGrid, Spinner, Link as ChakraLink } from "@chakra-ui/react";
import CourseCard from "../CourseCard";

const LatestCourses = () => {
  type Course = {
    id: number;
    title: string;
    preview_image: string;
  };
  const { data: latestCourses, isPending } = useQuery({
    queryKey: ["LatestCourses"],
    queryFn: async () => {
      return client.get("/latest-courses").then((response) => response.data);
    },
  });

  return (
    <>
      <Flex flexDir="column" w="full">
        {isPending && (
          <Flex w="100%" alignItems="center" justifyContent="center">
            <Spinner size="lg" color="gray.200" />
          </Flex>
        )}
        {!isPending && latestCourses?.data?.length != 0 && (
          <>
            <Flex justifyContent="space-between" alignItems="center" mb={12}>
              <Heading fontWeight={"medium"}>
                Latest Courses
              </Heading>
              <ChakraLink href="/library">
                View All
              </ChakraLink>
            </Flex>
            <SimpleGrid columns={{ base: 1, md: 3, xl: 3 }} spacing={8}>
              {latestCourses?.data?.map((course: Course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </SimpleGrid>
          </>
        )}
      </Flex>
    </>
  );
};

export default LatestCourses;
