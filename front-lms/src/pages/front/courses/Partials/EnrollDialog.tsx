import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
  useDisclosure,
  Text,
  Flex,
  Link as ChakraLink,
  Box,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { storeEnrollment } from "../../../../api/front/enrollments";
import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface EnrollDialogProps {
  user?: any;
  course: any;
}

const EnrollDialog = ({ user, course }: EnrollDialogProps) => {
  const queryClient = useQueryClient();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [isEnrolled, setIsEnrolled] = useState(
    user?.enrollments?.find((e) => e.course_id === course.id) ?? false
  );
  const [currentSection, setCurrentSection] = useState(
    course.enrollments?.[0]?.current_section
  );
  const [currentLesson, setCurrentLesson] = useState(
    course.enrollments?.[0]?.current_lesson ??
      course.course_sections?.[0]?.section_lessons?.[0]
  );

  const onEnroll = () => {
    onOpen();
  };


  const { mutateAsync: storeEnrollmentMutation, isPending } = useMutation({
    mutationKey: ["Enrollment"],
    mutationFn: storeEnrollment,
    onSuccess: () => {
      toast.success("Enrolled successfully!");
      queryClient.invalidateQueries({ queryKey: ["Course"] });
      queryClient.invalidateQueries({ queryKey: ["User"] });
    },
  });

  const enroll = async () => {
    try {
      setLoading(true);

      // simulate some delay
      setTimeout(async () => {
        await storeEnrollmentMutation(course);
        setLoading(false);
        onClose();
      }, 500);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    setIsEnrolled(
      !!course?.enrollments?.find((e) => e.course_id === course.id)
    );
    setCurrentSection(course.enrollments?.[0]?.current_section);
    setCurrentLesson(
      course.enrollments?.[0]?.current_lesson ??
        course.course_sections?.[0]?.section_lessons?.[0]
    );
  }, [course]);

  return (
    <>
      <Box
        bg={isEnrolled ? "teal.50" : "blue.50"}
        p={3}
        pb={4}
        rounded="md"
        mt={4}
      >
        {!isEnrolled && (
          <>
            <Text
              fontSize="xl"
              fontWeight="medium"
              color={"blue.600"}
              mb={6}
              textAlign="center"
            >
              Ready to Enroll?
            </Text>
            <Button
              colorScheme="messenger"
              variant="solid"
              w="full"
              fontSize={"xl"}
              py={6}
              onClick={onEnroll}
            >
              Enroll Now for Free
            </Button>
          </>
        )}
        {isEnrolled && (
          <>
            <Text
              fontSize="lg"
              fontWeight="mednormalium"
              color={"teal.600"}
              mb={6}
              textAlign="center"
            >
              {course?.enrollments?.[0]?.percentage_completed == "100" ? 
              'You have completed this course' : 'Continue were you left off.' }

            </Text>
            <Button
              as={ChakraLink}
              colorScheme="teal"
              variant="solid"
              w="full"
              fontSize={"xl"}
              py={6}
              _hover={{ textDecor: "none" }}
              href={`/courses/${course?.slug}/sections/${currentSection?.slug}/${currentLesson?.slug}`}
            >
              Continue Viewing
            </Button>
          </>
        )}
      </Box>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Information
            </AlertDialogHeader>

            <AlertDialogBody>
              {!user && (
                <Text>In order to enroll you need to have an account.</Text>
              )}
              {user && (
                <Text>Are you sure you want to enroll to this course?</Text>
              )}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Flex gap={2}>
                {!user && (
                  <Button ref={cancelRef} onClick={onClose}>
                    ok
                  </Button>
                )}
                {user && (
                  <>
                    <Button ref={cancelRef} onClick={onClose}>
                      Cancel
                    </Button>
                    <Button
                      isLoading={isPending || loading}
                      colorScheme="teal"
                      ref={cancelRef}
                      onClick={enroll}
                    >
                      Enroll
                    </Button>
                  </>
                )}
              </Flex>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default EnrollDialog;
