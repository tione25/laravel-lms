import {
  Box,
  Flex,
  Icon,
  Progress,
  Text,
  Link as ChakraLink,
  useQuery,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaRegCirclePause, FaRegCirclePlay } from "react-icons/fa6";
import { MdOutlineDone, MdOutlineQuiz } from "react-icons/md";
import { getUser } from "../../../../services/useGetUser";

interface CourseSectionsProps {
  course: any;
  currentLessonSlug: string | undefined;
  currentSectionSlug: string | undefined;
}

const CourseSections = ({
  course,
  currentSectionSlug,
  currentLessonSlug,
}: CourseSectionsProps) => {
  const { data: user } = getUser()

  const [currentSection, setCurrentSectionSlug] = useState(
    course?.course_sections?.find(
      (section) => section.slug === currentSectionSlug
    )
  );

  const [percentage, setPercentage] = useState<number>(
    (course?.enrollments?.[0]?.sections?.find(
      (s) => s?.course_section_id === currentSection?.id
    )?.completed_lessons / currentSection?.section_lessons.length ?? 1) * 100 ??
      0
  );

  useEffect(() => {
    setPercentage(
      (course?.enrollments?.[0]?.sections?.find(
        (s) => s?.course_section_id === currentSection?.id
      )?.completed_lessons / currentSection?.section_lessons.length ?? 1) *
        100 ?? 0
    );
  }, [course]);


  return (
    <>
      <Flex
        flexDir="column"
        w="full"
        p={5}
        py={7}
        borderBottom="1px"
        borderColor="gray.100"
        gap={4}
        h={"150px"}
      >
        <Text fontSize="lg" fontWeight="medium" color="gray.600">
          Chapter : {currentSection?.title}
        </Text>
        {user && course?.enrollments && (
          <Box>
            <Progress hasStripe value={isNaN(percentage) ? 0 : percentage} colorScheme="green" mb={2} />
            <Text fontSize="md" fontWeight="medium" color="green.600">
              {isNaN(percentage) ? 0 : percentage.toFixed(0) }% complete
            </Text>
          </Box>
        )}
      </Flex>
      <Flex w="full" flexDir="column" flexBasis="100%" h="100%" maxH={"calc(100vh - 150px)"} overflowY="auto">
        {currentSection?.section_lessons?.map((lesson) => (
          <Flex
            as={ChakraLink}
            cursor="pointer"
            w="full"
            alignItems="center"
            gap={2}
            p={4}
            py={5}
            borderBottom="1px"
            bg={
              lesson.slug === currentLessonSlug
                ? lesson.is_quiz
                  ? "red.50"
                  : "green.50"
                : "white"
            }
            borderColor="gray.100"
            _hover={{ bg: "gray.50", textDecor: "none" }}
            transition="ease-in-out .2s"
            key={"lesson-" + lesson.id}
            href={`/courses/${course.slug}/sections/${currentSection.slug}/${lesson.slug}`}
          >
            <Box display="flex">
              {lesson.is_quiz === 0 &&
                lesson.slug !== currentLessonSlug &&
                lesson.enrollment_lessons?.[0]?.is_completed === 0 && (
                  <Icon
                    as={FaRegCirclePlay}
                    color={
                      lesson.slug === currentLessonSlug ? "green.600" : "black"
                    }
                    fontSize={20}
                  />
                )}
              {lesson.is_quiz === 0 &&
                lesson.slug !== currentLessonSlug &&
                lesson.enrollment_lessons?.[0]?.is_completed === 1 && (
                  <Icon as={MdOutlineDone} color={"green.600"} fontSize={20} />
                )}
              {lesson.is_quiz === 1 && (
                <Icon
                  as={MdOutlineQuiz}
                  color={
                    lesson.slug === currentLessonSlug ? "red.600" : "black"
                  }
                  fontSize={20}
                />
              )}

              {lesson.is_quiz === 0 && lesson.slug === currentLessonSlug && (
                <Icon as={FaRegCirclePause} color={"green.600"} fontSize={20} />
              )}
            </Box>
            {lesson.is_quiz === 0 && (
              <Text
                fontSize="md"
                color={
                  lesson.slug === currentLessonSlug ||
                  lesson.enrollment_lessons?.[0]?.is_completed === 1
                    ? "green.600"
                    : "gray.600"
                }
              >
                {lesson.title}
              </Text>
            )}
            {lesson.is_quiz === 1 && (
              <Text
                fontSize="md"
                color={
                  lesson.slug === currentLessonSlug &&
                  lesson.enrollment_lessons?.[0]?.is_completed === 1
                    ? "red.600"
                    : "gray.600"
                }
              >
                {lesson.title}
              </Text>
            )}
          </Flex>
        ))}
      </Flex>
    </>
  );
};

export default CourseSections;
