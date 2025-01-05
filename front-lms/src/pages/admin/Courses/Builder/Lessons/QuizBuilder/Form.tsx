import {
  Stack,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Heading,
  Flex,
  Button,
  Accordion,
  Box,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  storeNewCourseSectionLessonQuiz,
  updateCourseSectionLessonQuiz,
} from "../../../../../../api/admin/course";
import {
  deleteQuizQuestion,
  storeQuizQuestion,
  updateQuizQuestion,
  storeQuizNewOption,
  updateQuizOption,
  deleteQuizOption,
} from "../../../../../../api/admin/quiz";
import toast from "react-hot-toast";
import QuizQuestion from "./QuizQuestion";

interface FormProps {
  course: any;
  section: any;
  lesson?: any;
  setOpen: (bool: boolean) => void;
}

interface Inputs {
  id: number;
  title: string;
  questions: [];
  sectionId: number;
}

const Form = ({ section, lesson, course, setOpen }: FormProps) => {
  const [questions, setQuestions] = useState([
    ...(lesson?.quiz?.questions ?? []),
  ]);

  const queryClient = useQueryClient();

  // quiz
  const { mutateAsync: storeSectionQuizMutation } = useMutation({
    mutationKey: ["CourseQuizCreate"],
    mutationFn: storeNewCourseSectionLessonQuiz,
    onSuccess: () => {
      toast.success("Quiz created");
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["Course"] });
    },
  });

  const { mutateAsync: updateSectionQuizMutation } = useMutation({
    mutationKey: ["CourseQuizUpdate"],
    mutationFn: updateCourseSectionLessonQuiz,
    onSuccess: () => {
      toast.success("Quiz updated");
      queryClient.invalidateQueries({ queryKey: ["Course"] });
    },
  });

  // question
  const { mutateAsync: storeQuizQuestionMutation } = useMutation({
    mutationKey: ["QuizQuestionStore"],
    mutationFn: storeQuizQuestion,
    onSuccess: () => {
      toast.success("Quiz Question created");
      queryClient.invalidateQueries({ queryKey: ["Course"] });
    },
  });

  const { mutateAsync: updateQuizQuestionMutation } = useMutation({
    mutationKey: ["QuizQuestionUpdate"],
    mutationFn: updateQuizQuestion,
    onSuccess: () => {
      toast.success("Quiz Question updated");
      queryClient.invalidateQueries({ queryKey: ["Course"] });
    },
  });

  const { mutateAsync: deleteQuizQuestionMutation } = useMutation({
    mutationKey: ["QuizQuestionDelete"],
    mutationFn: deleteQuizQuestion,
    onSuccess: () => {
      toast.success("Quiz Question deleted");
      queryClient.invalidateQueries({ queryKey: ["Course"] });
    },
  });

  // option
  const { mutateAsync: storeQuizOptionMutation } = useMutation({
    mutationKey: ["QuizOptionStore"],
    mutationFn: storeQuizNewOption,
    onSuccess: () => {
      toast.success("Quiz Question Option created");
      queryClient.invalidateQueries({ queryKey: ["Course"] });
    },
  });

  const { mutateAsync: updateQuizOptionMutation } = useMutation({
    mutationKey: ["QuizOptionUpdate"],
    mutationFn: updateQuizOption,
    onSuccess: () => {
      toast.success("Quiz Question Option updated");
      queryClient.invalidateQueries({ queryKey: ["Course"] });
    },
  });

  const { mutateAsync: deleteQuizOptionMutation } = useMutation({
    mutationKey: ["QuizOptionDelete"],
    mutationFn: deleteQuizOption,
    onSuccess: () => {
      toast.success("Quiz Question Option deleted");
      queryClient.invalidateQueries({ queryKey: ["Course"] });
    },
  });

  const {
    handleSubmit,
    register,
    setError,
    setValue,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      id: lesson?.quiz?.id,
      sectionId: section?.id,
      title: lesson?.quiz?.title,
    },
  });

  const onSubmit: SubmitHandler<Inputs> = async (values) => {
    try {
      if (lesson?.quiz) {
        await updateSectionQuizMutation(values);
      } else {
        await storeSectionQuizMutation(values);
      }
    } catch (e: any) {
      const error = e.response.data;

      if (error.errors?.title) {
        setError("title", {
          type: "server",
          message: error.errors?.title,
        });
      }
    }
  };

  const addQuestion = async (e) => {
    try {
      await storeQuizQuestionMutation({
        quiz_id: lesson?.quiz?.id,
        question: "Untitled Question",
      });
    } catch (e) {
      console.log(e);
    }
  };

  const updateQuestion = async (question) => {
    try {
      await updateQuizQuestionMutation(question);
    } catch (e) {
      console.log(e);
    }
  };

  const deleteQuestion = async (questions) => {
    try {
      await deleteQuizQuestionMutation({
        id: questions.id,
      });
    } catch (e) {
      console.log(e);
    }
  };

  // option
  const addOption = async (question) => {
    try {
      await storeQuizOptionMutation({
        question_id: question.id,
        option: "Untitled Option",
        is_correct: false,
      });
    } catch (e) {
      console.log(e);
    }
  };
  const updateOption = async (option) => {
    try {
      await updateQuizOptionMutation(option);
    } catch (e) {
      console.log(e);
    }
  };
  const deleteOption = async (option) => {
    try {
      await deleteQuizOptionMutation(option);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    course.sections.forEach((section) => {
      section.section_lessons.forEach((sectionLesson) => {
        if (lesson?.id === sectionLesson?.id) {
          setQuestions([...(sectionLesson?.quiz?.questions ?? [])]);
        }
      });
    });
  }, [course]);

  return (
    <>
      <form
        key={2}
        onSubmit={(e) => {
          e.stopPropagation();
          return handleSubmit(onSubmit)(e);
        }}
      >
        <Stack spacing={3} mb={6}>
          <FormControl isInvalid={Boolean(errors?.title)}>
            <FormLabel htmlFor="title">Title</FormLabel>
            <Input
              type="title"
              id="title"
              placeholder="Title"
              {...register("title", {
                required: "This is required",
              })}
            />
            <FormErrorMessage>
              {errors.title && errors.title.message}
            </FormErrorMessage>
          </FormControl>
        </Stack>
        <Flex justifyContent="flex-end" gap={4} mb={4}>
          <Button type="submit" colorScheme="messenger">
            Save
          </Button>
        </Flex>
      </form>
      {lesson?.quiz && (
        <Box>
          <Flex alignItems="center" justifyContent="space-between" mb={6}>
            <Heading fontSize="lg" mb={4}>
              Questions
            </Heading>
            <Button onClick={addQuestion}>Add Question</Button>
          </Flex>
          <Flex flexDir="column" gap={4} my={6}>
            <Accordion
              border="1px"
              rounded={10}
              borderColor="gray.300"
              allowToggle
            >
              {questions.map((question, questionIndex) => (
                <QuizQuestion
                  key={`question-index-${questionIndex}`}
                  question={question}
                  updateQuestion={updateQuestion}
                  deleteQuestion={deleteQuestion}
                  addOption={addOption}
                  updateOption={updateOption}
                  deleteOption={deleteOption}
                  questionIndex={questionIndex}
                />
              ))}
            </Accordion>
          </Flex>
        </Box>
      )}
    </>
  );
};

export default Form;
