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
import { deletePathCourse } from "../../../../api/admin/path";
import { useParams } from "react-router-dom";

interface DeleteCourseProps {
  section: any;
  course: any;
}

const DeleteCourse = ({ section, course }: DeleteCourseProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  const { id } = useParams();

  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation({
    mutationKey: ["Path"],
    mutationFn: deletePathCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Path", id] });
    },
  });

  const onDelete = (e) => {
    e.preventDefault();

    onOpen();
  };

  const onConfirmDelete = async () => {
    try {
      await mutateAsync({ section, course });

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
              Remove Path Course
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
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

export default DeleteCourse;
