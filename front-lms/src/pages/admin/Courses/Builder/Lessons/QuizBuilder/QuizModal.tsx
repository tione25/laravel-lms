import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import Form from "./Form";

interface QuizModalProps {
  course: any;
  section: any;
  lesson: any;
  open: boolean;
  setOpen: (bool: boolean) => void;
}

const QuizModal = ({ course, section, lesson,  open, setOpen }: QuizModalProps) => {
  return (
    <>
      <Modal
        blockScrollOnMount={false}
        isOpen={open}
        size="3xl"
        onClose={() => setOpen(false)}
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{lesson?.quiz ? 'Edit Quiz' : 'Create Quiz'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Form section={section} lesson={lesson} course={course} setOpen={setOpen}/>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default QuizModal;
