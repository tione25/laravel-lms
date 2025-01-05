import {
  Box,
  Flex,
  Text,
  Heading,
  SimpleGrid,
  Spinner,
} from "@chakra-ui/react";
import { getUser } from "../../services/useGetUser";
import CourseCard from "../../components/Front/CourseCard";
import { Navigate } from "react-router-dom";
import { Helmet } from 'react-helmet';

const MyCourses = () => {
  const { data: user, isPending, status } = getUser();

  if (!user) {
    return ""
  }

  return (
    <>
      <Helmet>
        <title>My Courses | CourseCasts</title>
      </Helmet>

      {!isPending ? (
        <>
          <Box my={20}>
            <Heading fontSize="2xl" fontWeight="normal" mb={6}>
              My Courses ({user?.enrollments?.length ?? 0})
            </Heading>
            <>
              {user?.enrollments?.length >= 0 && (
                <SimpleGrid
                  columns={{ base: 1, md: 3, xl: 4 }}
                  spacing={8}
                  p={1}
                  px={2}
                  rounded={"md"}
                >
                  {user?.enrollments?.map((enrollment) => (
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
          </Box>
        </>
      ) : !user && status == "pending" ? (
        <Navigate to="/" />
      ) : (
        <Flex w="100%" py={2} alignItems="center" justifyContent="center">
          <Spinner size="lg" color="gray.200" />
        </Flex>
      )}
    </>
  );
};

export default MyCourses;
