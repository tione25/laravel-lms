import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from "@chakra-ui/react";
import Form from "./Form";

interface EditSectionModalProps {
  course: any
  section: any
  open: boolean
  setOpen: (value: boolean) => void
}


const EditSectionModal = ({ course, section, open, setOpen }: EditSectionModalProps) => {
  return (
    <>
      <Modal
        blockScrollOnMount={false}
        isOpen={open}
        size="md"
        onClose={() => setOpen(false)}
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Edit Course Chapter
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Form course={course} section={section} setOpen={setOpen}/>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditSectionModal;
