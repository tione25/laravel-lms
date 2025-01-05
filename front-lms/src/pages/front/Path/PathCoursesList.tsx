import {
  Box,
  Divider,
  Flex,
  Grid,
  GridItem,
  List,
  ListIcon,
  ListItem,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import PathCourseCard from "./PathCourseCard";
import { MdCheckCircle, MdOutlineDone } from "react-icons/md";

interface PathCoursesListProps {
  path: any;
}

const PathCoursesList = ({ path }: PathCoursesListProps) => {
  return (
    <>
      <Box maxW={"7xl"} mx={"auto"} mb={6}>
        {path?.sections?.map((section) => (
          <>
            <Grid templateColumns="repeat(12, 1fr)" gap={6} mb={20} key={section.id}>
              <GridItem colSpan={{ base: 12, lg: 4 }} h={"100%"}>
                <Box bg="teal.50" p={4} h={"100%"} rounded="md">
                  <Text
                    fontSize="3xl"
                    fontWeight="medium"
                    mb={4}
                    color="teal.900"
                  >
                    {section.title}
                  </Text>
                  <Divider mb={4} />
                  <Box my={4}>
                    <Flex gap={4}>
                      <Flex
                        flexDir="column"
                        alignItems="center"
                        bg="teal.100"
                        p={2}
                        rounded="md"
                        w={"100%"}
                      >
                        <Text
                          color="teal.700"
                          fontSize="2xl"
                          fontWeight="semibold"
                        >
                          {section.courses_count ?? 0}
                        </Text>
                        <Text
                          fontSize="sm"
                          fontWeight="semibold"
                          color="teal.700"
                        >
                          Courses
                        </Text>
                      </Flex>
                      <Flex
                        flexDir="column"
                        alignItems="center"
                        bg="teal.100"
                        p={2}
                        rounded="md"
                        w={"100%"}
                      >
                        <Text
                          color="teal.700"
                          fontSize="2xl"
                          fontWeight="semibold"
                        >
                          {section.courses_completed_count ?? 0}
                        </Text>
                        <Text
                          fontSize="sm"
                          fontWeight="semibold"
                          color="teal.700"
                        >
                          Completed
                        </Text>
                      </Flex>
                    </Flex>
                  </Box>
                  <Text color="teal.800">{section.description}</Text>
                  <Box my={6}>
                    <Box bg="teal.100" p={2} rounded="md" color="teal.700">
                      Things You'll Learn
                    </Box>
                    <List spacing={3} my={4}>
                      {section?.courses?.map((course) => (
                        <ListItem color="teal.800" key={course.id}>
                          <ListIcon as={MdOutlineDone} />
                          {course.title}
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </Box>
              </GridItem>
              <GridItem colSpan={{ base: 12, lg: 8 }}>
                <Flex flexDir="column" gap={8}>
                  {section?.courses?.map((course) => (
                    <PathCourseCard course={course} key={course.id} />
                  ))}
                </Flex>
              </GridItem>
            </Grid>
          </>
        ))}
      </Box>
    </>
  );
};

export default PathCoursesList;
