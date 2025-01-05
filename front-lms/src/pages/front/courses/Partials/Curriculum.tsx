import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Text,
  Flex,
  Icon,
  Box,
  Button,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { IoPlayOutline } from "react-icons/io5";

interface CurriculumProps {
  course: any;
  user?: any
}

const Curriculum = ({ course, user }: CurriculumProps) => {
  return (
    <>
      <Accordion
        bg="white"
        border="1px"
        rounded={4}
        borderColor="gray.300"
        allowToggle
      >
        {course &&
          course?.course_sections?.map((section, index) => (
            <AccordionItem
              borderTop={index === 0 ? "none" : ""}
              borderBottom={
                index == course?.course_sections?.length - 1 ? "none" : ""
              }
              key={`section-${section.id}`}
            >
              <AccordionButton
                as="div"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                py={4}
              >
                <Flex gap={4}>
                  <AccordionIcon />
                  <Flex gap={4} alignItems="center">
                    <Text fontSize="md">{section.title}</Text>
                    {user && section?.enrollment_sections?.length > 0 && (
                      <Button
                        as={ChakraLink}
                        size="sm"
                        colorScheme="green"
                        href={`/courses/${course.slug}/sections/${section.slug}/${section.section_lessons?.[0]?.slug}`}
                        _hover={{ textDecor: "none" }}
                      >
                        Continue
                      </Button>
                    )}
                    {user && course?.enrollments?.length > 0 && section?.enrollment_sections?.length === 0 && (
                      <Button
                        as={ChakraLink}
                        size="sm"
                        colorScheme="blue"
                        _hover={{ textDecor: "none" }}
                        href={`/courses/${course.slug}/sections/${section.slug}/${section.section_lessons?.[0]?.slug}`}
                      >
                        Start
                      </Button>
                    )}
                    {!user && index == 0 && (
                      <Button
                        as={ChakraLink}
                        size="sm"
                        colorScheme="blue"
                        _hover={{ textDecor: "none" }}
                        href={`/courses/${course.slug}/sections/${section.slug}/${section.section_lessons?.[0]?.slug}`}
                      >
                        Start
                      </Button>
                    )}
                  </Flex>
                </Flex>
                <Text fontSize="xs" color={"gray.600"}>
                  {user && course?.enrollments && ((section?.enrollment_sections?.[0]?.completed_lessons ?? 0) + '/')}
                  {section?.section_lessons.length ?? 0} lessons
                </Text>
              </AccordionButton>
              <AccordionPanel>
                {section?.section_lessons.map((lesson) => (
                  <Flex flexDir="column" gap={4} key={`lesson-${lesson.id}`}>
                    <Flex
                      as={ChakraLink}
                      alignItems="center"
                      gap={4}
                      px={2}
                      py={2}
                      mb={2}
                      cursor="pointer"
                      _hover={{ bg: "gray.50", textDecor: "none" }}
                      href={`/courses/${course.slug}/sections/${section.slug}/${lesson.slug}`}
                    >
                      <Box bg="gray.100" display="flex" rounded="full" p={1}>
                        <Icon as={IoPlayOutline} color="gray.400" />
                      </Box>
                      <Text fontSize="sm" color="gray.600">
                        {lesson.title}
                      </Text>
                    </Flex>
                  </Flex>
                ))}
              </AccordionPanel>
            </AccordionItem>
          ))}
      </Accordion>
    </>
  );
};

export default Curriculum;
