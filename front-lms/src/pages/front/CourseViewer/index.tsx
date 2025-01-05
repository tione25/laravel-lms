import { Navigate, useParams } from "react-router-dom";
import getCourse from "../../../api/front/courses";
import { useQuery } from "@tanstack/react-query";
import {
  Flex,
  Text,
  Link as ChakraLink,
  Icon,
  Box,
  Spinner,
} from "@chakra-ui/react";
import CourseSections from "./Partials/CourseSections";
import { IoLogOutOutline } from "react-icons/io5";
import LessonContent from "./Partials/LessonContent";

import { Helmet } from 'react-helmet';

const CourseViewer = () => {
  const { slug, section, lesson } = useParams();

  const {
    data: course,
    isPending: isCoursePending,
    isError,
  } = useQuery({
    queryKey: ["Course", slug, section, lesson],
    queryFn: () => getCourse(slug),
    retry: 0,
  });

  if (isError) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <Helmet>
        <title>{(course?.title ?? '') + ' | CourseCasts'}</title>
      </Helmet>

      {isCoursePending ? (
        <Flex
          minH={"100vh"}
          w="100%"
          alignItems="center"
          justifyContent="center"
        >
          <Spinner size="lg" color="gray.300" />
        </Flex>
      ) : (
        <>
          <Flex
            minH="100vh"
            w="full"
            position="relative"
            bg="white"
            py={0}
            overflowX="hidden"
            overflowY="auto"
          >
            <Flex
              as="aside"
              flexDir="column"
              display={{ base: "none", lg: "flex" }}
              w={320}
              minH="100%"
              bg="white"
              position="fixed"
              borderRightWidth="1px"
              borderColor="gray.200"
              transition="ease-in-out .2s"
            >
              {!isCoursePending && (
                <CourseSections
                  course={course}
                  currentSectionSlug={section}
                  currentLessonSlug={lesson}
                />
              )}
            </Flex>
            <Box ml={{ base: "0", lg: "320px" }} w={"full"} flexDir="column">
              <Flex w={"full"} position="fixed" zIndex={100} bg={"white"}>
                <Flex
                  w="full"
                  px={6}
                  py={6}
                  borderBottom="1px"
                  borderColor="gray.200"
                  alignItems={{base: "start", md: "center"}}
                  justifyContent={{base: "space-between", md: "space-between"}}
                  flexDir={{base: "column", md: "row"}}
                >
                  <Text
                    color="gray.700"
                    fontWeight="bold"
                    fontSize={{ base: "md", lg: "xl" }}
                    mb={{base: 3, md: 0}}
                  >
                    {course.title}
                  </Text>
                  <ChakraLink
                    mr={{ base: "0", lg: "320px" }}
                    href={`/courses/${course.slug}`}
                    fontSize="sm"
                    fontWeight="medium"
                    display="flex"
                    gap={2}
                    alignItems="center"
                    p={{base: 0, md: 2}}
                    px={{base: 0, md: 3}}
                    rounded="md"
                    _hover={{ textDecor: "none", bg: "gray.100" }}
                  >
                    <Icon as={IoLogOutOutline} color="gray.900" fontSize={20} />
                    Back to Course
                  </ChakraLink>
                </Flex>
              </Flex>

              <Box my={4} px={6} mt={"120px"}>
                <LessonContent
                  course={course}
                  currentSectionSlug={section}
                  currentLessonSlug={lesson}
                />
              </Box>
            </Box>
          </Flex>
        </>
      )}
    </>
  );
};

export default CourseViewer;
