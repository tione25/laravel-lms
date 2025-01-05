import {
  IconButton,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import QuizModal from "./QuizModal";

interface CreateQuizModalProps {
  course: any;
  section: any;
  lesson?: any;
}

const EditQuiz = ({ course, section, lesson }: CreateQuizModalProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <IconButton
        icon={<FaRegEdit />}
        colorScheme="unstyled"
        color="gray.600"
        fontSize={16}
        aria-label=""
        onClick={() => setOpen(true)}
      />
      <QuizModal section={section} lesson={lesson} course={course} open={open} setOpen={setOpen}/>
    </>
  );
};

export default EditQuiz;
