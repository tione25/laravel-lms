import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from "@chakra-ui/react";
import Form from "./Form";

interface NewLessonModalProps {
  section: any
  open: boolean,
  setOpen: (value: boolean) => void,
}


const NewLessonModal = ({ section, open, setOpen }: NewLessonModalProps) => {
  return (
    <>
      <Modal
        blockScrollOnMount={false}
        isOpen={open}
        size="2xl"
        onClose={() => setOpen(false)}
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Create Course Lesson
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Form section={section} setOpen={setOpen}/>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default NewLessonModal;
