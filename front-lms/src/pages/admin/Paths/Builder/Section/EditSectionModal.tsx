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
  path: any
  section: any
  open: boolean
  setOpen: (value: boolean) => void
}

const EditSectionModal = ({ path, section, open, setOpen }: EditSectionModalProps) => {
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
          <ModalHeader>
            Edit Path Section
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Form path={path} section={section} setOpen={setOpen}/>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditSectionModal;
