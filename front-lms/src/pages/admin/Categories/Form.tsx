import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SubmitHandler, useForm } from "react-hook-form";
import { storeCategory, updateCategory } from "../../../api/admin/categories";
import toast from "react-hot-toast";
import { useEffect } from "react";

interface FormProps {
  category?: any;
}

interface Input {
  id?: any;
  name?: any;
}

const Form = ({ category }: FormProps) => {
  const queryClient = useQueryClient();

  const { mutateAsync: storeNewCategoryMutation } = useMutation({
    mutationKey: ["CreateCategory"],
    mutationFn: storeCategory,
    onSuccess: () => {
      toast.success("Category created");
      queryClient.invalidateQueries({ queryKey: ["CreateCategory"] });
      queryClient.invalidateQueries({ queryKey: ["Category"] });
    },
  });

  const { mutateAsync: updateCategoryMutation } = useMutation({
    mutationKey: ["UpdateCategory"],
    mutationFn: updateCategory,
    onSuccess: () => {
      toast.success("Category updated");
      queryClient.invalidateQueries({ queryKey: ["Categories"] });
      queryClient.invalidateQueries({ queryKey: ["Category"] });
    },
  });

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm<Input>({
    defaultValues: {
      id: category?.id ?? "",
      name: category?.name ?? "",
    },
  });

  const onSubmit: SubmitHandler<Input> = async (values) => {
    try {
      if (!category) {
        await storeNewCategoryMutation(values);
      } else {
        await updateCategoryMutation(values);
      }
    } catch (e) {
      const error = e?.response?.data;

      if (error?.errors?.name) {
        setError("name", {
          type: "server",
          message: error.errors?.name,
        });
      }
    }
  };

  useEffect(() => {
    if (category) {
      setValue("name", category.name);
      setValue("id", category.id);
    }
  }, [category]);

  return (
    <>
      <Box>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex flexDir="column" gap={4}>
            <Box mt={10} maxW={"500px"}>
              <FormControl isInvalid={Boolean(errors?.name)}>
                <FormLabel htmlFor="short_description">Category Name</FormLabel>
                <Input
                  placeholder="Choose a name..."
                  {...register("name")}
                  aria-invalid={errors.name ? "true" : "false"}
                />
                <FormErrorMessage>
                  {errors.name && errors.name.message}
                </FormErrorMessage>
              </FormControl>
            </Box>
            <Box>
              <Button colorScheme="teal" type="submit">
                Save
              </Button>
            </Box>
          </Flex>
        </form>
      </Box>
    </>
  );
};

export default Form;
