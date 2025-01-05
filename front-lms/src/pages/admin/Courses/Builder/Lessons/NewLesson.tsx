import { Button, Flex } from "@chakra-ui/react";
import { useState } from "react";
import { BiPlus } from "react-icons/bi";
import NewLessonModal from "./NewLessonModal";

import CreateQuiz from "./QuizBuilder/CreateQuiz";

interface NewLessonProps {
    section: any
    course: any
}

const NewLesson = ({ section, course }: NewLessonProps) => {
  const [open, setOpen] = useState(false)

  return <>
    <Flex justifyContent="flex-end" gap={4}>
        <Button size="sm"  leftIcon={<BiPlus />} onClick={() => setOpen(true)}>New Lesson</Button>
        <CreateQuiz section={section} course={course}/>
    </Flex>
    <NewLessonModal section={section} open={open} setOpen={setOpen}/>
  </>;
};

export default NewLesson;
