import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  MenuItem,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import toast from "react-hot-toast";
import { deletePath } from "../../../api/admin/path";

interface DeleteDialog {
  course: any;
}

const DeleteDialog = ({ course }: DeleteDialog) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation({
    mutationKey: ["DeletePath"],
    mutationFn: deletePath,
    onSuccess: () => {
      toast.success("Path deleted");
      queryClient.invalidateQueries({ queryKey: ["Path"] });
      queryClient.invalidateQueries({ queryKey: ["Paths"] });
      queryClient.invalidateQueries({ queryKey: ["PathsTableData"] });
    },
    onError: (error) => {
      toast.error(error?.response.data.message);
    },
  });

  const onDelete = (e) => {
    e.preventDefault();
    onOpen();
  };

  const onConfirmDelete = async () => {
    try {
      await mutateAsync({ id: course });

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
              Delete path
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
