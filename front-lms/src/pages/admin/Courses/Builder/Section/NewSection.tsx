import { Button, Box } from "@chakra-ui/react";
import { BiPlus } from "react-icons/bi";
import NewSectionModal from "./NewSectionModal";
import { useState } from "react";

const NewSection = ({ course }) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Box>
        <Button
          leftIcon={<BiPlus />}
          w="full"
          colorScheme="teal"
          variant="outline"
          size="lg"
          onClick={() => setOpen(true)}
        >
          Add Chapter
        </Button>
      </Box>
      <NewSectionModal course={course} open={open} setOpen={setOpen}/>
    </>
  );
};

export default NewSection;
