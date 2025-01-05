import {
  Stack,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Flex,
  Button,
  Select,
} from "@chakra-ui/react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  storeNewCourseSection,
  updateCourseSection,
} from "../../../../../api/admin/course";
import toast from "react-hot-toast";

interface NewSectionFormProps {
  course: any;
  section?: any;
  setOpen: (value: boolean) => void;
}

interface Inputs {
  courseId: number;
  title: string;
  id?: number | null;
  status: string;
}

const Form = ({ course, section, setOpen }: NewSectionFormProps) => {
  const queryClient = useQueryClient();

  const { mutateAsync: storeNewSectionMutation } = useMutation({
    mutationKey: ["Course"],
    mutationFn: storeNewCourseSection,
    onSuccess: () => {
      toast.success("Section created");
      queryClient.invalidateQueries({ queryKey: ["Course"] });
    },
  });

  const { mutateAsync: editSectionMutation } = useMutation({
    mutationKey: ["Course"],
    mutationFn: updateCourseSection,
    onSuccess: () => {
      toast.success("Section updated");
      queryClient.invalidateQueries({ queryKey: ["Course"] });
    },
  });

  const {
    handleSubmit,
    register,
    setError,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      courseId: course.id,
      id: section?.id,
      title: section?.title,
      status: section?.status,
    },
  });

  const onSubmit: SubmitHandler<Inputs> = async (values) => {
    try {
      if (section) {
        await editSectionMutation(values);
      } else {
        await storeNewSectionMutation(values);
      }

      setOpen(false);
    } catch (e: any) {
      const error = e.response.data;

      if (error.errors?.title) {
        setError("title", {
          type: "server",
          message: error.errors?.title,
        });
      }

      if (error.errors?.status) {
        setError("status", {
          type: "server",
          message: error.errors?.status,
        });
      }
    }
  };

  return (
    <>
      <form
        key={3}
        onSubmit={(e) => {
          e.stopPropagation();
          return handleSubmit(onSubmit)(e);
        }}
      >
        <Stack spacing={3} mb={6}>
          <FormControl isInvalid={Boolean(errors?.title)}>
            <FormLabel htmlFor="title">Title</FormLabel>
            <Input
              type="title"
              id="title"
              placeholder="Title"
              {...register("title", {
                required: "This is required",
              })}
            />
            <FormErrorMessage>
              {errors.title && errors.title.message}
            </FormErrorMessage>
          </FormControl>
        </Stack>
        <Flex justifyContent="flex-end" gap={4} mb={4}>
          <Button
            type="button"
            variant="ghost"
            mr={3}
            onClick={() => setOpen(false)}
          >
            Discard
          </Button>
          <Button type="submit" colorScheme="messenger">
            Save
          </Button>
        </Flex>
      </form>
    </>
  );
};

export default Form;
