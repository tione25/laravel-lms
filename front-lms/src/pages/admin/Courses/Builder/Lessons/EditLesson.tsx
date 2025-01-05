import { IconButton } from "@chakra-ui/react";
import { useState } from "react";
import EditSectionModal from "./EditLessonModal";
import { FaRegEdit } from "react-icons/fa";
import EditLessonModal from "./EditLessonModal";

const EditLesson = ({ course, section, lesson }) => {
  const [open, setOpen] = useState(false);

  const onEdit = (e) => {
    e.preventDefault();

    setOpen(true);
  };

  return (
    <>
      <IconButton
        icon={<FaRegEdit />}
        colorScheme="unstyled"
        color="gray.600"
        fontSize={16}
        aria-label=""
        onClick={onEdit}
      />
      <EditLessonModal
        section={section}
        lesson={lesson}
        open={open}
        setOpen={setOpen}
      />
    </>
  );
};

export default EditLesson;
