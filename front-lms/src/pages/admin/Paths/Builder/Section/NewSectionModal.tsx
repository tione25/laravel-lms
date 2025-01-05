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
  path: any;
  open: boolean;
  setOpen: (value: boolean) => void;
}

const NewSectionModal = ({ path, open, setOpen }: NewSectionModalProps) => {
  return (
    <>
      <Modal
        blockScrollOnMount={false}
        isOpen={open}
        size="lg"
        onClose={() => setOpen(false)}
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Path Section</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Form path={path} setOpen={setOpen} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default NewSectionModal;
