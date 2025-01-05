import { Navigate, useParams } from "react-router-dom";
import { client } from "../../../utils/client";
import { useQuery } from "@tanstack/react-query";
import {
  Text,
  Grid,
  GridItem,
  Heading,
  Image,
  Box,
  Divider,
  Flex,
  TabList,
  Tab,
  TabPanel,
  TabPanels,
  Tabs,
  Spinner,
  Progress,
} from "@chakra-ui/react";
import Star from "../../../components/Front/StarRating/Star";
import { getUser } from "../../../services/useGetUser";
import EnrollDialog from "./Partials/EnrollDialog";
import Curriculum from "./Partials/Curriculum";
import RelatedCourses from "../../../components/Front/ui/RelatedCourses";

import { Helmet } from 'react-helmet';

const ShowCourse = () => {
  const { slug } = useParams();
  const { data: user, isPending: userPending } = getUser();

  const {
    data: course,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["Course", slug],
    queryFn: async () => {
      return client.get(`/courses/${slug}`).then((response) => response.data);
    },
    retry: 0,
  });

  if (isError) {
    return <Navigate to={"/"} />;
  }

  return (
    <>
      <Helmet>
        <title>{(course?.title ?? '') + ' | CourseCasts'}</title>
      </Helmet>

      {isPending && (
        <Flex w="100%" alignItems="center" justifyContent="center">
          <Spinner size="lg" color="gray.200" />
        </Flex>
      )}
      {!isPending && (
        <>
          <Grid templateColumns="repeat(12, 1fr)" gap={7} my={16}>
            <GridItem
              w="100%"
              colSpan={{ base: 12, md: 8 }}
              bg="gray.50"
              p={4}
              rounded="md"
            >
              <Box>
                <Text fontSize="md" color="gray.300">
                  {course?.category?.name}
                </Text>
              </Box>
              <Heading mb={4} color="gray.600">
                <Text fontSize="3xl" maxW={"600px"}>
                  {course?.title}
                </Text>
              </Heading>
              <Box mb={6}>
                <Text color="gray.600">{course.short_description}</Text>
              </Box>
              <Box mb={6}>
                <Flex gap={4}>
                  <Star rating={course?.feedback_rating ?? 0} canHover={false} />
                </Flex>
              </Box>
              <Tabs mt={4}>
                <TabList bg="white" h={16}>
                  <Tab>Overview</Tab>
                  <Tab>Curriculum</Tab>
                  <Tab>Feedback</Tab>
                </TabList>

                <TabPanels bg="white">
                  <TabPanel>
                    <Box>
                      <Box className="ql-snow">
                        <Box
                          className="ql-editor"
                          style={{ minHeight: "auto" }}
                          dangerouslySetInnerHTML={{
                            __html: course?.description,
                          }}
                        ></Box>
                      </Box>
                    </Box>
                  </TabPanel>
                  <TabPanel>
                    <Curriculum course={course} user={user} />
                  </TabPanel>
                  <TabPanel>
                    <Box>Feedback is helpful!</Box>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </GridItem>
            <GridItem w="100%" colSpan={{ base: 12, md: 4 }}>
              <Image
                boxSize="full"
                height={{ base: 300, md: 300 }}
                objectFit="cover"
                src={"https://sealms-api.levelcoding.com/storage/" + course?.preview_image}
                rounded={8}
                fallbackSrc="https://via.placeholder.com/800"
                mb={6}
              />
              <Divider />
              {course?.enrollments?.[0]?.percentage_completed >= 0 && (
                <Flex flexDir="column">
                  <Progress
                    value={course?.enrollments?.[0]?.percentage_completed ?? 0}
                    size="sm"
                    colorScheme="green"
                    rounded={"md"}
                    hasStripe={true}
                  />
                </Flex>
              )}
              <Box>
                <EnrollDialog user={user} course={course} />
              </Box>
            </GridItem>
          </Grid>
          <RelatedCourses course_id={course?.id} category_id={course?.category_id} />
        </>
      )}
    </>
  );
};

export default ShowCourse;
