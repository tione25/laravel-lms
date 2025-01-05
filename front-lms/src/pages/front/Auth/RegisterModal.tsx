import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import { useAuthModalsStore } from "../../../store/auth/auth";

const RegisterModal = () => {
  const authModals = useAuthModalsStore();

  return (
    <>
      <Modal
        blockScrollOnMount={false}
        isOpen={authModals.registerModal}
        size="md"
        onClose={() => authModals.toggleRegisterModal(false)}
        motionPreset='slideInBottom'
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Sign Up</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Hello</ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => authModals.toggleRegisterModal(false)}
            >
              Close
            </Button>
            <Button variant="ghost">Sign In</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default RegisterModal;
