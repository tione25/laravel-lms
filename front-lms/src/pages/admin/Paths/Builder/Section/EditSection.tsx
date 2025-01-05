import { IconButton } from "@chakra-ui/react";
import { useState } from "react";
import EditSectionModal from "./EditSectionModal";
import { FaRegEdit } from "react-icons/fa";

const EditSection = ({ path, section }) => {
  const [open, setOpen] = useState(false);

  const onEdit = (e) => {
    e.preventDefault()

    setOpen(true)
  }

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
      <EditSectionModal
        path={path}
        section={section}
        open={open}
        setOpen={setOpen}
      />
    </>
  );
};

export default EditSection;
