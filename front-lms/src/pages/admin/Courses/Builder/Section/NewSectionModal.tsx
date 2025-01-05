import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from "@chakra-ui/react";
import Form from "./Form";

interface NewSectionModalProps {
  course: any;
  open: boolean,
  setOpen: (value: boolean) => void,
}


const NewSectionModal = ({ course, open, setOpen }: NewSectionModalProps) => {
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
            Create Course Chapter
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Form course={course} setOpen={setOpen}/>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default NewSectionModal;
