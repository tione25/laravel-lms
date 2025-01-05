import { useState } from "react";
import QuizModal from "./QuizModal";
import { Button } from "@chakra-ui/react";
import { BiPlus } from "react-icons/bi";

interface CreateQuizModalProps {
  course: any;
  section: any;
  lesson?: any;
}

const CreateQuiz = ({ course, section, lesson }: CreateQuizModalProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button size="sm"  leftIcon={<BiPlus />} onClick={() => setOpen(true)}>New Quiz</Button>
      <QuizModal section={section} lesson={lesson} course={course} open={open} setOpen={setOpen}/>
    </>
  );
};

export default CreateQuiz;
