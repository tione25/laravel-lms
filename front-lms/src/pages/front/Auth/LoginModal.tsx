import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import { useAuthModalsStore } from "../../../store/auth/auth";
import LoginForm from "./LoginForm";

const LoginModal = () => {
  const authModals = useAuthModalsStore();

  return (
    <>
      <Modal
        blockScrollOnMount={false}
        isOpen={authModals.loginModal}
        size="md"
        onClose={() => authModals.toggleLoginModal(false)}
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Sign In</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <LoginForm />
          </ModalBody>

          <ModalFooter>
            
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default LoginModal;
