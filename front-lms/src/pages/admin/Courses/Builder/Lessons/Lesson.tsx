import {
  AccordionItem,
  AccordionButton,
  Flex,
  IconButton,
  Box,
  Text,
  Badge,
} from "@chakra-ui/react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MdDragIndicator } from "react-icons/md";
import EditLesson from "./EditLesson";
import DeleteLesson from "./DeleteLesson";
import EditQuiz from "./QuizBuilder/EditQuiz";

interface LessonProps {
  course: any;
  section: any;
  lesson: any;
  lessonIndex: number;
  lessonSelected: any;
  setLessonSelected: (value: any) => void;
}

const Lesson = ({
  course,
  section,
  lesson,
  lessonIndex,
  lessonSelected,
  setLessonSelected,
}: LessonProps) => {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    setActivatorNodeRef,
    isDragging,
  } = useSortable({
    id: lesson.id,
    data: {
      type: "Lesson",
      lesson,
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  return (
    <>
      <AccordionItem
        ref={setNodeRef}
        style={style}
        key={lesson.id}
        borderTop={
          course.sections.length === 1 || lessonIndex === 0 ? "none" : ""
        }
        borderBottom="none"
      >
        <AccordionButton
          as="div"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box as="span" flex="1" textAlign="left">
            <Flex align="center">
              <IconButton
                icon={<MdDragIndicator />}
                aria-label=""
                colorScheme="unstyled"
                color="gray.600"
                fontSize={18}
                cursor="pointer"
                px={0}
                ref={setActivatorNodeRef}
                {...attributes}
                {...listeners}
              />
              <Text>{lesson.title}</Text>
            </Flex>
          </Box>
          <Flex alignItems="center">
            {lesson.is_quiz === 1 && (
              <Badge colorScheme='red'>quiz</Badge>
            )}
            {lesson.is_quiz === 0 && (
              <Badge colorScheme='green'>lesson</Badge>
            )}
            {lesson.is_quiz === 0 && (
              <EditLesson course={course} section={section} lesson={lesson} />
            )}
            {lesson.is_quiz === 1 && (
              <EditQuiz course={course} section={section} lesson={lesson}/>
            )}
            <DeleteLesson course={course} section={section} lesson={lesson} />
          </Flex>
        </AccordionButton>
      </AccordionItem>
    </>
  );
};

export default Lesson;
