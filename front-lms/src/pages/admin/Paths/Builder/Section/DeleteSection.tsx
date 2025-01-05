import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import toast from "react-hot-toast";
import { deletePathSection } from "../../../../../api/admin/path";

interface DeleteSectionProps {
  path: any
  section: any
}

const DeleteSection = ({ path, section }: DeleteSectionProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation({
    mutationKey: ["Path"],
    mutationFn: deletePathSection,
    onSuccess: () => {
      toast.success('Section deleted');
      queryClient.invalidateQueries({ queryKey: ["Path"] });
    },
  });

  const onDelete = (e) => {
    e.preventDefault();

    onOpen();
  };

  const onConfirmDelete = async () => {
    try {
      await mutateAsync(section);

      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <IconButton
        icon={<FaRegTrashAlt />}
        colorScheme="unstyled"
        color="gray.600"
        fontSize={16}
        aria-label=""
        onClick={onDelete}
      />

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Course Chapter
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? This will delete all courses from this section
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={onConfirmDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default DeleteSection;
