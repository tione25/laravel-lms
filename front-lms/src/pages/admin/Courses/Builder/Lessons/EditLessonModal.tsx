import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from "@chakra-ui/react";
import Form from "./Form";

interface EditLessonModalProps {
  section: any
  lesson: any,
  open: boolean,
  setOpen: (value: boolean) => void,
}

const EditLessonModal = ({ section, lesson, open, setOpen }: EditLessonModalProps) => {
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
            Edit Course Lesson
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Form lesson={lesson} section={section} setOpen={setOpen}/>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditLessonModal;
