import { useQuery } from "@tanstack/react-query";
import { client } from "../../../utils/client";
import { Flex, Heading, SimpleGrid, Spinner, Link as ChakraLink } from "@chakra-ui/react";
import CourseCard from "../CourseCard";

interface RelatedCoursesProps {
  category_id: number
  course_id: number
}

const RelatedCourses = ({ course_id, category_id }: RelatedCoursesProps) => {
  type Course = {
    id: number;
    title: string;
    preview_image: string;
  };
  const { data: relatedCourses, isPending } = useQuery({
    queryKey: ["RelatedCourses"],
    queryFn: async () => {
      return client.get(`/related-courses/${course_id}/${category_id}`).then((response) => response.data);
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
        {!isPending && relatedCourses?.data?.length != 0 && (
          <>
            <Flex justifyContent="space-between" alignItems="center" mb={12}>
              <Heading fontWeight={"medium"} fontSize="2xl">
                Related Courses
              </Heading>
            </Flex>
            <SimpleGrid columns={{ base: 1, md: 3, xl: 3 }} spacing={8}>
              {relatedCourses?.data?.map((course: Course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </SimpleGrid>
          </>
        )}
      </Flex>
    </>
  );
};

export default RelatedCourses;
