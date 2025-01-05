import {
  Box,
  Button,
  Text,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Divider,
  Flex,
  Spinner,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { storeQuizEnrollment } from "../../../../../api/front/enrollments";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import "react-quill/dist/quill.core.css";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import { getUser } from "../../../../../services/useGetUser";

interface LessonQuizModalProps {
  course: any;
  lesson: any;
  section: any;
}

interface Answer {
  question_id: number;
  options: number[];
}

const LessonQuizModal = ({ course, lesson, section }: LessonQuizModalProps) => {
  const { data: user } = getUser();

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([] as Answer[]);

  const [enrollmentQuiz, setEnrollmentQuiz] = useState(
    course?.enrollments?.[0]?.quizzes?.find(
      (quiz) => quiz?.section_lesson_id == lesson?.id
    )
  );

  const { mutateAsync: storeQuizEnrollmentMutation, isPending } = useMutation({
    mutationKey: ["QuizEnrollment"],
    mutationFn: storeQuizEnrollment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Course"] });
    },
    onError: () => {
      navigate(`/courses/${course.slug}`);
    },
  });

  const nextQuestion = async () => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      if (currentQuestionIndex + 1 < lesson?.quiz?.questions?.length) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }
    }, 500);
  };

  const selectAnswer = (id: number) => {
    if (
      !answers.find(
        (answer) =>
          answer.question_id == lesson?.quiz?.questions[currentQuestionIndex].id
      )
    ) {
      setAnswers([
        ...answers,
        {
          question_id: lesson?.quiz?.questions[currentQuestionIndex].id,
          options: [id],
        },
      ]);
    } else {
      setAnswers(
        answers?.map((answer: Answer) => {
          if (
            answer.question_id ==
            lesson?.quiz?.questions[currentQuestionIndex].id
          ) {
            let option = answer.options.filter((optionId) => optionId === id);

            if (!option.length) {
              answer.options = [...answer.options, id];
            } else {
              answer.options = answer.options.filter(
                (optionId) => optionId !== id
              );
            }
          }
          return answer;
        })
      );
    }
  };

  const sendResults = async () => {
    try {
      await storeQuizEnrollmentMutation({
        id: course?.enrollments?.[0]?.id,
        course_section: section.id,
        section_lesson: lesson.id,
        answers: answers,
      });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    setEnrollmentQuiz(
      course?.enrollments?.[0]?.quizzes?.find(
        (quiz) => quiz?.section_lesson_id == lesson?.id
      )
    );
  }, [course]);

  return (
    <>
      <Button
        w="full"
        colorScheme="blue"
        size="lg"
        fontSize={"xl"}
        onClick={() => setOpen(true)}
      >
        View Quiz
      </Button>
      <Modal
        blockScrollOnMount={false}
        isOpen={open}
        size="2xl"
        onClose={() => setOpen(false)}
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Quiz: {lesson.quiz.title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box mb={6}>
              {(isPending || isLoading) && (
                <Flex
                  alignItems="center"
                  justifyContent="center"
                  w="full"
                  py={4}
                >
                  <Spinner color="gray.300" />
                </Flex>
              )}

              {!isPending && !isLoading && !enrollmentQuiz && (
                <>
                  <Box mb={4}>
                    <Text fontWeight="medium">
                      Question : {lesson?.quiz?.questions?.length ? ( currentQuestionIndex + 1) : 0} /{" "}
                      {lesson?.quiz?.questions?.length}
                    </Text>
                  </Box>
                  {lesson?.quiz?.questions?.map((question, index) => (
                    <Box key={`question-${question.id}`}>
                      {currentQuestionIndex === index && (
                        <>
                          <Flex flexDir="column" gap={4} mb={4}>
                            <Text fontSize={"xl"}>{question.question}</Text>
                            <Divider />
                            {question?.description && (
                              <Box className="ql-snow">
                                <Box
                                  className="ql-editor"
                                  style={{ minHeight: "auto" }}
                                  dangerouslySetInnerHTML={{
                                    __html: question.description,
                                  }}
                                ></Box>
                              </Box>
                            )}
                          </Flex>
                          <Flex flexDir={"column"} gap={4} mt={4}>
                            {question?.options?.map((option) => (
                              <Flex
                                p={3}
                                rounded="md"
                                border="1px"
                                borderColor="gray.300"
                                alignItems="center"
                                justifyContent="center"
                                cursor="pointer"
                                bg={
                                  answers.find((answer) =>
                                    answer.options.find((o) => o == option?.id)
                                  )
                                    ? "green.50"
                                    : "white"
                                }
                                _hover={{ bg: "gray.50" }}
                                transition={"ease-in-out .3s"}
                                key={`option-${option.id}`}
                                onClick={() => selectAnswer(option.id)}
                              >
                                <Text fontWeight="medium" color="gray.500">
                                  {option.option}
                                </Text>
                              </Flex>
                            ))}
                          </Flex>
                        </>
                      )}
                    </Box>
                  ))}
                </>
              )}

              {currentQuestionIndex + 1 < lesson?.quiz?.questions?.length &&
                !enrollmentQuiz && (
                  <Flex my={4} justifyContent="flex-end">
                    <Button colorScheme="green" onClick={() => nextQuestion()}>
                      Next Question
                    </Button>
                  </Flex>
                )}

              {currentQuestionIndex + 1 >= lesson?.quiz?.questions?.length &&
                !enrollmentQuiz &&
                user &&
                course?.enrollments?.[0]?.completed != 1 && (
                  <Flex my={4} justifyContent="flex-end">
                    <Button colorScheme="green" onClick={() => sendResults()}>
                      Save
                    </Button>
                  </Flex>
                )}

              {enrollmentQuiz && (
                <Box>
                  <Text fontSize="2xl" textAlign="center" mb={1}>
                    Your score is : {enrollmentQuiz?.score} /{" "}
                    {enrollmentQuiz?.total_score} points
                  </Text>
                  <Text fontSize="sm" color={"gray.500"} textAlign="center">
                    Each correct answer is equal with 10 points
                  </Text>
                </Box>
              )}

              {!enrollmentQuiz || course?.enrollments?.[0]?.completed == 1 && (
                <Text fontSize="sm" color={"gray.500"} textAlign="center">
                  No score to show for the quiz was not done.
                </Text>
              )}
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default LessonQuizModal;
