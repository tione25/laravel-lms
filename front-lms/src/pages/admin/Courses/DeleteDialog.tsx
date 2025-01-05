import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  IconButton,
  MenuItem,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import toast from "react-hot-toast";
import { deleteCategory } from "../../../api/admin/categories";
import { deleteCourse } from "../../../api/admin/course";

interface DeleteDialog {
  course: any;
}

const DeleteDialog = ({ course }: DeleteDialog) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation({
    mutationKey: ["DeleteCourse"],
    mutationFn: deleteCourse,
    onSuccess: () => {
      toast.success("Course deleted");
      queryClient.invalidateQueries({ queryKey: ["Course"] });
      queryClient.invalidateQueries({ queryKey: ["Courses"] });
      queryClient.invalidateQueries({ queryKey: ["CoursesTableData"] });
    },
    onError: (error) => {
        toast.error(error?.response.data.message)
    },
  });

  const onDelete = (e) => {
    e.preventDefault();
    onOpen();
  };

  const onConfirmDelete = async () => {
    try {
      await mutateAsync({id: course});

      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <MenuItem icon={<FaRegTrashAlt />} onClick={onDelete}>
        {" "}
        <Text color={"black"} aria-label="">
          Delete
        </Text>
      </MenuItem>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Course
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

export default DeleteDialog;
