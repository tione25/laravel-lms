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
import { deleteCourseSection } from "../../../../../api/admin/course";
import toast from "react-hot-toast";

interface DeleteSectionProps {
  course: any
  section: any
}

const DeleteSection = ({ course, section }: DeleteSectionProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation({
    mutationKey: ["Course"],
    mutationFn: deleteCourseSection,
    onSuccess: () => {
      toast.success('Section deleted');
      queryClient.invalidateQueries({ queryKey: ["Course"] });
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
              Are you sure? This will delete all lessons/quizes and also remove 
              this data from enrollments
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
