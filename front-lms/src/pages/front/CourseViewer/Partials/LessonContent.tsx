import { useEffect, useState } from "react";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateCompleteSectionLesson,
  updateEnrollmentOnVisit,
} from "../../../../api/front/enrollments";
import { FaArrowRightLong } from "react-icons/fa6";
import toast from "react-hot-toast";
import LessonQuizModal from "./Quiz/LessonQuizModal";
import Video from "./Video";

import "react-quill/dist/quill.core.css";
import "react-quill/dist/quill.snow.css";
import { getUser } from "../../../../services/useGetUser";
import { Navigate } from "react-router-dom";
import FeedbackModal from "./FeedbackModal";

interface LessonContentProps {
  course: any;
  currentLessonSlug: string | undefined;
  currentSectionSlug: string | undefined;
}

const LessonContent = ({
  course,
  currentSectionSlug,
  currentLessonSlug,
}: LessonContentProps) => {
  const queryClient = useQueryClient();

  const { data: user } = getUser();
  const [courseCompleted, setCourseCompleted] = useState(false);

  const [currentSection, setCurrentSectionSlug] = useState(
    course?.course_sections?.find(
      (section) => section.slug === currentSectionSlug
    )
  );

  const [currentLesson, setCurrentLesson] = useState(
    currentSection?.section_lessons?.find(
      (lesson) => lesson.slug === currentLessonSlug
    )
  );

  const [nextSection, setNextSection] = useState(
    course?.course_sections?.find(
      (courseSection) => courseSection?.id > currentSection?.id
    )
  );

  const [nextLesson, setNextLesson] = useState(
    currentSection?.section_lessons.find(
      (sectionLesson) => sectionLesson?.id > currentLesson?.id
    )
  );

  const { mutateAsync: updateEnrollmentSectionMutation } = useMutation({
    mutationKey: ["Course"],
    mutationFn: updateEnrollmentOnVisit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Course"] });
    },
  });

  const { mutateAsync: updateEnrollmentLessonCompleteMutation } = useMutation({
    mutationKey: ["Course"],
    mutationFn: updateCompleteSectionLesson,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Course"] });
    },
  });

  const onComplete = async () => {
    try {
      const { data } = await updateEnrollmentLessonCompleteMutation({
        id: course?.enrollments?.[0].id,
        course_section: currentSection.id,
        section_lesson: currentLesson.id,
      });

      console.log(data, {
        id: course?.enrollments?.[0].id,
        course_section: currentSection.id,
        section_lesson: currentLesson.id,
      });

      if (data.course_completed) {
        toast.success("Course Completed");
        setTimeout(() => {
          setCourseCompleted(true);
        }, 500);
      }

      if (!data.section_completed) {
        toast.success("Lesson completed!");
        setTimeout(() => {
          window.location.href = `/courses/${course.slug}/sections/${currentSection.slug}/${data.next_lesson.slug}`;
        }, 1000);
      }

      if (data.section_completed && !data.course_completed) {
        toast.success("Section completed!");
        setTimeout(() => {
          window.location.href = `/courses/${course.slug}/sections/${data.next_section.slug}/${data.next_lesson.slug}`;
        }, 1000);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const goToNext = () => {
    // find next lesson if any
    if (!nextLesson) {
      if (nextSection) {
        window.location.href = `/courses/${course.slug}/sections/${nextSection.slug}/${nextSection?.section_lessons[0]?.slug}`;
      }
    }

    if (nextLesson) {
      window.location.href = `/courses/${course.slug}/sections/${currentSection.slug}/${nextLesson.slug}`;
    }
  };

  useEffect(() => {
    const update = async () => {
      try {
        if (user && typeof course?.enrollments) {
          console.log('here');
          await updateEnrollmentSectionMutation({
            id: course?.enrollments?.[0]?.id,
            course_section: currentSection?.id,
            section_lesson: currentLesson?.id,
          });
        }
      } catch (e) {
        console.log(e);
      }
    };
    update();
  }, [currentSection]);

  if (!currentLesson || !currentSection) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <Box>
        <Flex
          flexDir={{base: "column", xl: "row"}}
          border="1px"
          borderColor="gray.300"
          rounded="md"
          py={6}
          px={6}
          alignItems={{base: "start", xl: "center"}}
          justifyContent="space-between"
          my={10}
        >
          <Text fontSize="2xl" fontWeight="medium" mb={{base: 3, xl: "0"}}>
            {currentLesson?.title}
          </Text>
          {course?.enrollments?.[0]?.completed === 0 &&
            !currentSection?.enrollment_sections?.[0]?.completed_at &&
            !currentLesson?.enrollment_lessons?.[0]?.is_completed && (
              <Button
                display="flex"
                alignItems="center"
                rightIcon={<FaArrowRightLong />}
                colorScheme="teal"
                onClick={onComplete}
                fontSize="sm"
                aria-label="Complete and continue"
              >
                Complete and continue
              </Button>
            )}
          {typeof course?.enrollments == "undefined" &&
            (nextLesson || nextSection) && (
              <Button
                display="flex"
                alignItems="center"
                rightIcon={<FaArrowRightLong />}
                colorScheme="teal"
                onClick={goToNext}
                fontSize="sm"
                aria-label="Next"
              >
                Next
              </Button>
            )}
        </Flex>
        
        {!currentLesson?.quiz && (
          <Box>
            {currentLesson?.type === "video" && (
              <Video lesson={currentLesson} />
            )}
            {currentLesson?.description && (
              <Box className="ql-snow">
                <Box
                  className="ql-editor"
                  style={{ minHeight: "auto" }}
                  dangerouslySetInnerHTML={{
                    __html: currentLesson?.description,
                  }}
                ></Box>
              </Box>
            )}
          </Box>
        )}

        {currentLesson?.quiz && (
          <LessonQuizModal
            course={course}
            lesson={currentLesson}
            section={currentSection}
          />
        )}

        {courseCompleted && <FeedbackModal course={course} />}
      </Box>
    </>
  );
};

export default LessonContent;
